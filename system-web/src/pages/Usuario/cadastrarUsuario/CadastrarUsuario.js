import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "../../../components/Button";
import Header from "../../../components/Header/Header";
import Input from "../../../components/Input";
import Text from "../../../components/Text";
import Title from "../../../components/Title";
import './CadastrarUsuario.css';
import { useState } from "react";
import api from "../../../axiosConfig";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import { useNavigate } from "react-router-dom";

function CadastrarUsuario() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [sucessMessage, setSucessMessage] = useState("");

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [formDataUsuario, setFormDataUsuario] = useState({
        nome: "",
        login: "",
        senha: "",
        tipoAcesso: ""
    });

    const handleToggleSenha = () => {
        if (mostrarSenha === true) {
            setMostrarSenha(false);
        } else {
            setMostrarSenha(true);
        }
    };

    const cadastrarUsuario = async () => {
        try {
            await api.post('/usuario/cadastrar-usuario', formDataUsuario);

            setTimeout(() => {
                setSucessMessage("Usuário criado com sucesso");
            }, 5000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao criar usuário";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000);
        }
    }

    const handleChangeFormData = (e) => {
        const { name, value } = e.target;
        setFormDataUsuario({
            ...formDataUsuario,
            [name]: value
        })
    }

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

            <div className="container-cadastro-usuario">

                <div className="itens-cadastro-usuario">
                    <Title text={"Cadastrar novo usuário"} />
                    <form>
                        <div className="container-form-cadastro-usuario">
                            <div>
                                <label>Nome:</label>
                                <Input title={"Digite o nome do usuário"} placeholder={"Digite o nome do usuário"} type={"text"} onChange={handleChangeFormData} name={"nome"} />
                            </div>
                            <div>
                                <label>Login:</label>
                                <Input title={"Digite o login do usuário"} placeholder={"Digite o login do usuário"} type={"text"} onChange={handleChangeFormData} name={"login"} />
                            </div>

                            <div>
                                <label>Senha:</label>
                                <div className="input-password-wrapper" style={{width: '200px'}}>
                                    <Input
                                        type={mostrarSenha ? "text" : "password"}
                                        title={"Digite a senha do usuário"}
                                        placeholder={"Digite a senha do usuário"}
                                        className="input-password"
                                        onChange={handleChangeFormData}
                                        name={"senha"}
                                    />
                                    <Icon
                                        icon={mostrarSenha ? "mdi:eye-off" : "mdi:eye"}
                                        onClick={handleToggleSenha}
                                        className="icon-password"
                                        title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Tipo de acesso:</label>
                                <select onChange={handleChangeFormData} name="tipoAcesso">
                                    <option value={""}>Selecione</option>
                                    <option value={"A"}>Administrador</option>
                                    <option value={"G"}>Geral</option>
                                    <option value={"V"}>Visualização</option>
                                    <option value={"C"}>Coleta</option>
                                </select>
                            </div>
                        </div>
                    </form>

                    <div className="buttons-criar-novo-usuario">
                        <div id="botao-criar-usuario">
                            <Button
                                text={"Cadastrar"}
                                onClick={cadastrarUsuario}
                            />
                        </div>
                        <div id='botao-cancelar-criar-usuario'>
                            <Button
                                text={"Cancelar"}
                                onClick={() => {navigate("/inicio")}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadastrarUsuario;