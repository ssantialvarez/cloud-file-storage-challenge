import { PrismaClient, User } from "@prisma/client";
import { Role } from "../utils/user.dto";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const saltRounds = 8

export async function createUser(data:{username:string,password:string,role?:Role}):Promise<User|void>{
    // Primero verifica que el username no exista en la base de datos
    let user:User|null= await prisma.user.findUnique({
        where:{
            username:data.username
        }
    });
    // Si ya existia, envia el error
    if(user)
        throw new Error("Username already exists");

    // Encripta password para JWT Auth
    data.password = await bcrypt.hash(data.password, saltRounds);

    return prisma.user.create({
        data: data
    });
};

export async function validateUser(data:{username:string,password:string,role?:Role}):Promise<User|void> {
    // Busca el usuario
    let user = await prisma.user.findUnique({
        where:{
            username:data.username
        }
    });

    if(!user)
        throw new Error("User doesn't exists");
    // Compara la contraseña
    const isMatch = await bcrypt.compare(data.password, user.password);

    if(isMatch)
        return user;
    else
        throw new Error("Password doesn't match");
};

export async function getAllUsers():Promise<User[]|void>{
    return await prisma.user.findMany();
};

export async function getById(id:string):Promise<User|void>{
    let user = await prisma.user.findUnique({
        where:{
            id:id
        }
    });

    if(!user)
        throw new Error("User doesn't exists");

    return user;
}


export async function getByUsername(username:string):Promise<User|void>{
    let user = await prisma.user.findUnique({
        where:{
            username:username
        }
    });

    if(!user)
        throw new Error("User doesn't exists");

    return user;
}

export async function deleteByUsername(username:string){
    let user = await prisma.user.findUnique({
        where:{
            username:username
        }
    });
    console.log(user);
    if(!user)
        throw new Error("User doesn't exists");


    await prisma.user.delete({
        where:{
            username:username
        }
    });

    
}