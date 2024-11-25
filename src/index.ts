// src/index.ts
import express from 'express';
import cors from 'cors';
import errorMiddleware from './middleware/errorHandler';
import helmet from 'helmet';
import fileRoutes from './routes/file.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(express.json());  
app.use(express.urlencoded({extended:false}));
app.use(errorMiddleware);
app.use(helmet());
app.use(cors());

app.use('/api', fileRoutes);
app.use('', userRoutes);


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});