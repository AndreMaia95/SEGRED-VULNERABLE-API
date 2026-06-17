import express from 'express';
import userRoutes from '../src/infrastructure/web/routes/userRoutes.js';

const app = express();
app.use(express.json());

app.use('/api', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Laboratório a correr na porta ${PORT}`);
});