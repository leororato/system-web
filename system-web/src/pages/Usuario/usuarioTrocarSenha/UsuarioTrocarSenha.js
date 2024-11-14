import { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Input from "../../../components/Input";
import { Icon } from "@iconify/react/dist/iconify.js";
import api from "../../../axiosConfig";
import Title from "../../../components/Title";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import Button from "../../../components/Button";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";

function UsuarioTrocarSenha() {
    const navigate = useNavigate();
    const userId = Cookies.get('userId');

    const [errorMessage, setErrorMessage] = useState("");
    const [sucessMessage, setSucessMessage] = useState("");
    const [estadoDaPagina, setEstadoDaPagina] = useState("Atualizando");
    const [contextLoading, setContextLoading] = useState({ visible: false });

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenhaNova, setMostrarSenhaNova] = useState(false);

    const [formDataUsuario, setFormDataUsuario] = useState({
        nome: "",
        login: "",
        senhaAtual: "",
        senhaNova: ""
    });


    useEffect(() => {
        const fetchUsuarioInfo = async () => {
            const response = await api.get(`/usuario/buscar-info-meu-usuario/${userId}`);
            setFormDataUsuario({
                nome: response.data.nome,
                login: response.data.login,
                senhaAtual: "",
                senhaNova: ""
            });
            console.log('RESP: ', response.data)
        }


        fetchUsuarioInfo();
    }, [])

    const handleChangeFormData = (e) => {
        const { name, value } = e.target;
        setFormDataUsuario({
            ...formDataUsuario,
            [name]: value
        })
    }

    const handleToggleSenha = () => {
        if (mostrarSenha === true) {
            setMostrarSenha(false);
        } else {
            setMostrarSenha(true);
        }
    };

    const handleToggleSenhaNova = () => {
        if (mostrarSenhaNova === true) {
            setMostrarSenhaNova(false);
        } else {
            setMostrarSenhaNova(true);
        }
    };

    const handleCancelarAtualizacao = (e) => {
        e.preventDefault();

        navigate('/inicio')
    }

    const atualizarUsuario = async (e) => {
        e.preventDefault();

        setEstadoDaPagina("Salvando");
        setContextLoading({ visible: true });

        const usuarioTrocarSenhaRequest = {
            id: userId,
            senhaAtual: formDataUsuario.senhaAtual,
            senhaNova: formDataUsuario.senhaNova
        }
        console.log('formdata: ', formDataUsuario)
        try {
            await api.put(`/usuario/trocar-senha`, usuarioTrocarSenhaRequest);

            await setSucessMessage("Usuário atualizado com sucesso");

            setTimeout(() => {
                navigate(0);
            }, 1000)


        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao atualizar usuário";
            setErrorMessage(errorMessage);

            setFormDataUsuario({
                id: userId,
                nome: formDataUsuario.nome,
                login: formDataUsuario.login,
                senhaAtual: "",
                senhaNova: "",
            });
            setMostrarSenha(false);
            setMostrarSenhaNova(false);


        } finally {
            setContextLoading({ visible: false });
            setMostrarSenha(false);
            setMostrarSenhaNova(false);

        }
    }

    useEffect(() => {
        console.log('formData: ', formDataUsuario)
    }, [formDataUsuario])


    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="itens-cadastro-usuario" style={{ marginTop: '20vh', width: '40%' }}>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon icon="mdi:account-cog" style={{ width: '60px', height: '60px' }} />
                        <Title text={"Alterar senha"} />
                    </div>

                    <form onSubmit={atualizarUsuario}>
                        <div className="container-form-cadastro-usuario">
                            <div>
                                <label>Nome:</label>
                                <Input
                                    title={"Nome de usuário"}
                                    placeholder={"Nome do usuário"}
                                    type={"text"}
                                    name={"nome"}
                                    value={formDataUsuario.nome || ""}
                                    readOnly
                                    backgroundColor={'#ccc'}
                                    cursor={'not-allowed'}
                                />
                            </div>
                            <div>
                                <label>Login:</label>
                                <Input
                                    title={"Login do usuário"}
                                    placeholder={"Login do usuário"}
                                    type={"text"}
                                    name={"login"}
                                    value={formDataUsuario.login || ""}
                                    readOnly
                                    backgroundColor={'#ccc'}
                                    cursor={'not-allowed'}
                                />
                            </div>

                            <div>
                                <label>Senha atual:</label>
                                <div className="input-password-wrapper" style={{ width: '200px' }}>
                                    <Input
                                        type={mostrarSenha ? "text" : "password"}
                                        title={"Digite a sua senha atual"}
                                        placeholder={"Digite a senha atual..."}
                                        className="input-password"
                                        onChange={handleChangeFormData}
                                        name={"senhaAtual"}
                                        value={formDataUsuario.senhaAtual}
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
                                <label>Senha nova:</label>
                                <div className="input-password-wrapper" style={{ width: '200px' }}>
                                    <Input
                                        type={mostrarSenhaNova ? "text" : "password"}
                                        title={"Digite uma nova senha"}
                                        placeholder={"Digite uma nova senha..."}
                                        className="input-password"
                                        onChange={handleChangeFormData}
                                        name={"senhaNova"}
                                        value={formDataUsuario.senhaNova}
                                    />
                                    <Icon
                                        icon={mostrarSenhaNova ? "mdi:eye-off" : "mdi:eye"}
                                        onClick={handleToggleSenhaNova}
                                        className="icon-password"
                                        title={mostrarSenhaNova ? "Ocultar senha" : "Mostrar senha"}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="buttons-criar-novo-usuario">
                            <div id="botao-criar-usuario">
                                <Button
                                    text="Atualizar"
                                    onClick={(e) => atualizarUsuario(e)}
                                />
                            </div>
                            <div id='botao-cancelar-criar-usuario'>
                                <Button
                                    text={"Cancelar"}
                                    onClick={(e) => handleCancelarAtualizacao(e)}
                                />
                            </div>
                        </div>

                    </form>

                </div>
            </div>



            {contextLoading.visible ? (
                <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : estadoDaPagina === "Atualizando" ? "Atualizando..." : estadoDaPagina === "Salvando" ? "Salvando..." : "Excluindo..."} />
            ) : (
                <></>
            )}
        </div>
    );

}

export default UsuarioTrocarSenha;