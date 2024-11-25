import { Request, Response, NextFunction } from 'express';
import { getErrorMessage } from '../utils/errors.util';
import { deleteUserByUsername, getStatsUsers, getUserById, login, register } from '../services/user.service';
import { CustomRequest } from '../middleware/auth';
import { JwtPayload } from 'jsonwebtoken';
import { Role, User } from '@prisma/client';

export const loginOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Logueamos con username y password 
        const token = await login(req.body);
        // Enviamos JWT token
        res.status(200).send(token);
    } catch (error) {
        res.status(400).send(getErrorMessage(error));  
    }
};

export const registerOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Registramos usuario
        await register(req.body);
        
        res.status(200).send('Inserted successfully');
    } catch (error) {
        res.status(409).send(getErrorMessage(error));
    }
    
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = (req as CustomRequest).token as JwtPayload;
        // Verificamos que el usuario llamando a /delete endpoint sea ADMIN
        const user = await getUserById(token.id) as User;
        if(user.role == Role.USER){
            res.status(403).send('Cannot delete. Only administrator.')
            return ;
        }
        // Se obtiene el username a eliminar.
        const username  = req.params.username;
        await deleteUserByUsername(username);

        res.status(200).send('Deleted successfully');
    } catch (error) {
        res.status(400).send(getErrorMessage(error));
    }
    
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = (req as CustomRequest).token as JwtPayload;
        
        const user = await getUserById(token.id) as User;
        if(user.role == Role.USER){
            res.status(403).send('Only administrator.')
            return ;
        }
        
        const users = await getStatsUsers();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(getErrorMessage(error));  
    }
};

