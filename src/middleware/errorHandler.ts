import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Si hay un error, responde con un mensaje y código de estado
  console.error(err.stack); // Loguear el error
  res.status(500).json({ message: 'Algo salió mal en el servidor' }); // Mensaje genérico de error
};

export default errorHandler;