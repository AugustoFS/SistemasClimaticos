import express, { json } from 'express';
import { createConnection } from 'mysql2';
import cors from 'cors';
import nodemailer from 'nodemailer';
import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configuração do banco de dados
const db = createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL no Railway!');
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'climalerta@gmail.com',
        pass: 'fvdi owbn kmwu jyog', // Certifique-se de usar uma senha de app se necessário
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
            if (result.length > 0) {
                const user = result[0];
                res.status(200).json({ message: 'Login realizado com sucesso.', user });
            } else {
                res.status(404).json({ error: 'E-mail não encontrado.' });
            }
        });
    } else {
        res.status(400).json({ error: 'E-mail é obrigatório.' });
    }
});

// Associar cidade ao usuário
app.post('/add-city', (req, res) => {
    const { city, email } = req.body;

    // Verificar se a cidade e o email foram fornecidos
    if (city && email) {
        const query = 'UPDATE users SET cidade = ? WHERE email = ?';
        db.query(query, [city, email], (err, result) => {
            if (err) return res.status(500).json({ message: 'Erro ao atualizar a cidade.' });
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
            res.status(200).json({ message: 'Cidade associada ao usuário com sucesso!' });
        });
    } else {
        res.status(400).json({ message: 'O nome da cidade e o e-mail são obrigatórios.' });
    }
});

// Função para buscar a previsão do tempo para uma cidade
const getWeatherForecast = async (city) => {
    const key = "8168a0c9e5947bef407cb1b34a32e70d";  // Substitua pela sua chave da API do OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&lang=pt_br&units=metric`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar a previsão do tempo:", error);
        return null;
    }
};

// Função para enviar o e-mail com a previsão do tempo para o usuário
const sendWeatherEmail = async (email, city, weatherData) => {
    if (!weatherData) {
        console.error(`Previsão do tempo não encontrada para a cidade: ${city}`);
        return;
    }

    const mailOptions = {
        from: 'climalerta@gmail.com',
        to: email,
        subject: `Previsão Climática de Hoje para ${city}`,
        text: `Olá, aqui está a previsão do tempo para ${city} hoje:\n\n` +
            `Estado do Tempo: ${weatherData.weather[0].description}\n` +
            `Temperatura: ${Math.round(weatherData.main.temp)}ºC\n` +
            `Sensação Térmica: ${Math.round(weatherData.main.feels_like)}ºC`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado para: ${email}`);
    } catch (error) {
        console.error("Erro ao enviar o e-mail:", error);
    }
};

// Enviar e-mail com previsão para todos os usuários cadastrados
const sendEmailsToAllUsers = async () => {
    console.log('Iniciando envio de e-mails com previsão do tempo para todos os usuários...');
    const query = 'SELECT * FROM users WHERE email IS NOT NULL AND cidade IS NOT NULL';

    db.query(query, async (err, users) => {
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            return;
        }

        if (users.length === 0) {
            console.log("Nenhum usuário encontrado.");
            return;
        }

        // Envia os e-mails com a previsão do tempo para todos os usuários
        const emailPromises = users.map(async (user) => {
            console.log(`Buscando previsão do tempo para a cidade: ${user.cidade} (usuário: ${user.email})`);
            const weatherData = await getWeatherForecast(user.cidade);
            return sendWeatherEmail(user.email, user.cidade, weatherData);
        });

        // Espera todos os e-mails serem enviados antes de finalizar
        await Promise.all(emailPromises);
        console.log('Todos os e-mails com previsão foram enviados.');
    });
};

// Agendar a execução da função todos os dias às 9:30 AM (horário de Brasília)
cron.schedule('0 22 * * *', () => {
    console.log('Executando agendador para enviar e-mails com previsão do tempo...');
    sendEmailsToAllUsers();
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
