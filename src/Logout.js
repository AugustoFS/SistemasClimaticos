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
            <h2 className="logout-title">Tem certeza que deseja sair?</h2>
            <div className="logout-buttons">
                <button className="logout-button confirm" onClick={handleConfirmLogout}>
                    Confirmar
                </button>
                <button className="logout-button cancel" onClick={() => navigate('/')}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default Logout;
