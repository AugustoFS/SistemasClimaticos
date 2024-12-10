import { useNavigate } from 'react-router-dom';
import './App.css';

function Logout() {
    const navigate = useNavigate();

    const handleConfirmLogout = () => {
        // Limpa o login e redireciona para a tela principal
        localStorage.removeItem('isLoggedIn');
        navigate('/'); // Redireciona para a tela inicial
    };

    return (
        <div className="logout-container">
            <h2>Você deseja sair?</h2>
            <div className="content">
                <button onClick={handleConfirmLogout}>Confirmar Sair</button>
                <p><span onClick={() => navigate('/')}> Voltar </span></p>
            </div>
        </div>
    );
}

export default Logout;
