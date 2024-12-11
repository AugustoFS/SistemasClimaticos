import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Logout({ setIsLoggedIn }) {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleConfirmLogout = () => {
        // Limpa o login e redireciona para a tela principal
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false); // Atualiza o estado em App.js
        setMessage('Você saiu com sucesso.');
        setTimeout(() => navigate('/'), 2000); // Redireciona após 2 segundos
    };

    return (
        <div className="logout-container">
            <h2>Você deseja sair?</h2>
            <div className="content">
                <button onClick={handleConfirmLogout}>Confirmar Sair</button>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default Logout;
