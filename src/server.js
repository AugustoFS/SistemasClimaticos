import express, { json } from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const port = 5000;

// Configuração do banco de dados MySQL
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

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'climalerta@gmail.com', // Substitua pelo e-mail do remetente
        pass: 'fvdi owbn kmwu jyog', // Substitua pela senha do e-mail do remetente
    },
});

// Middleware
app.use(cors());
app.use(json());

// Rota de cadastro
app.post('/register', (req, res) => {
    const { name, email } = req.body;
    if (name && email) {
        const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
        db.query(query, [name, email], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
            } else {
                // Enviar e-mail após cadastro bem-sucedido
                const mailOptions = {
                    from: 'climalerta@gmail.com',
                    to: email,
                    subject: 'Cadastro no Sistema Climático',
                    text: `Olá ${name}, você se cadastrou no sistema climático com sucesso!`,
                };

                transporter.sendMail(mailOptions, (mailErr) => {
                    if (mailErr) {
                        console.error('Erro ao enviar e-mail:', mailErr);
                        res.status(500).json({ error: 'Usuário cadastrado, mas falha ao enviar o e-mail.' });
                    } else {
                        res.status(200).json({ message: 'Usuário cadastrado com sucesso! E-mail enviado.' });
                    }
                });
            }
        });
    } else {
        res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }
});

// Rota de login
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

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
