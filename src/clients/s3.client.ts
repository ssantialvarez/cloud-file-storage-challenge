import { S3 } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-provider-env';


// Configuración del SDK de AWS para S3 en v3
const s3 = new S3({
    region: 'us-east-2',
    credentials: fromEnv(), // Usa las credenciales definidas en el entorno
});

export default s3;