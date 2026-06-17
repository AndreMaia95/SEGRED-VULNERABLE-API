import db from './sqliteDatabase.js';

export const UserRepository = {
    findById: (id) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            /*db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });*/

            //Vulnerável para SQL Injection
            db.get(`SELECT * FROM users WHERE email = '${email}'`, [], (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
    },

    create: (user) => {
        return new Promise((resolve, reject) => {
            const { username, email, passwordHash, role } = user;
            db.run(
                "INSERT INTO users (username, email, passwordHash, role) VALUES (?, ?, ?, ?)",
                [username, email, passwordHash, role || 'user'],
                function (err) {
                    if (err) return reject(err);
                    resolve({ id: this.lastID, username, email, passwordHash, role: role || 'user' });
                }
            );
        });
    }
};