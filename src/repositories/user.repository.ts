import { PrismaClient, User } from "@prisma/client";
import { Role } from "../utils/user.dto";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 8

export async function createUser(data:{username:string,password:string,role?:Role}):Promise<User|void>{
    let user:User|null= await prisma.user.findUnique({
        where:{
            username:data.username
        }
    });

    if(user)
        throw new Error("Username already exists");


    data.password = await bcrypt.hash(data.password, saltRounds);

    return prisma.user.create({
        data: data
    });
};

export async function validateUser(data:{username:string,password:string,role?:Role}):Promise<User|void> {
    let user = await prisma.user.findUnique({
        where:{
            username:data.username
        }
    });

    if(!user)
        throw new Error("User doesn't exists");

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