import axios from 'axios';
import { useHistory } from 'react-router-dom'; // ou a biblioteca de roteamento que você estiver usando
import Cookies from 'js-cookie';

// Obtenha o token JWT do cookie
const token = Cookies.get('jwt');

// Configure o header da requisição
const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
};

const api = axios.create({
    baseURL: 'http://localhost:8080/api', config
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            const errorMessage = encodeURIComponent(error.response.data?.message || "Sua sessão expirou");
            window.location.href = `/login?error=${errorMessage}`; // Redireciona com a mensagem
        }
        return Promise.reject(error);
    }
);


export default api;
