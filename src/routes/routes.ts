import { Router } from 'express'
import validation from '../middleware/validation';
import { CreateUserDTO } from '../utils/user.dto';
import { loginOne, registerOne, getStats } from '../controllers/user.controller';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/login',validation(CreateUserDTO),loginOne);
router.post('/register', registerOne);
router.get('/stats',auth,getStats);


export default router;

