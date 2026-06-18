'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { clearSession } from '../lib/session';

export default function Header() {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('oopsapi:user');
        if (!storedUser) return;

        try {
            const user = JSON.parse(storedUser);
            setUsername(user.username || '');
            setRole(user.role || '');
        } catch {
            setUsername('');
            setRole('');
        }
    }, []);

    const handleLogout = () => {
        clearSession();
        window.location.href = '/login';
    };

    return (
        <header className="topbar">
            <Link className="brand" href="/" aria-label="OopsAPI inicio">
                <span>OopsAPI</span>
            </Link>
            <nav>
                <Link href="/login">Entrar</Link>
                <Link href="/register">Registo</Link>
                {username && <Link href="/dashboard">Dashboard</Link>}
                {username && <Link href="/documents">Documentos</Link>}
            </nav>
        
            <div className="session">
                {username ? (
                    <>
                        <div className={role === 'admin' ? 'admin' : 'user'}>
                            {role === 'admin' ? 'Admin' : 'User'}
                        </div>
                        <span>Sessao: {username}</span>
                        <button onClick={handleLogout} className="logout-btn" style={{ marginLeft: '10px', cursor: 'pointer' }}>Sair</button>
                    </>
                ) : (
                    'Visitante'
                )}
            </div>
        </header>
    );
}
