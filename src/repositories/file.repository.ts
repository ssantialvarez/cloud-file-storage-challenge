import { PrismaClient, Upload } from "@prisma/client";


const prisma = new PrismaClient();
export async function createUpload(fileName: string, userId:string,size:number){
    try{
        await prisma.upload.create({
            data: {fileName, userId, size}
        });
    }catch(error){
        throw(error);
    }
};

export async function deleteByFilename(fileName:string, userId: string) {
    
    let upload = await prisma.upload.findUnique({
        where:{
            fileName_userId:{fileName, userId}
        }
    });
    console.log(upload);
    if(!upload)
        throw new Error("The upload exists");


    await prisma.upload.delete({
        where:{
            fileName_userId:{fileName, userId}
        }
    });
}

export async function getUploadsByUserId(userId:string):Promise<Upload[]|void> {
    return await prisma.upload.findMany({where:{userId:userId}})
}

// Función para obtener la suma de los tamaños de los archivos subidos en el mes
export const getMonthlyUploadSize = async (userId: string): Promise<number> => {
    const currentDate = new Date();
  
    // Obtener el primer y último día del mes actual
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
  
    try {
      const result = await prisma.upload.aggregate({
        _sum: {
          size: true,
        },
        where: {
          userId: userId,   // Filtramos por el ID del usuario
          uploaded: {
            gte: startOfMonth, // Fecha mayor o igual al primer día del mes
            lte: endOfMonth,   // Fecha menor o igual al último día del mes
          },
        },
      });
  
      // Si no hay registros, la suma será 0
      return result._sum.size || 0;
    } catch (error) {
      console.error('Error al obtener el tamaño de los archivos subidos este mes:', error);
      throw new Error('No se pudo calcular la suma del tamaño de los archivos subidos');
    }
};


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
  
      // Si no hay registros, la suma será 0
      return result._sum.size || 0;
    } catch (error) {
      console.error('Error al obtener el tamaño de los archivos subidos este mes:', error);
      throw new Error('No se pudo calcular la suma del tamaño de los archivos subidos');
    }
};