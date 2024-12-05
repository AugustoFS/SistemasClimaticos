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
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email }),
                });

                const result = await response.json();

                if (response.ok) {
                    setMessage(result.message);
                    setTimeout(() => navigate('/'), 2000); // Redireciona após 2 segundos
                } else {
                    setMessage(result.error || 'Erro ao cadastrar.');
                }
            } catch (error) {
                console.error('Erro ao conectar ao servidor:', error);
                setMessage('Erro ao conectar ao servidor.');
            }
        } else {
            setMessage('Por favor, preencha todos os campos.');
        }
    };

    const handleLogin = () => {
        const storedUser = JSON.parse(localStorage.getItem('userData'));
        if (storedUser && storedUser.email === email) {
            setMessage(`Bem-vindo, ${storedUser.name}!`);
            setTimeout(() => navigate('/'), 2000); // Redireciona após 2 segundos
        } else {
            setMessage('E-mail não encontrado. Verifique ou registre-se.');
        }
    };

    return (
        <div className="login-container">
            {isLogin ? (
                <div className="form">
                    <h2>Login</h2>
                    <label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu e-mail"
                        />
                    </label>
                    <button onClick={handleLogin}>Entrar</button>
                    {message && <p className="message">{message}</p>}
                    <p>
                        Não tem uma conta? <span onClick={toggleScreen}>Cadastre-se</span>
                    </p>
                </div>
            ) : (
                <div className="form">
                    <h2>Cadastro</h2>
                    <label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite seu nome"
                        />
                    </label>
                    <label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu e-mail"
                        />
                    </label>
                    <button onClick={handleRegister}>Cadastrar</button>
                    {message && <p className="message">{message}</p>}
                    <p>
                        Já tem uma conta? <span onClick={toggleScreen}>Faça login</span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Login;
