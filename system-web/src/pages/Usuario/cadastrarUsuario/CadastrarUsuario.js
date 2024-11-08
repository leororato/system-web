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
    const [estadoDoCadastro, setEstadoDoCadastro] = useState("Cadastro")

    // listagem
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [buscaLogin, setBuscaLogin] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedId: null });
    const nivelAcessoLabels = {
        A: "Admin",
        G: "Geral",
        V: "Visualização",
        C: "Coleta", // Presumo que "C" seja para "Coleta"
    };


    // cadastro
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [formDataUsuario, setFormDataUsuario] = useState({
        nome: "",
        login: "",
        senha: "",
        nivelAcesso: ""
    });

    // ediçao
    const [formDataEdicaoUsuario, setFormDataEdicaoUsuario] = useState({
        id: null,
        nome: "",
        login: "",
        senha: null,
        nivelAcesso: "",
        ativo: ""
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
        setEstadoDaPagina("Salvando");
        setContextLoading({ visible: true });

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
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);

            setFormDataUsuario({
                nome: "",
                login: "",
                senha: "",
                nivelAcesso: ""
            });

        } finally {
            setContextLoading({ visible: false });
            setMostrarSenha(false);

        }
    }

    const handleChangeFormData = (e) => {
        const { name, value } = e.target;
        setFormDataUsuario({
            ...formDataUsuario,
            [name]: value
        })
    }

    const handleChangeFormDataEdicao = (e) => {
        const { name, value } = e.target;
        setFormDataEdicaoUsuario({
            ...formDataEdicaoUsuario,
            [name]: value
        })
    }

    const handleCancelarCadastroOuEdicao = () => {
        setFormDataUsuario({
            nome: "",
            login: "",
            senha: "",
            nivelAcesso: ""
        });
        setFormDataEdicaoUsuario({
            id: null,
            nome: "",
            login: "",
            senha: null,
            nivelAcesso: "",
            ativo: ""
        });
        setEstadoDoCadastro("Cadastro");
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
        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao criar usuário";
            setErrorMessage(errorMessage);
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
        }
    }

    const handleRightClick = (e, id, nome, login, nivelAcesso, ativo) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: id,
            selectedNome: nome,
            selectedLogin: login,
            selectedNivelAcesso: nivelAcesso,
            selectedAtivo: ativo,
        })
        setFormDataEdicaoUsuario({
            id: id,
            nome: nome,
            login: login,
            senha: "",
            nivelAcesso: nivelAcesso,
            ativo: ativo
        })
    }

    const handleClickOutside = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null,
            selectedSeq: null,
            selectedDesc: null
        });

    };

    const formatarData = (dtCriacao) => {
        if (!dtCriacao) return 'Data inválida';
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };

    // Atualizar usuario

    const handleAtualizarUsuario = () => {
        setEstadoDoCadastro("Editar");
    }

    const atualizarUsuario = async () => {
        setEstadoDaPagina("Atualizando");
        setContextLoading({ visible: true });

        try {
            await api.put(`/usuario/atualizar-usuario/${formDataEdicaoUsuario.id}`, formDataEdicaoUsuario);

            setSucessMessage("Usuário atualizado com sucesso");
            setTimeout(() => {
                setSucessMessage(null);
            }, 5000);

            setEstadoDoCadastro("Cadastro");
            await setFormDataEdicaoUsuario({
                id: null,
                nome: "",
                login: "",
                senha: "",
                nivelAcesso: "",
                ativo: ""
            });

            await fetchUsuarios();

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao atualizar usuário";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);

            setFormDataEdicaoUsuario({
                id: null,
                nome: "",
                login: "",
                senha: null,
                nivelAcesso: "",
                ativo: ""
            });
            setMostrarSenha(false);

        } finally {
            setContextLoading({ visible: false });
            setMostrarSenha(false);

        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

            <div className="container-cadastro-usuario">

                <div className="itens-cadastro-usuario">
                    <Title text={estadoDoCadastro === "Cadastro" ? "Cadastrar novo usuário" : "Editar usuário"} />
                    <form onSubmit={atualizarUsuario}>
                        <div className="container-form-cadastro-usuario">
                            <div>
                                <label>Nome:</label>
                                {estadoDoCadastro === "Cadastro" ?
                                    <Input
                                        title={"Digite o nome do usuário"}
                                        placeholder={"Digite o nome do usuário"}
                                        type={"text"}
                                        onChange={handleChangeFormData}
                                        name={"nome"}
                                        value={formDataUsuario.nome || ""}
                                    />
                                    :
                                    <Input
                                        title={"Digite o nome do usuário"}
                                        placeholder={"Atualize o nome do usuário"}
                                        type={"text"}
                                        onChange={handleChangeFormDataEdicao}
                                        name={"nome"}
                                        value={formDataEdicaoUsuario.nome || ""}
                                    />}

                            </div>
                            <div>
                                <label>Login:</label>
                                {estadoDoCadastro === "Cadastro" ?
                                    <Input
                                        title={"Digite o login do usuário"}
                                        placeholder={"Digite o login do usuário"}
                                        type={"text"}
                                        onChange={handleChangeFormData}
                                        name={"login"}
                                        value={formDataUsuario.login || ""}
                                    />
                                    :
                                    <Input
                                        title={"Digite o login do usuário"}
                                        placeholder={"Atualize o login do usuário"}
                                        type={"text"}
                                        onChange={handleChangeFormDataEdicao}
                                        name={"login"}
                                        value={formDataEdicaoUsuario.login || ""}
                                    />}
                            </div>

                            <div>
                                <label>Senha:</label>
                                <div className="input-password-wrapper" style={{ width: '200px' }}>
                                    <Input
                                        type={mostrarSenha ? "text" : "password"}
                                        title={"Digite a senha do usuário"}
                                        placeholder={estadoDoCadastro === "Cadastro" ? "Digite a senha do usuário" : "Atualizar senha do usuário"}
                                        className="input-password"
                                        onChange={estadoDoCadastro === "Cadastro" ? handleChangeFormData : handleChangeFormDataEdicao}
                                        name={"senha"}
                                        value={estadoDoCadastro === "Cadastro" ? formDataUsuario.senha || "" : formDataEdicaoUsuario.senha}
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
                                <select onChange={estadoDoCadastro === "Cadastro" ? handleChangeFormData : handleChangeFormDataEdicao} name="nivelAcesso" value={estadoDoCadastro === "Cadastro" ? formDataUsuario.nivelAcesso || "" : formDataEdicaoUsuario.nivelAcesso || ""}>
                                    <option value={""}>Selecione</option>
                                    <option value={"A"}>Administrador</option>
                                    <option value={"G"}>Geral</option>
                                    <option value={"V"}>Visualização</option>
                                    <option value={"C"}>Coleta</option>
                                </select>
                            </div>

                            {estadoDoCadastro !== "Cadastro" && (
                                <div>
                                    <label>Status:</label>
                                    <select onChange={estadoDoCadastro === "Cadastro" ? handleChangeFormData : handleChangeFormDataEdicao} name="ativo" value={estadoDoCadastro === "Cadastro" ? formDataUsuario.ativo || "" : formDataEdicaoUsuario.ativo || ""}>
                                        <option value={""}>Selecione</option>
                                        <option value={"A"}>Ativo</option>
                                        <option value={"I"}>Inativo</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </form>

                    <div className="buttons-criar-novo-usuario">
                        <div id="botao-criar-usuario">
                            <Button
                                text={estadoDoCadastro === "Cadastro" ? "Cadastrar" : "Atualizar"}
                                onClick={estadoDoCadastro === "Cadastro" ? cadastrarUsuario : atualizarUsuario}
                            />
                        </div>
                        <div id='botao-cancelar-criar-usuario'>
                            <Button
                                text={"Cancelar"}
                                onClick={handleCancelarCadastroOuEdicao}
                            />
                        </div>
                    </div>
                </div>


                <div className="ul-lista-usuarios">
                    <div className='busca-invoice-input' style={{ marginBottom: "10px" }}>
                        <Input
                            type={'text'}
                            placeholder={'Nome'}
                            title={'Pesquise pelo NOME do usuário...'}
                            value={buscaLogin}
                            onChange={(e) => setBuscaLogin(e.target.value)}
                        />
                    </div>

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
                                        <li key={user.id} onContextMenu={(e) => handleRightClick(e, user.id, user.nome, user.login, user.nivelAcesso, user.ativo)} id="lista-user-1">
                                            <div>{user.id}</div>
                                            <div>{user.nome}</div>
                                            <div>{user.login}</div>
                                            <div>{nivelAcessoLabels[user.nivelAcesso] || "Não encontrado"}</div>
                                            <div>{user.ativo === "A" ? "Ativo" : "Inativo"}</div>
                                            <div>{formatarData(user.dtCriacao)}</div>
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


            {contextMenu.visible && (
                <div className='context-menu' style={{
                    top: `${contextMenu.y}px`, left: `${contextMenu.x}px`
                }}>
                    <div id='container-icon-menu' onClick={handleAtualizarUsuario}>
                        <Icon icon="mdi:edit" id='icone-menu' />
                        <p>Editar usuário</p>
                    </div>
                </div>
            )}

            {contextLoading.visible ? (
                <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : estadoDaPagina === "Atualizando" ? "Atualizando..." : estadoDaPagina === "Salvando" ? "Salvando..." : "Excluindo..."} />
            ) : (
                <></>
            )}

        </div>
    );
}

export default CadastrarUsuario;