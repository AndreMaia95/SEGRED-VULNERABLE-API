import Link from 'next/link';
import Header from './components/Header';

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <section className="hero">
                    <div className="heroCopy">
                        <p className="eyebrow">Portal de gestao de APIs</p>
                        <h1>OopsAPI</h1>
                        <p>
                            Uma plataforma de cliente com validacoes no browser, area privada e centro de documentos.
                            Na apresentacao, o Burp mostra porque essas regras tambem precisam de existir no backend.
                        </p>
                        <div className="heroActions">
                            <Link className="buttonLink" href="/login">
                                Entrar no portal
                            </Link>
                            <Link className="buttonLink secondary" href="/register">
                                Criar conta
                            </Link>
                        </div>
                    </div>
                    <aside className="heroPanel">
                        <span className="panelLabel">Produto</span>
                        <strong>API Client Hub</strong>
                        <dl>
                            <div>
                                <dt>Contas</dt>
                                <dd>clientes</dd>
                            </div>
                            <div>
                                <dt>Acesso</dt>
                                <dd>area privada</dd>
                            </div>
                            <div>
                                <dt>Ficheiros</dt>
                                <dd>relatorios</dd>
                            </div>
                        </dl>
                    </aside>
                </section>

                <section className="featureGrid">
                    <article className="panel">
                        <p className="eyebrow">Frontend</p>
                        <h2>Fluxos aparentemente controlados</h2>
                        <p className="bodyText">
                            A interface limita roles, IDs e nomes de documentos. Para um utilizador normal, nao existem
                            campos perigosos.
                        </p>
                    </article>
                    <article className="panel">
                        <p className="eyebrow">Backend</p>
                        <h2>A autoridade real</h2>
                        <p className="bodyText">
                            Quando o pedido e alterado fora do browser, o servidor precisa de validar tudo novamente.
                        </p>
                    </article>
                    <article className="panel">
                        <p className="eyebrow">Burp Suite</p>
                        <h2>Demonstracao natural</h2>
                        <p className="bodyText">
                            Navega pelo site como numa aplicacao normal e intercepta os pedidos para demonstrar as falhas.
                        </p>
                    </article>
                </section>
            </main>
        </>
    );
}
