import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "../../../components/Button";
import Header from "../../../components/Header/Header";
import Input from "../../../components/Input";
import Text from "../../../components/Text";
import Title from "../../../components/Title";
import './CadastrarUsuario.css';
import { useEffect, useState } from "react";
import api from "../../../axiosConfig";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/Loading/Loading";
import { format } from "date-fns";

function CadastrarUsuario() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [sucessMessage, setSucessMessage] = useState("");
    const [contextLoading, setContextLoading] = useState({ visible: false });
    const [estadoDaPagina, setEstadoDaPagina] = useState("Carregando");

    // listagem
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [buscaLogin, setBuscaLogin] = useState('');


    // cadastro
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [formDataUsuario, setFormDataUsuario] = useState({
        nome: "",
        login: "",
        senha: "",
        nivelAcesso: ""
    });

    // cadastro usuarios

    const handleToggleSenha = () => {
        if (mostrarSenha === true) {
            setMostrarSenha(false);
        } else {
            setMostrarSenha(true);
        }
    };

    const cadastrarUsuario = async () => {
        setEstadoDaPagina("Carregando");
        setContextLoading({ visible: true });
        console.log("form: ", formDataUsuario);

        try {
            await api.post('/usuario/cadastrar-usuario', formDataUsuario);
            setSucessMessage("Usuário criado com sucesso");

            setTimeout(() => {
                setSucessMessage(null);
            }, 5000);

            await fetchUsuarios();

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao criar usuário";
            setErrorMessage(errorMessage);
            console.log("erro: ", error)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);

            setFormDataUsuario({
                nome: "",
                login: "",
                senha: "",
                nivelAcesso: ""
            })
        } finally {
            setContextLoading({ visible: false });

        }
    }

    const handleChangeFormData = (e) => {
        const { name, value } = e.target;
        setFormDataUsuario({
            ...formDataUsuario,
            [name]: value
        })
    }

    // lista usuarios

    useEffect(() => {
        const filteredUsuarios = usuarios.filter(user =>
            (user.login ? user.login.toLowerCase() : '').includes(buscaLogin.toLowerCase())
        );
        setFilteredUsuarios(filteredUsuarios);
    }, [buscaLogin, usuarios]);

    useEffect(() => {
        fetchUsuarios();
    }, [])

    const fetchUsuarios = async () => {
        setEstadoDaPagina("Carregando");
        setContextLoading({ visible: true });

        try {
            const response = await api.get(`/usuario/buscar-todos-usuarios`);
            setUsuarios(response.data);
            console.log('usuarios: ', response.data);
        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao criar usuário";
            setErrorMessage(errorMessage);
            console.log("erro: ", error)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
        }
    }

    const handleRightClick = (e) => {

    }


    const formatarData = (dtCriacao) => {
        if (!dtCriacao) return 'Data inválida';
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };


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
                                <Input title={"Digite o nome do usuário"} placeholder={"Digite o nome do usuário"} type={"text"} onChange={handleChangeFormData} name={"nome"} value={formDataUsuario.nome || ""} />
                            </div>
                            <div>
                                <label>Login:</label>
                                <Input title={"Digite o login do usuário"} placeholder={"Digite o login do usuário"} type={"text"} onChange={handleChangeFormData} name={"login"} value={formDataUsuario.login || ""} />
                            </div>

                            <div>
                                <label>Senha:</label>
                                <div className="input-password-wrapper" style={{ width: '200px' }}>
                                    <Input
                                        type={mostrarSenha ? "text" : "password"}
                                        title={"Digite a senha do usuário"}
                                        placeholder={"Digite a senha do usuário"}
                                        className="input-password"
                                        onChange={handleChangeFormData}
                                        name={"senha"}
                                        value={formDataUsuario.senha || ""}
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
                                <select onChange={handleChangeFormData} name="nivelAcesso" value={formDataUsuario.nivelAcesso || ""}>
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
                                onClick={() => { navigate("/inicio") }}
                            />
                        </div>
                    </div>
                </div>


                <div className='busca-invoice-input'>
                    <Input
                        type={'text'}
                        placeholder={'Invoice'}
                        title={'Pesquise pelo INVOICE da packinglist...'}
                        value={buscaLogin}
                        onChange={(e) => setBuscaLogin(e.target.value)}
                    />
                </div>
                
                <div className="ul-lista-usuarios">
                    <ul>
                        <li id="header-lista-usuarios">
                            <div>ID</div>
                            <div>Nome</div>
                            <div>Login</div>
                            <div>Nivel de Acesso</div>
                            <div>Status</div>
                            <div>Data Criação</div>
                        </li>

                        <>
                            {filteredUsuarios && filteredUsuarios.length > 0 ? (
                                filteredUsuarios.map((user) => {

                                    return (
                                        <li key={user.id} onContextMenu={(event) => handleRightClick(event, user.id)} id="lista-user-1">
                                            <div>{user.idPackinglist}</div>
                                            <div>{formatarData(user.dtCriacao)}</div>
                                            <div>{user.nome}</div>
                                            <div>{user.login}</div>
                                            <div>{user.nivelAcesso}</div>
                                            <div>{user.ativo}</div>
                                        </li>
                                    );
                                })
                            ) : (
                                <div id="nao-existe-usuario">
                                    <li>Ainda não há usuários registrados...</li>
                                </div>
                            )}
                        </>
                    </ul>
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

export default CadastrarUsuario;