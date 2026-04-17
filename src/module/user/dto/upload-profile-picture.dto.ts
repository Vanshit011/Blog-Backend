import { IsString, IsNotEmpty } from 'class-validator';

export class UploadProfilePictureDto {
  @IsString()
  @IsNotEmpty()
  profile_picture: string;
}
