import minioClient from "../clients/minio.client";
import { IFileStrategy } from "./file.strategy";



class MinioFileService implements IFileStrategy{
    async uploadFile(fileName: string, file: Express.Multer.File): Promise<any> {
        try {
            // Subimos el archivo a MinIO 
            await minioClient.putObject('cloud-file-storage.sirius', fileName, file.buffer, file.size);  
            console.log('File uploaded successfully');
            return true;
            
          } catch (err) {
            console.error('Error uploading file:', err);
            throw new Error('Error uploading file to minIO');
          }
    }
    async downloadFile(fileName: string): Promise<NodeJS.ReadableStream> {
        try {
            const stream = await minioClient.getObject("cloud-file-storage.sirius", fileName);
            return stream; // Devuelve el stream de MinIO
        } catch (error) {
            console.error("MinIO error:", error);
            throw error;
        }
    }
    async deleteFile(fileName: string): Promise<any> {
        try{
            await minioClient.removeObject("cloud-file-storage.sirius", fileName);
        }catch(error){
            console.error("MinIO error:", error);
            throw error;
        }
    }
}


export default MinioFileService;