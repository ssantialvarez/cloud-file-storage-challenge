
export interface IFileStrategy {
    uploadFile(fileName: string, file: Express.Multer.File): Promise<any>;
    downloadFile(fileName: string):Promise<NodeJS.ReadableStream>;
    deleteFile(fileName: string):Promise<any>;
}
  