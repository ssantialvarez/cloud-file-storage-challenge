// src/index.ts
import express from 'express';
import cors from 'cors';
import errorMiddleware from './middleware/errorHandler';
import helmet from 'helmet';
import routes from './routes/routes';


const app = express();

app.use(express.json());  
app.use(express.urlencoded({extended:false}));
app.use(errorMiddleware);
app.use(helmet());
app.use(cors());

app.use('/api', routes);


app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});