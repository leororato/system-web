import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Text from "../../../components/Text";
import Logo from "../../../components/Logo";
import Input from "../../../components/Input";
import Button from "../../../components/Button";


function Login() {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Faz a requisição de login
            const response = await axios.post('http://localhost:8080/auth/login', {
                login: login,
                senha: senha
            });
            
            // Armazena o token em um local seguro, como o localStorage
            const token = response.data.token;
            localStorage.setItem('jwtToken', token);

            console.log(response.data);
            console.log('Token: ', token);
            navigate('/inicio');
        } catch (error) {
            if (error.response) {
                setError('Usuário ou senha incorretos.');
                console.log("Erro: ", error.response.data);
            } else if (error.request) {
                setError('Erro ao conectar com o servidor.');
                console.log("Erro de conexão: ", error.request);
            } else {
                setError('Erro inesperado: ' + error.message);
                console.log("Erro: ", error.message);
            }
        }
    };

    return (
        <div>
            <div className="login-aba">
                <div className="login-bloco">

                <div className="logo-container">
                    <Logo width={'200px'} height={'80px'} />
                </div>
                <div className="login-itens">
                    <div className="login-container">
                        <Text
                            id="login-text"
                            text={'Login:'}
                            color={'black'}
                            fontSize={20}
                        />
                        <Input
                            id="input-login"
                            type={'text'}
                            placeholder={'Digite seu Login'}
                            padding={7}
                            onChange={(e) => setLogin(e.target.value)}
                            value={login}
                        /></div>

                    <div className="password-container">
                        <Text
                            id="text-senha"
                            text={'Senha:'}
                            color={'black'}
                            fontSize={20}
                        />
                        <Input
                            id="input-senha"
                            type={'password'}
                            placeholder={'Digite sua Senha'}
                            padding={7}
                            onChange={(e) => setSenha(e.target.value)}
                            value={senha}
                        />
                    </div>

                </div>
                <Button
                    className="button-entrar"
                    text={'Entrar'}
                    onClick={handleSubmit}
                    type={"submit"}
                    padding={10}
                    borderRadius={3}
                    />
                {error && <Text className="error-message" text={error} color={'red'} />}
                    </div>
            </div>
        </div>
    );
}

export default Login;
