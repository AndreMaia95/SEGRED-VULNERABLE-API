import express from 'express';
import { UserController } from '../controllers/UserController.js';
import path from 'path';

const router = express.Router();

router.get('/users/:id', UserController.getProfile);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/download', (req, res) => {
    const file = req.query.name;
    // Vulnerável porque não valida se o utilizador está a tentar subir pastas com "../"
    res.sendFile(path.resolve(`public/reports/${file}`));
});

export default router;