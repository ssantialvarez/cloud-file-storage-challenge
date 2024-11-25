import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middleware/auth";
import { JwtPayload } from "jsonwebtoken";
import { deleteFile, deleteUpload, download, share, upload } from "../services/file.service";
import { getUserByUsername } from "../services/user.service";
import { User } from "@prisma/client";

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Verificamos que haya un archivo en Request
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return ;
        }
        // Del token de autorizacion podemos obtener el id del user que esta subiendo el archivo 
        const token = (req as CustomRequest).token as JwtPayload;  
       
        // Subimos el archivo
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
        // Armamos la ruta/fileKey para hallar el archivo
        const fileKey = `uploads/${token.id}/${fileName}`;
        // Descargamos el archivo y obtenemos el ReadableStream
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
        res.status(500).json({ error: 'Error downloading file' });
        return ;
    }
}

export const shareFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { targetUsername, fileName } = req.body
        const token = (req as CustomRequest).token as JwtPayload;  
        const userFound = await getUserByUsername(targetUsername) as User;
        
        const filePath = `uploads/${token.id}/${fileName}`;
        const targetPath =  `uploads/${userFound.id}/${fileName}`;
        await share(targetPath,filePath);
        res.status(200).json({ message: 'File shared successfully', fileName });
        
    } catch (error) {
        console.error('Error while sharing file:', error);
        res.status(500).json({ error: 'Error while sharing file' });
        return ;
    }
}

export const delFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = (req as CustomRequest).token as JwtPayload;  
        
        const fileName = req.params.fileName;
        
        const fileKey = `uploads/${token.id}/${fileName}`;
        
        // Primero eliminamos el archivo de la nube
        await deleteFile(fileKey);
        // Luego se elimina el registro Upload de la base de datos
        await deleteUpload(fileName,token.id);
        res.status(200).json({ message: 'File deleted successfully'});
        return ;
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Error deleting file' });
        return ;
    }
};
