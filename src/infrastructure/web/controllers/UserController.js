import { GetUserProfile } from '../../../core/use-cases/GetUserProfile.js';
import { RegisterUser } from '../../../core/use-cases/RegisterUser.js';
import { LoginUser } from '../../../core/use-cases/LoginUser.js';

export const UserController = {
    getProfile: async (req, res) => {
        try {
            const { id } = req.params;
            const authHeader = req.headers.authorization; 
            if (!authHeader) return res.status(401).json({ error: "Não autenticado." });

            const user = await GetUserProfile.execute(id);
            return res.json(user);
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    },

    register: async (req, res) => {
    try {
        const newUser = await RegisterUser.execute(req.body); 
        
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
},

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const result = await LoginUser.execute(email, password);
            return res.json(result);
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
};