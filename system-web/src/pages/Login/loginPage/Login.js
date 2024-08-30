import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Text from "../../../components/Text";
import Logo from "../../../components/Logo";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";


function Login() {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");

    const [errorMessage, setErrorMessage] = useState(null);
    const [sucessMessage, setSucessMessage] = useState(null);

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

                const errorMessage = error.response?.data || "Erro desconhecido ao fazer Login";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            } else if (error.request) {

                const errorMessage = error.response?.data || "Erro desconhecido ao fazer Login";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            } else {

                const errorMessage = error.response?.data || "Erro desconhecido ao fazer Login";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            }
        }
    };

    return (
        <div>
            <ErrorNotification message={errorMessage} onClose={() => {setErrorMessage(null)}} />
            <SucessNotification message={sucessMessage} onClose={() => {setSucessMessage(null)}} />
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
                    </div>
            </div>
        </div>
    );
}

export default Login;
