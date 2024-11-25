
export interface IFileStrategy {
    uploadFile(fileName: string, file: Express.Multer.File): Promise<any>;
    downloadFile(fileName: string):Promise<NodeJS.ReadableStream>;
    deleteFile(fileName: string):Promise<any>;
    shareFile(sourcePath: string, targetPath: string):Promise<any>;
}
  