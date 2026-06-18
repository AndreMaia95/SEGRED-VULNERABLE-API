"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { decodeToken, saveSession } from "../lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState(
    "Entre com uma conta existente para abrir a area privada.",
  );

  async function login(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    if (!String(email).includes("@") || String(password).length < 4) {
      setStatus("Validacao do frontend: confirme email e password.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const raw = await response.text();
      let body = {};

      try {
        body = raw ? JSON.parse(raw) : {};
      } catch {
        body = { message: "Resposta invalida da API." };
      }

      if (!response.ok) {
        setStatus(
          body.error || body.message || "Nao foi possivel iniciar sessao.",
        );
        return;
      }

      if (!body.token) {
        setStatus("Resposta da API sem token de sessao.");
        return;
      }

      const user = decodeToken(body.token) || { username: email, email };
      saveSession(body.token);
      setStatus(`Sessao iniciada como ${user.username}.`);
      router.push("/dashboard");
    } catch {
      setStatus("Falha de ligacao ao servidor de autenticacao.");
    }
  }

  return (
    <>
      <Header />
      <main className="pageShell narrow">
        <section className="panel formPanel">
          <p className="eyebrow">Acesso</p>
          <h1>Entrar na OopsAPI</h1>
          <p className="bodyText">
            O formulario aplica validacoes basicas antes de enviar credenciais
            para a API.
          </p>
          <form className="stack" onSubmit={login}>
            <label>
              Email corporativo
              <input
                name="email"
                type="email"
                defaultValue="admin@email.com"
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                defaultValue="admin123"
                minLength="4"
                required
              />
            </label>
            <div className="actions">
              <button type="submit">Entrar</button>
            </div>
          </form>
          <p className="note">{status}</p>
        </section>
      </main>
    </>
  );
}
