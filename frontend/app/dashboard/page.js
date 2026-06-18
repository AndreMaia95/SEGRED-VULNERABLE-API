"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { getSession } from "../lib/session";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState({ token: "", user: null });

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession.token || !storedSession.user) {
      router.push("/login");
      return;
    }
    setSession(storedSession);
  }, [router]);

  const profile = session.user;

  if (!session.token || !profile) {
    return (
      <>
        <Header />
        <main className="pageShell">
          <p>A carregar dados de sessão...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pageShell">
        <section className="pageHeader">
          <p className="eyebrow">Area privada</p>
          <h1>Dashboard</h1>
          <p>
            Os dados apresentados nesta area sao extraidos diretamente do token
            da sessao, sem consulta adicional ao endpoint de perfil.
          </p>
        </section>

        <section className="contentGrid">
          <article className="panel">
            <div className="panelHeading">
              <div>
                <p className="eyebrow">Conta</p>
                <h2>Os meus dados</h2>
              </div>
              <span className="badge">Dados a partir do token</span>
            </div>
            <p className="bodyText">
              O frontend mostra apenas os campos existentes no payload do JWT
              atual.
            </p>
          </article>

          <article className="panel profileCard">
            <div className="avatar">
              {String(profile.username || "U")
                .slice(0, 1)
                .toUpperCase()}
            </div>
            <h2>{profile.username}</h2>
            <p>{profile.email || "Email nao presente no token"}</p>
            <dl>
              <div>
                <dt>Identificador</dt>
                <dd>{profile.id}</dd>
              </div>
              <div>
                <dt>Perfil</dt>
                <dd>{profile.role}</dd>
              </div>
            </dl>
          </article>
        </section>
      </main>
    </>
  );
}
