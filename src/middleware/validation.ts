import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { Request, Response, NextFunction} from "express";

export default function validateRequest(dtoClass:any){
    return async(req:Request,res:Response,next:NextFunction)=> {
        try{
            const errors = await validate(plainToInstance(dtoClass,req.body));

            if(errors.length > 0){
                const formattedErrors = errors.map(error=>({
                    property:error.property,
                    constraints:error.constraints
                }));

                res.status(400).json({ errors: formattedErrors });
            }
            else{
                next()
            }
        }catch(e){
            res.status(500).json({error:'Internal server error'})
        }
    }
}