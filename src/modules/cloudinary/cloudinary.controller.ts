import { Body, Controller, Delete, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private cloudinaryService: CloudinaryService) { }

    @Post("upload-multiple-files")
    @UseInterceptors(FilesInterceptor('files'))
    async cloudUploadFiles(@UploadedFiles() files: any, @Body() body: any) {
        const { path } = body;
        return this.cloudinaryService.uploadFiles(files, path)
    }

    @Delete("delete-file")
    async cloudDelete(@Body("publicId") publicId: string) {
        return this.cloudinaryService.deleteFile(publicId)
    }

    
}
