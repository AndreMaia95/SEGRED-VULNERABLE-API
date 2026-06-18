"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSession, getSession } from "../lib/session";

export default function Header() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const session = getSession();
    setUsername(session.user?.username || "");
    setRole(session.user?.role || "");
  }, []);

  const handleLogout = () => {
    clearSession();
    window.location.href = "/login";
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
            <div className={role === "admin" ? "admin" : "user"}>
              {role === "admin" ? "Admin" : "User"}
            </div>
            <span>Sessao: {username}</span>
            <button
              onClick={handleLogout}
              className="logout-btn"
              style={{ marginLeft: "10px", cursor: "pointer" }}
            >
              Sair
            </button>
          </>
        ) : (
          "Visitante"
        )}
      </div>
    </header>
  );
}
