import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  category_id: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  cover_image?: string;

  @IsObject()
  @IsOptional()
  author?: { id: string };
}
