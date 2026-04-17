import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Body,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/constants/enum';
import { RolesGuard } from '../../shared/guards/roles.guard';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('upload')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @GetUser('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: any,
  ) {
    return this.userService.uploadProfilePicture(userId, file);
  }

  @Get('profile')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getMyProfile(@GetUser() user: User) {
    return this.userService.findByIdOrUsername(user.id);
  }

  @Patch('profile/:id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getPublicProfile(@Param('id') identifier: string) {
    return this.userService.findByIdOrUsername(identifier);
  }
}
