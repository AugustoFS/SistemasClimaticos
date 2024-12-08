import { useNavigate } from 'react-router-dom';
import './App.css';

function Logout() {
    const navigate = useNavigate();

    const handleConfirmLogout = () => {
        // Limpa o login e redireciona para a tela principal
        localStorage.removeItem('isLoggedIn');
        navigate('/');
    };

    return (
        <div className="logout-container">
            <h2>Tem certeza que deseja sair?</h2>
            <div className="logout-buttons">
                <button onClick={handleConfirmLogout} className="confirm-button">Confirmar</button>
                <button onClick={() => navigate('/')} className="cancel-button">Cancelar</button>
            </div>
        </div>
    );
}

export default Logout;
