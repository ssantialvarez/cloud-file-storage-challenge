import { Role } from "../utils/user.dto";
import { createUser, validateUser, getAllUsers, getById, deleteByUsername } from "../repositories/user.repository";
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from "../middleware/auth";
import { User } from "@prisma/client";
import { getDailyUploadSize } from "../repositories/file.repository";


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

export async function getStatsUsers():Promise<{ username: string; role: string; userSizeGb: number }[]|void>{

    try{
        const users = await getAllUsers() as User[];
        const stats: { username: string; role: string; userSizeGb: number }[] = []; // Nuevo array para los resultados

        const userSizes = await Promise.all(
            users.map(user => getDailyUploadSize(user.id).then(userSize => ({ user, userSize })))
        );

        for (const { user, userSize } of userSizes) {
            
            // Solo agrega al nuevo array los usuarios cuyo tamaño no sea 0
            if (userSize > 0) {
                stats.push({
                    username: user.username,
                    role: user.role,
                    userSizeGb: (userSize/1_000_000_000)
                });                
            }
        }

        // Devuelve el array de usuarios filtrados
        return stats;
    }catch(e){
        throw new Error("Unable to get users");
    }
};

export async function getUserById(id:string):Promise<User|void>{
    try{
        return await getById(id);
    }catch(e){
        throw new Error("Unable to get user");
    }
}

export async function deleteUserByUsername(username:string){
    try{
        await deleteByUsername(username);
    }catch(e){
        throw new Error("Unable to get user");
    }
}