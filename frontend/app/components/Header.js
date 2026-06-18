'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Header() {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('oopsapi:user');
        if (!storedUser) return;

        try {
            setUsername(JSON.parse(storedUser).username || '');
        } catch {
            setUsername('');
        }
    }, []);

    return (
        <header className="topbar">
            <Link className="brand" href="/" aria-label="OopsAPI inicio">
                <span>OopsAPI</span>
            </Link>
            <nav>
                <Link href="/login">Entrar</Link>
                <Link href="/register">Registo</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/documents">Documentos</Link>
            </nav>
            <div className="session">{username ? `Sessao: ${username}` : 'Visitante'}</div>
        </header>
    );
}
