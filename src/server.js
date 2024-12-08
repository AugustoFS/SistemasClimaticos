import express, { json } from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';
import nodemailer from 'nodemailer';

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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'climalerta@gmail.com',
        pass: 'fvdi owbn kmwu jyog',
    },
});

app.use(cors());
app.use(json());

// Cadastro
app.post('/register', (req, res) => {
    const { name, email } = req.body;
    if (name && email) {
        const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
        db.query(query, [name, email], (err) => {
            if (err) return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
            const mailOptions = {
                from: 'climalerta@gmail.com',
                to: email,
                subject: 'Cadastro no Sistema Climático',
                text: `Olá ${name}, você se cadastrou no sistema climático com sucesso!`,
            };
            transporter.sendMail(mailOptions, (mailErr) => {
                if (mailErr) return res.status(500).json({ error: 'Erro ao enviar e-mail.' });
                res.status(200).json({ message: 'Usuário cadastrado com sucesso! E-mail enviado.' });
            });
        });
    } else {
        res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }
});

// Login
app.post('/login', (req, res) => {
    const { email } = req.body;
    if (email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, result) => {
            if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
            if (result.length > 0) return res.status(200).json({ user: result[0] });
            res.status(404).json({ error: 'E-mail não encontrado.' });
        });
    } else {
        res.status(400).json({ error: 'E-mail é obrigatório.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
