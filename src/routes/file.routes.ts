import { Router } from 'express'
import multer from 'multer';
import { delFile, downloadFile, shareFile, uploadFile } from '../controllers/file.controller';
import { auth } from '../middleware/auth';


const router = Router();

// Configuración de multer para el manejo de archivos
const storage = multer.memoryStorage();  // Usamos almacenamiento en memoria para subir el archivo
const upload = multer({ storage });


router.post('/upload', auth, upload.single('file'), uploadFile);
router.get('/download/:fileName',auth,downloadFile);
router.post('/share',auth,shareFile);
router.delete('/delete/:fileName',auth,delFile);


export default router;

