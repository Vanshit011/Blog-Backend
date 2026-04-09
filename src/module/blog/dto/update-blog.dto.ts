import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}
