import Button from "../../../components/Button";
import Header from "../../../components/Header/Header";
import Input from "../../../components/Input";
import Text from "../../../components/Text";
import Title from "../../../components/Title";
import './CadastrarUsuario.css';

function CadastrarUsuario() {


    return (
        <div>
            <Header />

            <div className="container-cadastro-usuario">

                <div className="itens-cadastro-usuario">
                    <Title text={"Cadastrar novo usuário"} />
                    <form>
                        <div className="container-form-cadastro-usuario">
                            <div>
                                <label>Nome:</label>
                                <Input title={"Digite o nome do usuário"} placeholder={"Digite o nome do usuário"} type={"text"} />
                            </div>
                            <div>
                                <label>Login:</label>
                                <Input title={"Digite o login do usuário"} placeholder={"Digite o login do usuário"} type={"text"} />
                            </div>

                            <div>
                                <label>Senha:</label>
                                <Input type={"password"} title={"Digite a senha do usuário"} placeholder={"Digite a senha do usuário"} />
                            </div>
                            <div>
                                <label>Tipo de acesso:</label>
                                <select>
                                    <option>Selecione</option>
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
                            />
                        </div>
                        <div id='botao-cancelar-criar-usuario'>
                            <Button
                                text={"Cancelar"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadastrarUsuario;