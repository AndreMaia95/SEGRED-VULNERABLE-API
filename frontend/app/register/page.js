'use client';

import { useState } from 'react';
import Header from '../components/Header';

export default function RegisterPage() {
    const [status, setStatus] = useState('A conta criada pelo site fica sempre como cliente.');

    async function signup(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const username = form.get('username');
        const email = form.get('email');
        const passwordHash = form.get('password');

        if (String(username).length < 3 || !String(email).includes('@') || String(passwordHash).length < 6) {
            setStatus('Validacao do frontend: nome, email e password precisam de valores plausiveis.');
            return;
        }

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                passwordHash,
                role: 'user'
            })
        });
        const body = await response.json();

        if (!response.ok) {
            setStatus(body.error || 'Nao foi possivel criar conta.');
            return;
        }

        setStatus(`Conta criada para ${body.username} com perfil ${body.role}.`);
    }

    return (
        <>
            <Header />
            <main className="pageShell narrow">
                <section className="panel formPanel">
                    <p className="eyebrow">Novo cliente</p>
                    <h1>Criar conta</h1>
                    <p className="bodyText">
                        A interface nao oferece escolha de perfil administrativo. O pedido enviado continua a ter dados
                        que podem ser manipulados fora do frontend.
                    </p>
                    <form className="stack" onSubmit={signup}>
                        <label>
                            Nome de utilizador
                            <input name="username" defaultValue="novo_cliente" minLength="3" required />
                        </label>
                        <label>
                            Email
                            <input name="email" type="email" defaultValue="cliente@oopsapi.test" required />
                        </label>
                        <label>
                            Password
                            <input name="password" type="password" defaultValue="123456" minLength="6" required />
                        </label>
                        <button type="submit">Criar conta cliente</button>
                    </form>
                    <p className="note">{status}</p>
                </section>
            </main>
        </>
    );
}
