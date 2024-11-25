import dotenv from 'dotenv'; 
import s3 from '../clients/s3.client';
import { IFileStrategy } from './file.strategy';
dotenv.config();  // Load environment variables from .env file 


class S3FileService implements IFileStrategy{
    async uploadFile(fileName: string, file: Express.Multer.File): Promise<any> {
        const params = {
            Bucket: 'cloud-file-storage.sirius',         // El nombre de tu bucket
            Key: fileName, // Carpeta organizada por usuario
            Body: file.buffer,                  // El archivo que se sube (usando Multer)
            ContentType: file.mimetype,         // El tipo de archivo (ej. imagen, pdf, etc.)
          };
        
          try {
            const data = await // The `.promise()` call might be on an JS SDK v2 client API.
            // If yes, please remove .promise(). If not, remove this comment.
            s3.putObject(params);
            console.log('File uploaded successfully:', data);
            return true;
          } catch (err) {
            console.error('Error uploading file:', err);
            throw new Error('Error uploading file to S3');
          }
    }

    async downloadFile(fileName: string): Promise<NodeJS.ReadableStream> {
        const params = {
            Bucket: 'cloud-file-storage.sirius',
            Key: fileName, // Nombre del archivo o key que deseas recuperar
        };
          
        try {
          const data = await s3.getObject(params);
              
          // Verifica que 'data.Body' sea un stream
          const body = data.Body as NodeJS.ReadableStream;
        
          console.log('File retrieved successfully:', data);
          return body;
        } catch (err) {
          console.error("S3 error:", err);
          throw null;
        }
    }

    async deleteFile(fileName: string): Promise<any> {
        const params = {
            Bucket: 'cloud-file-storage.sirius',
            Key: fileName, // Nombre del archivo o key que deseas recuperar
        };
        try{
            await s3.deleteObject(params);
            
        }catch (err) {
            console.error("S3 error:", err);
            throw null;
        }
    }
}


export default S3FileService;
/*
// Función para compartir un archivo entre usuarios
export const shareFileBetweenUsers = async (fileKey: string, sourceUser: string, targetUser: string) => {
  const params = {
      Bucket: 'cloud-file-storage.sirius',  // El nombre del bucket
      CopySource: `cloud-file-storage.sirius/${sourceUser}/${fileKey}`, // Origen del archivo: la ruta original
      Key: `${targetUser}/${fileKey}`, // Destino del archivo: en la carpeta del usuario destino
  };

  try {
      const data = await s3.copyObject(params); // Copiar el archivo
      console.log('File shared successfully:', data);
      return true;
  } catch (err) {
      console.error('Error sharing file:', err);
      throw new Error('Error sharing file between users');
  }
};
*/