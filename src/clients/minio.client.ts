import { Client } from 'minio';

// Configuración del cliente MinIO
const minioClient = new Client({
  //endPoint: 'host.docker.internal',  
  endPoint: 'localhost',  
  port: 9000,            
  useSSL: false,         
  accessKey: 'cloud-storage',  // Usuario definido en docker-compose
  secretKey: 'cloud-storage'   // Contraseña definida en docker-compose
});

export default minioClient;