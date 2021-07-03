import express from 'express';
const router = express.Router();
import register from '../controllers/register'
import login from '../controllers/login'
import userController from '../controllers/userController'
import auth from '../middlewares/auth';

router.post('/register', register.register)
router.post('/login', login.login)
router.get('/me', auth ,userController.me)


export default router