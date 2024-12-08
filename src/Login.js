import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const toggleScreen = () => {
        setIsLogin(!isLogin);
        setName('');
        setEmail('');
        setMessage('');
    };

    const handleRegister = async () => {
        if (name && email) {
            try {
                const response = await fetch('http://localhost:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email }),
                });

                const result = await response.json();
                setMessage(response.ok ? result.message : result.error);
                if (response.ok) setTimeout(() => navigate('/'), 2000);
            } catch (error) {
                setMessage('Erro ao conectar ao servidor.');
            }
        } else {
            setMessage('Por favor, preencha todos os campos.');
        }
    };

    const handleLogin = async () => {
        if (email) {
            try {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('isLoggedIn', 'true');
                    setMessage(`Bem-vindo, ${result.user.name}!`);
                    setTimeout(() => navigate('/'), 2000);
                } else {
                    setMessage(result.error);
                }
            } catch (error) {
                setMessage('Erro ao conectar ao servidor.');
            }
        } else {
            setMessage('Por favor, preencha o campo de e-mail.');
        }
    };

    return (
        <div className="login-container">
            {isLogin ? (
                <div className="form">
                    <h2>Login</h2>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu e-mail"
                    />
                    <button onClick={handleLogin}>Entrar</button>
                    {message && <p className="message">{message}</p>}
                    <p>Não tem uma conta? <span onClick={toggleScreen}>Cadastrar</span></p>
                </div>
            ) : (
                <div className="form">
                    <h2>Cadastro</h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite seu nome"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Digite seu e-mail"
                    />
                    <button onClick={handleRegister}>Cadastrar</button>
                    {message && <p className="message">{message}</p>}
                    <p>Já tem uma conta? <span onClick={toggleScreen}>Entrar</span></p>
                </div>
            )}
        </div>
    );
}

export default Login;
