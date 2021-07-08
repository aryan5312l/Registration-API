import express from 'express';
const router = express.Router();
import register from '../controllers/register'
import login from '../controllers/login'
import userController from '../controllers/userController'
import auth from '../middlewares/auth';
import refreshController from '../controllers/refreshController'
import product from '../controllers/product';
import admin from '../middlewares/admin'

router.post('/register', register.register)
router.post('/login', login.login)
router.get('/me', auth ,userController.me)
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, login.logout)
router.post('/product', [auth, admin], product.store)
router.put('/product/:id', [auth, admin], product.update)
router.delete('/product/:id', [auth, admin], product.destroy)
router.get('/product', product.index)
router.get('/product/:id', product.show)

export default router