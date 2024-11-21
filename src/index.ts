// src/index.ts
import express from 'express';

const app = express();


// Middleware para parsear cuerpos JSON
app.use(express.json());  

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});