import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { extname } from 'path';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    allowedFileExtensions = ['.png', '.jpeg', '.jpg'];

    validateFileExtension(file: Express.Multer.File) {
        const valid = this.allowedFileExtensions.some(ext => ext === extname(file.originalname).toLowerCase());
        if (!valid) {
            throw new BadRequestException(`Invalid file extension. Allowed extensions: ${this.allowedFileExtensions.join(', ')}`);
        }
    }

    async uploadFiles(files: any, path: string) {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }
        const filePromises = files.map(async (file: any) => {
            this.validateFileExtension(file);
            const base64Data = file.buffer.toString('base64');
            const dataUrl = `data:${file.mimetype};base64,${base64Data}`;
            let options: any = {};
            if (path) options.folder = path
            const result = await cloudinary.uploader.upload(dataUrl, options);
            if (!result) {
                throw new InternalServerErrorException('Failed to upload images');
            }
            const image = {
                public_id: result.public_id,
                url: result.secure_url,
                width: result.width,
                height: result.height,
            }
            return image
        });
        const results = await Promise.all(filePromises);
        return results

    } catch(error: any) {
        throw new InternalServerErrorException(error);
    }

    async deleteFile(publicId: string) {
        const deleted = await cloudinary.uploader.destroy(publicId);
        return deleted;
    }

    async deleteImagesFolder(folder: string): Promise<any> {
        try {
            await cloudinary.api.delete_resources_by_prefix(folder)
            const deleted = await cloudinary.api.delete_folder(folder)
            return deleted;
        } catch (err) {
            return null
        }
    }
}
