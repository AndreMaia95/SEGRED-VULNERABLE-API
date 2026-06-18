'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { defaultUser, getSession } from '../lib/session';

export default function DashboardPage() {
    const [session, setSession] = useState({ token: '', user: null });
    const [profile, setProfile] = useState(defaultUser);
    const [status, setStatus] = useState('Use a sua conta para carregar os dados pessoais.');

    useEffect(() => {
        const storedSession = getSession();
        setSession(storedSession);
        setProfile(storedSession.user || defaultUser);
    }, []);

    async function loadProfile() {
        const id = session.user?.id || defaultUser.id;
        const response = await fetch(`/api/users/${id}`, {
            headers: {
                Authorization: session.token ? `Bearer ${session.token}` : 'Bearer frontend-session'
            }
        });
        const body = await response.json();

        if (!response.ok) {
            setStatus(body.error || 'Nao foi possivel carregar perfil.');
            return;
        }

        setProfile(body);
        setStatus('Dados pessoais carregados pela area privada.');
    }

    return (
        <>
            <Header />
            <main className="pageShell">
                <section className="pageHeader">
                    <p className="eyebrow">Area privada</p>
                    <h1>Dashboard</h1>
                    <p>
                        Esta pagina so carrega o perfil do utilizador em sessao. A UI nao disponibiliza campo para trocar
                        o ID.
                    </p>
                </section>

                <section className="contentGrid">
                    <article className="panel">
                        <div className="panelHeading">
                            <div>
                                <p className="eyebrow">Conta</p>
                                <h2>Os meus dados</h2>
                            </div>
                            <span className="badge">ID fixado pela UI</span>
                        </div>
                        <p className="bodyText">
                            Num fluxo normal, o frontend usa apenas o ID guardado na sessao local.
                        </p>
                        <button type="button" onClick={loadProfile}>
                            Atualizar dados
                        </button>
                        <p className="note">{status}</p>
                    </article>

                    <article className="panel profileCard">
                        <div className="avatar">{String(profile.username || 'U').slice(0, 1).toUpperCase()}</div>
                        <h2>{profile.username}</h2>
                        <p>{profile.email}</p>
                        <dl>
                            <div>
                                <dt>Identificador</dt>
                                <dd>{profile.id}</dd>
                            </div>
                            <div>
                                <dt>Perfil</dt>
                                <dd>{profile.role}</dd>
                            </div>
                            <div>
                                <dt>Campo interno recebido</dt>
                                <dd>{profile.passwordHash ? 'passwordHash presente' : 'sem passwordHash'}</dd>
                            </div>
                        </dl>
                    </article>
                </section>
            </main>
        </>
    );
}
