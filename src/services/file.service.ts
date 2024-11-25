import minioClient from "../clients/minio.client";
import { createUpload, deleteByFilename, existingFile, getMonthlyUploadSize } from "../repositories/file.repository";
import { error } from "console";
import S3FileService from "./s3.service";
import MinioFileService from "./minio.service";
import { IFileStrategy } from "./file.strategy";


export async function share(bucketName: string, targetBucketName: string, fileName: string) {
    try{
        const sourceBucketNameAndObjectName = `/${bucketName}/${fileName}`;
        await minioClient.copyObject(targetBucketName, fileName, sourceBucketNameAndObjectName);
    }catch(error){
        throw(error);
    }
}

export async function deleteFile(fileName: string) {
    try {
        let uploadService: IFileStrategy;
        
        // Elimina primero en MinIO
        uploadService = new MinioFileService()
        await uploadService.deleteFile(fileName);
        
        
        // Despues en S3
        uploadService = new S3FileService();
        await uploadService.deleteFile(fileName);
        
    } catch (error) {
        throw new Error(`Error fetching file: ${error}`);
    }
}

export async function deleteUpload(fileName:string, userId: string) {
    try{
        // Elemina el registro en la base de datos
        await deleteByFilename(fileName,userId);
    }catch(error){
        throw new Error(`Error deleting upload: ${error}`);
    }
}

export async function download(fileName: string) {
    try {
        let uploadService: IFileStrategy;
        
        // Verifica primero en MinIO
        uploadService = new MinioFileService()
        const minioStream = await uploadService.downloadFile(fileName);
        if (minioStream) {
            return minioStream; // Si MinIO tiene el archivo, devuelve el stream
        }
        
        // Si no está en MinIO, verifica en S3
        uploadService = new S3FileService();
        const s3Stream = await uploadService.downloadFile(fileName);
        if (s3Stream) {
            return s3Stream; // Si S3 tiene el archivo, devuelve el stream
        }
        
        throw new Error('File not found in both MinIO and S3');
    } catch (error) {
        throw new Error(`Error fetching file: ${error}`);
    }
}

export async function upload(userId: string, file: Express.Multer.File) {
    try{        
        const filePath = `uploads/${userId}/${file.originalname}`;
        const monthlySize = await getMonthlyUploadSize(userId);
        
        if(((monthlySize + file.size)/1_000_000_000) > 5){
            throw(error);
        }
        let uploadService: IFileStrategy;
        uploadService = new S3FileService();
        await uploadService.uploadFile(filePath, file);

        uploadService = new MinioFileService();
        await uploadService.uploadFile(filePath, file);

        

        await createUpload(file.originalname, userId,file.size);
    }catch(error){
        throw(error);
    }
}


