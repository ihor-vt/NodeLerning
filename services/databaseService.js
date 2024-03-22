const sqlite3 = require('sqlite3').verbose();

class DatabaseService {
    constructor() {
        this.db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Error opening database ' + err.message);
            } else {
                console.log('Connected to the database.');
            }
        });
        this.initiateDatabase();
    }

    initiateDatabase() {
        this.db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, email TEXT)', (err) => {
            if (err) {
                console.error('Error creating table ' + err.message);
            } else {
                console.log('Table created');
            }
        });
    };

    createUser(user, callback) {
        this.db.run('INSERT INTO users (name, age, email) VALUES (?, ?, ?)', [user.name, user.age, user.email], (err) => {
            if (err) {
                console.error('Error inserting user ' + err.message);
                return callback(err);
            }
            callback(null, { id: this.lastID, ...user });
        });
    };

    getUsers(callback) {
        this.db.all('SELECT * FROM users', (err, rows) => {
            if (err) {
                console.error('Error getting users ' + err.message);
                return callback(err);
            }
            callback(null, { users: rows });
        });
    };

    updateUser(id, user, callback) {
        this.db.run('UPDATE users SET name = ?, age = ?, email = ? WHERE id = ?', [user.name, user.age, user.email, id], (err) => {
            if (err) {
                console.error('Error updating user ' + err.message);
                return callback(err);
            }
            callback(null, { id: this.changes, ...user });
        });
    };

    deleteUser(id, callback) {
        this.db.run('DELETE FROM users WHERE id = ?', id, (err) => {
            if (err) {
                console.error('Error deleting user ' + err.message);
                return callback(err);
            }
            callback(null, { id: this.changes });
        });
    };
}
