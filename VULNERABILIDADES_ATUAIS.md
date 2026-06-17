# Vulnerabilidades Atuais - SEGRED-VULNERABLE-API

Data de levantamento: 2026-06-17

## Cobertura do Enunciado

Enunciado: testar autenticacao fraca, IDOR, rate limiting, JWT mal configurado, exposicao de dados e validacao de inputs.

- Autenticacao fraca:
  - Coberto em 1, 2, 4 e 8.
- IDOR:
  - Coberto em 5.
- Broken object level authorization no download de ficheiros:
  - Coberto em 13.
- Rate limiting:
  - Coberto em 9.
- JWT mal configurado:
  - Coberto em 3.
- Exposicao de dados:
  - Coberto em 6.
- Validacao de inputs:
  - Coberto em 10.
- SQL injection:
  - Coberto em 14.

Conclusao: todos os pontos pedidos no enunciado estao atualmente presentes e documentados nesta API vulneravel.

## 1) Passwords armazenadas em texto simples (sem hash)

- Severidade: Critica
- Evidencia: o campo `passwordHash` guarda passwords em claro na base de dados e no seed inicial.
- Onde:
  - `src/infrastructure/database/sqliteDatabase.js`
  - `src/infrastructure/database/userRepository.js`
- Impacto:
  - Compromisso imediato de contas em caso de acesso a base de dados.
  - Reutilizacao de credenciais noutros servicos (credential stuffing).

## 2) Validacao de login compara password em claro

- Severidade: Critica
- Evidencia: no login, a comparacao e `user.passwordHash !== password`.
- Onde:
  - `src/core/use-cases/LoginUser.js`
- Impacto:
  - Confirma que nao existe hashing/salting.
  - Aumenta risco de fuga e abuso de credenciais.

## 3) JWT inseguro com `alg: none` e sem assinatura

- Severidade: Critica
- Evidencia: token e criado manualmente com header `{"alg":"none"}` e termina sem assinatura (`header.payload.`).
- Onde:
  - `src/core/use-cases/LoginUser.js`
- Impacto:
  - Qualquer utilizador pode forjar tokens validos localmente.
  - Escalada de privilegios (ex.: role `admin`) por manipulacao do payload.

## 4) Endpoint protegido nao valida token

- Severidade: Critica
- Evidencia: no perfil, so se verifica se o header `Authorization` existe; nao ha verificacao criptografica nem decode seguro.
- Onde:
  - `src/infrastructure/web/controllers/UserController.js`
- Impacto:
  - Basta enviar qualquer valor em `Authorization` para contornar autenticacao.

## 5) IDOR/BOLA no acesso a perfil de utilizador

- Severidade: Alta
- Evidencia: `GET /api/users/:id` aceita qualquer `id` e devolve esse perfil sem validar se pertence ao utilizador autenticado.
- Onde:
  - `src/infrastructure/web/controllers/UserController.js`
  - `src/infrastructure/web/routes/userRoutes.js`
- Impacto:
  - Enumeracao e acesso indevido a dados de outros utilizadores.

## 6) Exposicao de dados sensiveis no retorno da API

- Severidade: Alta
- Evidencia:
  - `getProfile` devolve o objeto completo do utilizador (inclui `passwordHash`).
  - `register` devolve o novo utilizador com `passwordHash`.
- Onde:
  - `src/core/use-cases/GetUserProfile.js`
  - `src/infrastructure/web/controllers/UserController.js`
  - `src/infrastructure/database/userRepository.js`
- Impacto:
  - Divulgacao direta de credenciais em respostas HTTP.

## 7) Escalada de privilegios no registo (mass assignment)

- Severidade: Alta
- Evidencia: o campo `role` vem diretamente de `req.body` e e persistido sem controlo.
- Onde:
  - `src/core/use-cases/RegisterUser.js`
  - `src/infrastructure/database/userRepository.js`
- Impacto:
  - Um atacante pode registar-se como `admin`.

## 8) Credenciais fracas/default e wordlist exposta no repositorio

- Severidade: Alta
- Evidencia:
  - Seed contem multiplas passwords fracas/default (ex.: `123456`, `password`, `admin123`).
  - Ficheiro `passwords.txt` inclui lista de passwords comuns.
- Onde:
  - `src/infrastructure/database/sqliteDatabase.js`
  - `passwords.txt`
- Impacto:
  - Facilita brute force, password spraying e acesso inicial.

## 9) Ausencia de rate limiting e protecao contra brute force no login

- Severidade: Alta
- Evidencia: nao existe qualquer limitacao por IP/conta em `POST /api/login`.
- Onde:
  - `src/infrastructure/web/routes/userRoutes.js`
  - `src/infrastructure/web/controllers/UserController.js`
- Impacto:
  - Ataques automatizados de adivinhacao de password tornam-se viaveis.

## 10) Falta de validacao de input (schema validation)

- Severidade: Media
- Evidencia: nao ha validacao de formato/tamanho/tipo para `email`, `password`, `id`, `username` ou `role` antes de usar os dados.
- Onde:
  - `src/infrastructure/web/controllers/UserController.js`
  - `src/core/use-cases/RegisterUser.js`
  - `src/core/use-cases/LoginUser.js`
- Impacto:
  - Dados malformados, inconsistencias, abuso de recursos e aumento de superficie de ataque.

## 11) Tratamento de erros com mensagens potencialmente reveladoras

- Severidade: Media
- Evidencia: o login devolve `error.message`, `stack`, `database_driver` e `environment` quando as credenciais sao invalidas.
- Onde:
  - `src/infrastructure/web/controllers/UserController.js`
- Impacto:
  - Possivel fuga de detalhes internos da aplicacao e da BD.

## 12) Sem controlos de hardening HTTP (headers de seguranca)

- Severidade: Baixa
- Evidencia: nao existe uso de middlewares de hardening (ex.: Helmet) nem politica de seguranca explicita.
- Onde:
  - `src/app.js`
  - `package.json`
- Impacto:
  - Maior exposicao a classes comuns de ataques web no ambiente real.

## 13) Broken object level authorization no download de ficheiros

- Severidade: Alta
- Evidencia: a rota `/api/download` aceita `name` controlado pelo utilizador e usa `path.resolve('public/reports/' + file)` sem restricao de diretoria, permitindo path traversal como `../../database.sqlite`.
- Onde:
  - `src/infrastructure/web/routes/userRoutes.js`
- Impacto:
  - Download indevido de ficheiros da aplicacao, incluindo a base de dados e possivel codigo fonte.

## 14) SQL injection na autenticacao

- Severidade: Critica
- Evidencia: `findByEmail` monta a query com interpolacao direta de `email`, permitindo payloads como `naoexiste@email.com' UNION SELECT 99, 'hacker', 'naoexiste@email.com', 'ataque123', 'admin' --`.
- Onde:
  - `src/infrastructure/database/userRepository.js`
  - `src/core/use-cases/LoginUser.js`
- Impacto:
  - Bypass de autenticacao.
  - Falsificacao de utilizador com `role` arbitrario.
  - Retorno de token JWT forjado com `alg: none` e payload controlado pelo atacante.

---

## Notas

- A API usa queries parametrizadas no SQLite (`?`), reduzindo risco de SQL Injection direto nos pontos observados.
- Este documento reflete o estado atual do codigo e foi preparado para contexto de laboratorio/ensino de seguranca.
