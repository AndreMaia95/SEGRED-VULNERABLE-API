import express from 'express';
import { UserController } from '../controllers/UserController.js';

const router = express.Router();

router.get('/users/:id', UserController.getProfile);
router.post('/register', UserController.register);
router.post('/login', UserController.login);

export default router;