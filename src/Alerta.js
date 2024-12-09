import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function Alerta() {
    const [city, setCity] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    // Função para adicionar cidade
    const handleAddCity = async () => {
        if (city.trim() && email.trim()) {
            try {
                const response = await axios.post('http://localhost:5000/add-city', { city, email });
                setMessage(response.data.message);
                setCity('');
                setEmail('');
                setTimeout(() => navigate('/'), 2000); // Redireciona após 2 segundos
            } catch (error) {
                setMessage('Erro ao cadastrar a cidade.');
            }
        } else {
            setMessage('O nome da cidade e o e-mail são obrigatórios.');
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="login-container">
            <h2>Cadastrar Cidade</h2>
            <div className="form">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                />
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Digite o nome da cidade"
                />
                <button onClick={handleAddCity}>Adicionar</button>
                <button onClick={handleBack} className="secondary-button">Voltar</button>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
}

export default Alerta;
