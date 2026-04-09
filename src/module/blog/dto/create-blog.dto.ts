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
  slug: string;

  @IsObject()
  @IsOptional()
  author?: { id: string };
}
