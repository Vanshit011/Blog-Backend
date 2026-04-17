import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error(error.message));
          }
          if (!result) {
            return reject(new Error('Cloudinary upload result is undefined'));
          }
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
