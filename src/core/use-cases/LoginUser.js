import { UserRepository } from '../../infrastructure/database/userRepository.js';

export const LoginUser = {
    execute: async (email, password) => {
        // Usa query com ambos os campos — vulnerável a SQL Injection
        const user = await UserRepository.findByCredentials(email, password);

        if (!user) {
            throw new Error("Credenciais inválidas");
        }

        const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString('base64url');
        const payload = Buffer.from(JSON.stringify({ id: user.id, username: user.username, role: user.role })).toString('base64url');
        const token = `${header}.${payload}.`;

        return { token };
    }
};