import { Request, Response, NextFunction } from 'express';
import { getErrorMessage } from '../utils/errors.util';
import { getAll, getUserById, login, register } from '../services/user.service';
import { CustomRequest } from '../middleware/auth';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from '@prisma/client';

export const loginOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = await login(req.body);
        res.status(200).send(token);
    } catch (error) {
        res.status(500).send(getErrorMessage(error));  
    }
};

export const registerOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await register(req.body);
        res.status(200).send('Inserted successfully');
    } catch (error) {
        res.status(500).send(getErrorMessage(error));
    }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = (req as CustomRequest).token as JwtPayload;
      
        const user = await getUserById(token.id);
        if(user && user.role == Role.USER){
            res.status(403).send('sali de aca pajero')
            return ;
        }
        

        const allUsers = await getAll();
        res.status(200).send(allUsers);
    } catch (error) {
        res.status(500).send(getErrorMessage(error));  
    }
};