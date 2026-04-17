import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  content?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  category_id?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  slug?: string;

  @IsString()
  @IsOptional()
  cover_image?: string;

  @IsString()
  @IsOptional()
  status?: any;
}
