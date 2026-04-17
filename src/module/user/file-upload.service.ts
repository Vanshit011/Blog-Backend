import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class FileUploadService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadFile(file: any, folder: string): Promise<string> {
    try {
      const result = (await this.cloudinaryService.uploadFile(
        file,
        folder,
      )) as any;
      if (result && typeof result === 'object' && 'secure_url' in result) {
        return result.secure_url as string;
      }
      throw new Error('Upload failed: secure_url not found in result');
    } catch (error) {
      console.error('File upload error:', error);
      throw new BadRequestException('Failed to upload file');
    }
  }
}
