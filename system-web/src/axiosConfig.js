import axios from 'axios';
import Cookies from 'js-cookie';

// Configuração da URL base da API
const api = axios.create({
    baseURL: 'http://192.168.1.238:8080/api',
});

// Intercepta requisições para incluir o token JWT
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


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










// import axios from 'axios';
// import Cookies from 'js-cookie';

// // Obtenha o token JWT do cookie
// const token = Cookies.get('jwt');

// // Configure o header da requisição
// const config = {
//     headers: {
//         Authorization: `Bearer ${token}`
//     }
// };

// const api = axios.create({
//     baseURL: 'http://192.168.1.238:8080/api', config
// });

// // Interceptor para tratamento de erros
// // api.interceptors.response.use(
// //     response => response,
// //     error => {
// //         if (error.response && error.response.status === 401) {
// //             const errorMessage = encodeURIComponent(error.response.data?.message || "Sua sessão expirou");
// //             window.location.href = `/login?error=${errorMessage}`; // Redireciona com a mensagem
// //         }
// //         return Promise.reject(error);
// //     }
// // );


// export default api;
