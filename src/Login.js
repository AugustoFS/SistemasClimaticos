import { useState } from 'react';
import './App.css'; // Certifique-se de renomear o arquivo CSS também, se necessário.

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const toggleScreen = () => {
        setIsLogin(!isLogin);
        setName('');
        setEmail('');
        setMessage('');
    };

    const handleRegister = () => {
        if (name && email) {
            localStorage.setItem('userData', JSON.stringify({ name, email }));
            setMessage('Cadastro realizado com sucesso!');
        } else {
            setMessage('Por favor, preencha todos os campos.');
        }
    };

    const handleLogin = () => {
        const storedUser = JSON.parse(localStorage.getItem('userData'));
        if (storedUser && storedUser.email === email) {
            setMessage(`Bem-vindo, ${storedUser.name}!`);
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
