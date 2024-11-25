import { Client } from 'minio';

// Configuración del cliente MinIO
const minioClient = new Client({
  endPoint: 'localhost',  // Dirección de tu servidor MinIO (localhost si está en el mismo entorno)
  port: 9000,            // Puerto en el que MinIO está escuchando
  useSSL: false,         // Usa SSL (en este caso, no lo estamos usando)
  accessKey: 'cloud-storage',  // Usuario definido en docker-compose
  secretKey: 'cloud-storage'   // Contraseña definida en docker-compose
});

export default minioClient;