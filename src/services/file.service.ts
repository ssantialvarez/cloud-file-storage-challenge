import minioClient from "../clients/minio.client";
import { createUpload, deleteByFilename, existingFile, getMonthlyUploadSize, getUploadByFileNameUserId, getUploadsByUserId } from "../repositories/file.repository";
import { error } from "console";
import S3FileService from "./s3.service";
import MinioFileService from "./minio.service";
import { IFileStrategy } from "./file.strategy";
import { Upload } from "@prisma/client";


export async function share(targetPathName: string, sourcePath: string, targetUserId: string, sourceUserId: string) {
    try{
        let uploadStrategies : IFileStrategy[] = [(new S3FileService()), (new MinioFileService())];
        for(const strat of uploadStrategies){
            strat.shareFile(sourcePath,targetPathName);
        }
        const originalname = targetPathName.split('/')[2];
        console.log(originalname);
        const upload = await getUploadByFileNameUserId(sourceUserId,originalname) as Upload;
        await createUpload(originalname, targetUserId, upload.size);
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

        let uploadStrategies : IFileStrategy[] = [(new S3FileService()), (new MinioFileService())];
        const filePath = `uploads/${userId}/${file.originalname}`;
        const monthlySize = await getMonthlyUploadSize(userId);
        
        if(((monthlySize + file.size)/1_000_000_000) > 5){
            throw(error);
        }

        for(const strat of uploadStrategies){
            strat.uploadFile(filePath, file);
        }
        
        await createUpload(file.originalname, userId,file.size);
    }catch(error){
        throw(error);
    }
}

export async function getUploadsFromUser(userId: string){
    try{        

        return getUploadsByUserId(userId);
    
    }catch(error){
        throw(error);
    }
}


