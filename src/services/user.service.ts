import { Role } from "../utils/user.dto";
import { createUser, validateUser, getAllUsers, getById } from "../repositories/user.repository";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../middleware/auth";
import { User } from "@prisma/client";

export async function register(data:{username:string, password:string, role?:Role}): Promise<void> {
    try {
        await createUser(data);
    } catch (error) {
        throw error;
    }
};
   
export async function login(data:{username:string, password:string, role?:Role}) {
    try{
        const foundUser = await validateUser(data);

        
        if (foundUser) {
            const token = jwt.sign({ id: foundUser.id?.toString(), name: foundUser.username }, SECRET_KEY, {
                expiresIn: '1h',
            });

            return { token: token };
        } else {
             throw new Error('Password is not correct');
        }
    }catch(e:unknown){
        throw e;
    }
};

export async function getAll():Promise<User[]|void>{
    try{
        return await getAllUsers();
    }catch(e){
        throw new Error("Unable to get users");
    }
};

export async function getUserById(id:string):Promise<User|void>{
    try{
        return await getById(id);
    }catch(e){
        throw new Error("Unable to get users");
    }
}