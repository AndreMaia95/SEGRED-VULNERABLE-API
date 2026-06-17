import { UserRepository } from '../../infrastructure/database/userRepository.js';

export const LoginUser = {
    execute: async (email, password) => {
        const user = await UserRepository.findByEmail(email);
        
        if (!user || user.passwordHash !== password) {
            throw new Error("Credenciais inválidas");
        }

        const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString('base64url');
        const payload = Buffer.from(JSON.stringify({ id: user.id, username: user.username, role: user.role })).toString('base64url');
        const token = `${header}.${payload}.`;

        return { token };
    }
};