"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { getSession } from "../lib/session";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState({ token: "", user: null });
  const [apiProfile, setApiProfile] = useState(null);
  const [status, setStatus] = useState(
    "A mostrar dados do token. Pode carregar dados adicionais via API.",
  );

  useEffect(() => {
    const storedSession = getSession();
    if (!storedSession.token || !storedSession.user) {
      router.push("/login");
      return;
    }
    setSession(storedSession);
  }, [router]);

  const tokenProfile = session.user;
  const profile = apiProfile
    ? { ...tokenProfile, ...apiProfile }
    : tokenProfile;

  async function loadProfileFromApi() {
    const id = tokenProfile?.id;
    if (!id) {
      setStatus("Token sem identificador de utilizador.");
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        headers: {
          Authorization: session.token ? `Bearer ${session.token}` : "",
        },
      });

      const raw = await response.text();
      let body = {};

      try {
        body = raw ? JSON.parse(raw) : {};
      } catch {
        body = { error: "Resposta invalida da API de perfil." };
      }

      if (!response.ok) {
        setStatus(body.error || "Nao foi possivel carregar dados via API.");
        return;
      }

      setApiProfile(body);
      setStatus("Dados da API carregados e combinados com o token.");
    } catch {
      setStatus("Falha de ligacao ao endpoint de perfil.");
    }
  }

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
            Esta area mostra dados do token e permite juntar dados adicionais
            vindos da API de perfil.
          </p>
        </section>

        <section className="contentGrid">
          <article className="panel">
            <div className="panelHeading">
              <div>
                <p className="eyebrow">Conta</p>
                <h2>Os meus dados</h2>
              </div>
              <span className="badge">
                {apiProfile ? "Token + API" : "Dados a partir do token"}
              </span>
            </div>
            <p className="bodyText">
              O frontend usa o payload JWT como base e, opcionalmente, combina
              os dados retornados por `/api/users/:id`.
            </p>
            <button type="button" onClick={loadProfileFromApi}>
              Carregar dados via API
            </button>
            <p className="note">{status}</p>
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
