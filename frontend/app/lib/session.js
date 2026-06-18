export const defaultUser = {
    id: 1,
    username: 'joao_silva',
    email: 'joao@email.com',
    role: 'user'
};

export function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload.replaceAll('-', '+').replaceAll('_', '/')));
    } catch {
        return null;
    }
}

export function saveSession(token, user) {
    localStorage.setItem('oopsapi:token', token);
    localStorage.setItem('oopsapi:user', JSON.stringify(user));
}

export function getSession() {
    const token = localStorage.getItem('oopsapi:token') || '';
    const storedUser = localStorage.getItem('oopsapi:user');

    if (!storedUser) return { token, user: null };

    try {
        return { token, user: JSON.parse(storedUser) };
    } catch {
        return { token, user: null };
    }
}

export function clearSession() {
    localStorage.removeItem('oopsapi:token');
    localStorage.removeItem('oopsapi:user');
}
