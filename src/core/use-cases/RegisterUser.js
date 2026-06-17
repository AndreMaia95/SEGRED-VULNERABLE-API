import { UserRepository } from '../../infrastructure/database/userRepository.js';

export const RegisterUser = {
    execute: async (userData) => {
        const newUser = {
            username: userData.username,
            email: userData.email,
            passwordHash: userData.passwordHash,
            role: userData.role
        };

        return await UserRepository.create(newUser); 
    }
};