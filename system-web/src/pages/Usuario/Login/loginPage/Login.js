import "./Login.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import ErrorNotification from "../../../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../../../components/SucessNotification/SucessNotification";
import Text from "../../../../components/Text";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import Logo from "../../../../assets/logo.png"
import axios from "axios";
import { Icon } from "@iconify/react/dist/iconify.js";
import api from "../../../../axiosConfig";

function Login() {
    const navigate = useNavigate();
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");

    const location = useLocation();
    const query = new URLSearchParams(useLocation().search);
    const errorTokenMessage = query.get('error');
    const [errorMessage, setErrorMessage] = useState(location.state?.errorMessage || null);
    const [sucessMessage, setSucessMessage] = useState(null);

    const [mostrarSenha, setMostrarSenha] = useState(false);

    useEffect(() => {
        if (errorTokenMessage != null) {
            setErrorMessage(errorTokenMessage);
        }
    }, [errorTokenMessage])

    useEffect(() => {
        const verificarToken = async () => {
            const token = Cookies.get('token');

            if (token != null) {
                const payload = {
                    token: token
                }
                const response = await api.post(`/usuario/validate-token`, payload);
                if (response.data) {
                    navigate('/inicio');
                }
            } else {
                Cookies.remove('token');
                Cookies.remove('nomeUsuario');
                Cookies.remove('userId');
                Cookies.remove('nivelAcesso');
                navigate('/login');
            }
        }

        verificarToken();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Faz a requisição de login
                const response = await axios.post('http://192.168.1.238:8080/auth/login', {
                // const response = await axios.post('http://localhost:8080/auth/login', {
                login: login,
                senha: senha
            });

            Cookies.set('token', response.data.token, {
                expires: 7,               // expira em 7 dias
                sameSite: 'Lax',        // impede o envio do cookie em solicitações de terceiros
            });

            Cookies.set('nomeUsuario', response.data.nome, {
                expires: 7,               // expira em 7 dias
                sameSite: 'Lax',        // impede o envio do cookie em solicitações de terceiros
            });

            Cookies.set('userId', response.data.id, {
                expires: 7,               // expira em 7 dias
                sameSite: 'Lax',        // impede o envio do cookie em solicitações de terceiros
            })

            Cookies.set('nivelAcesso', response.data.nivelAcesso, {
                expires: 7,               // expira em 7 dias
                sameSite: 'Lax',        // impede o envio do cookie em solicitações de terceiros
            })

            navigate('/inicio');
        } catch (error) {
            if (error.response) {

                const errorMessage = error.response?.data || "Erro desconhecido ao fazer Login";
                setErrorMessage(errorMessage);

            }
        }
    };

    const handleToggleSenha = () => {
        if (mostrarSenha === true) {
            setMostrarSenha(false);
        } else {
            setMostrarSenha(true);
        }
    };

    return (
        <div>
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />
            <div className="login-aba">
                <form onSubmit={handleSubmit}>
                    <div className="login-bloco">

                        <div className="logo-container">
                            <img src={Logo} width={'200px'} height={'80px'} />
                        </div>
                        <div className="login-itens">
                            <div>
                                <Text
                                    id="login-text"
                                    text={'Login:'}
                                    color={'black'}
                                    fontSize={20}
                                />
                                <div className="login-container" style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Input
                                        id="input-login"
                                        type={'text'}
                                        placeholder={'Digite seu Login'}
                                        padding={7}
                                        onChange={(e) => setLogin(e.target.value)}
                                        value={login}
                                    />
                                    <Icon icon="mdi:account" width="24" height="24"
                                        style={{ position: 'absolute', cursor: 'pointer', marginRight: 10, color: "#999" }} />
                                </div>
                            </div>

                            <div className="password-container">
                                <Text
                                    id="text-senha"
                                    text={'Senha:'}
                                    color={'black'}
                                    fontSize={20}
                                />
                                <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Input
                                        id="input-senha"
                                        type={mostrarSenha ? "text" : "password"}
                                        placeholder={'Digite sua Senha'}
                                        padding={7}
                                        onChange={(e) => setSenha(e.target.value)}
                                        value={senha}
                                    />
                                    <Icon
                                        icon={mostrarSenha ? "mdi:eye-off" : "mdi:eye"}
                                        onClick={handleToggleSenha}
                                        title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                        style={{ position: 'absolute', cursor: 'pointer', marginRight: 10, color: "#999" }}
                                    />
                                </div>
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
                </form>
            </div>
        </div>
    );
}

export default Login;
