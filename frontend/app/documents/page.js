'use client';

import { useState } from 'react';
import Header from '../components/Header';

function output(value) {
    if (!value) return 'Sem dados carregados.';
    return value;
}

export default function DocumentsPage() {
    const [status, setStatus] = useState('Escolha um documento para consultar.');
    const [reportBody, setReportBody] = useState('');

    async function downloadReport(event) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const report = form.get('report');
        const response = await fetch(`/api/download?name=${encodeURIComponent(report)}`);
        const body = await response.text();

        setStatus(response.ok ? 'Documento carregado.' : 'Nao foi possivel carregar documento.');
        setReportBody(body);
    }

    return (
        <>
            <Header />
            <main className="pageShell">
                <section className="pageHeader">
                    <p className="eyebrow">Centro de documentos</p>
                    <h1>Relatorios</h1>
                    <p>
                        A pagina mostra apenas documentos permitidos pela aplicacao. O parametro do pedido continua a ser
                        enviado para o backend.
                    </p>
                </section>

                <section className="contentGrid">
                    <article className="panel">
                        <div className="panelHeading">
                            <div>
                                <p className="eyebrow">Biblioteca</p>
                                <h2>Documentos disponiveis</h2>
                            </div>
                            <span className="badge">Lista controlada</span>
                        </div>
                        <form className="stack" onSubmit={downloadReport}>
                            <label>
                                Documento
                                <select name="report" defaultValue="reports.txt">
                                    <option value="reports.txt">Relatorio confidencial 2026</option>
                                </select>
                            </label>
                            <button type="submit">Abrir documento</button>
                        </form>
                        <p className="note">{status}</p>
                    </article>

                    <article className="panel outputPanel">
                        <div className="panelHeading">
                            <div>
                                <p className="eyebrow">Pre-visualizacao</p>
                                <h2>Documento</h2>
                            </div>
                        </div>
                        <pre>{output(reportBody)}</pre>
                    </article>
                </section>
            </main>
        </>
    );
}
