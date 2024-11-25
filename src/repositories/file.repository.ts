import { PrismaClient, Upload } from "@prisma/client";
import { bool } from "aws-sdk/clients/signer";


const prisma = new PrismaClient();
export async function createUpload(fileName: string, userId:string,size:number){
    try{
        // Crea el registro Upload
        await prisma.upload.create({
            data: {fileName, userId, size}
        });
    }catch(error){
        throw(error);
    }
};

export async function deleteByFilename(fileName:string, userId: string) {
    // Busca el archivo dado el nombre y el userId
    let upload = await prisma.upload.findUnique({
        where:{
            fileName_userId:{fileName, userId}
        }
    });
    console.log(upload);
    // Si no lo encuentra, no continua
    if(!upload)
        throw new Error("The upload exists");

    // Si lo encuentra, lo borra
    await prisma.upload.delete({
        where:{
            fileName_userId:{fileName, userId}
        }
    });
}

export async function deleteUploadsByUserID(userId:string) {
    try{
      await prisma.upload.deleteMany({where:{userId:userId}})
    }catch(error){
      throw(error);
    }
}

export async function getUploadsByUserId(userId:string):Promise<Upload[]|void> {
    try{
      return await prisma.upload.findMany({where:{userId:userId}});
    }catch(error){
      throw error;
    }   
}


export async function existingFile(userId:string, fileName: string):Promise<boolean|void> {
  try{
    const exists = await prisma.upload.findUnique({
      where:{
        fileName_userId:{fileName, userId}
      }
    })
    if(!exists)
      return false;

    return true;
  }catch(error){
    throw error;
  }   
}


// Función para obtener la suma de los tamaños de los archivos subidos en el mes
export const getMonthlyUploadSize = async (userId: string): Promise<number> => {
    const currentDate = new Date();
  
    // Obtenemos el primer y último día del mes actual
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  
    try {
      const result = await prisma.upload.aggregate({
        _sum: {
          size: true,
        },
        where: {
          userId: userId,   
          uploaded: {
            gte: startOfMonth, 
            lte: endOfMonth,   
          },
        },
      });
  
      
      return result._sum.size || 0;
    } catch (error) {
      console.error('Error al obtener el tamaño de los archivos subidos este mes:', error);
      throw new Error('No se pudo calcular la suma del tamaño de los archivos subidos');
    }
};

// Función para obtener la suma de los tamaños de los archivos subidos en el dia
export const getDailyUploadSize = async (userId: string): Promise<number> => {
    const currentDate = new Date();
  
    
    const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
  
    try {
      const result = await prisma.upload.aggregate({
        _sum: {
          size: true,
        },
        where: {
          userId: userId,   
          uploaded: {
            gte: startOfDay, 
            lte: endOfDay,   
          },
        },
      });
  
      
      return result._sum.size || 0;
    } catch (error) {
      console.error('Error al obtener el tamaño de los archivos subidos este dia:', error);
      throw new Error('No se pudo calcular la suma del tamaño de los archivos subidos');
    }
};