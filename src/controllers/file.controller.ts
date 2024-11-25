import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middleware/auth";
import { JwtPayload } from "jsonwebtoken";
import { deleteFile, deleteUpload, download, share, upload } from "../services/file.service";

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return ;
        }
        const token = (req as CustomRequest).token as JwtPayload;  
       
        
        await upload(token.id, req.file);
          
        res.status(200).json({ message: 'File uploaded successfully'});
        return ;
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
        return ;
    }
};

export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileName = req.params.fileName;
        
        const token = (req as CustomRequest).token as JwtPayload;  
        
        const fileKey = `uploads/${token.id}/${fileName}`;
        
        const fileStream = await download(fileKey);

        // Verificamos que realmente se haya obtenido un stream antes de proceder
        if (!fileStream) {
            res.status(404).send('File not found');
            return;
        }
  
        // Configuramos los encabezados de la respuesta para indicar que es un archivo descargable
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        fileStream.pipe(res);        
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Error downl file' });
        return ;
    }
}

export const shareFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { targetBucketName, fileName } = req.body
        const token = (req as CustomRequest).token as JwtPayload;  
        const bucketName = token.name as string;
        
        await share(bucketName,targetBucketName,fileName);
        res.status(200).json({ message: 'File shared successfully', fileName });
        
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
        return ;
    }
}

export const delFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = (req as CustomRequest).token as JwtPayload;  
        
        const fileName = req.params.fileName;
        
        const fileKey = `uploads/${token.id}/${fileName}`;
        
        await deleteFile(fileKey);
        await deleteUpload(fileName,token.id);
        res.status(200).json({ message: 'File deleted successfully'});
        return ;
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Error deleting file' });
        return ;
    }
};