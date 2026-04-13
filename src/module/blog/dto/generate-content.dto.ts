import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  keywords?: string;
}
