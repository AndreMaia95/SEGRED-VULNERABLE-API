import { UserRepository } from '../../infrastructure/database/userRepository.js';

export const GetUserProfile = {
    execute: async (userId) => { 
        const user = await UserRepository.findById(userId);
        if (!user) throw new Error("Utilizador não encontrado");
        return user; 
    }
};