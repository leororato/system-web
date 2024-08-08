import axios from 'axios';

// Configuração da instância do Axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Altere para a URL do seu backend
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        // Adicione aqui o token JWT, se disponível
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

export default axiosInstance;


// import axios from 'axios';

// // Cria uma instância do Axios
// const axiosInstance = axios.create({
//     baseURL: 'http://localhost:8080/', // URL base para todas as requisições
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// // Adiciona um interceptor para incluir o token JWT nos cabeçalhos
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('jwtToken');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// export default axiosInstance;
