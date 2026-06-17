import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('Erro ao ligar ao SQLite:', err.message);
    else console.log('Base de Dados SQLite ligada com sucesso.');
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL,
            role TEXT NOT NULL
        )
    `);

    db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO users (id, username, email, passwordHash, role) VALUES (?, ?, ?, ?, ?)");
            const usuarios = [
                [1, 'joao_silva', 'joao@email.com', '123456', 'user'],
                [2, 'maria_admin', 'admin@email.com', 'admin123', 'admin'],
                [3, 'andre_teste', 'andre@teste.com', '123456789', 'user'],
                [4, 'pedro_santos', 'pedro@email.com', 'password', 'user'],
                [5, 'ana_oliveira', 'ana@email.com', 'iloveyou', 'user'],
                [6, 'carlos_gomes', 'carlos@email.com', '12345678', 'user'],
                [7, 'marta_rodrigues', 'marta@email.com', 'qwerty', 'user'],
                [8, 'ricardo_martins', 'ricardo@email.com', 'welcome', 'user'],
                [9, 'sofia_pinto', 'sofia@email.com', 'letmein1', 'user'],
                [10, 'luis_ferreira', 'luis@email.com', 'sunnyday', 'user'],
                [11, 'beatriz_costa', 'beatriz@email.com', 'shadow', 'user'],
                [12, 'tiago_almeida', 'tiago@email.com', 'monkey', 'user'],
                [13, 'claudia_ribeiro', 'claudia@email.com', 'dragon', 'user'],
                [14, 'nuno_carvalho', 'nuno@email.com', 'football', 'user'],
                [15, 'ines_teixeira', 'ines@email.com', 'princess', 'user'],
                [16, 'vitor_sousa', 'vitor@email.com', 'secret', 'user'],
                [17, 'filipa_marques', 'filipa@email.com', 'freedom', 'user'],
                [18, 'goncalo_coelho', 'goncalo@email.com', 'wizard', 'user'],
                [19, 'patricia_silva', 'patricia@email.com', 'starwars', 'user'],
                [20, 'bruno_machado', 'bruno@email.com', 'superman', 'user'],
                [21, 'catarina_fonseca', 'catarina@email.com', 'chocolate', 'user'],
                [22, 'hugo_mendes', 'hugo@email.com', 'batman', 'user'],
                [23, 'joana_antunes', 'joana@email.com', 'universe', 'user']
            ];

            for (const u of usuarios) {
                stmt.run(u);
            }
            stmt.finalize();
            console.log("Utilizadores padrão inseridos no SQLite.");
        }
    });
});

export default db;