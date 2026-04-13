import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsObject()
  @IsOptional()
  author?: { id: string };
}
