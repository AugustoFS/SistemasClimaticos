import express, { json } from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';
const app = express();
const port = 5000;

const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'weather_app',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

app.use(cors());
app.use(json());

app.post('/register', (req, res) => {
    const { name, email } = req.body;
    if (name && email) {
        const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
        db.query(query, [name, email], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
            } else {
                res.status(200).json({ message: 'Usuário cadastrado com sucesso!' });
            }
        });
    } else {
        res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }
});

app.post('/login', (req, res) => {
    const { email } = req.body;
    if (email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao buscar usuário.' });
            } else if (result.length > 0) {
                res.status(200).json({ user: result[0] });
            } else {
                res.status(404).json({ error: 'E-mail não encontrado.' });
            }
        });
    } else {
        res.status(400).json({ error: 'E-mail é obrigatório.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
