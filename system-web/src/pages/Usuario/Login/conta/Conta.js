import { Icon } from "@iconify/react/dist/iconify.js";
import "./Conta.css";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../../../components/Header/Header";
import Title from "../../../../components/Title";
import Text from "../../../../components/Text";
import Loading from "../../../../components/Loading/Loading";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";


function Conta() {

    const navigate = useNavigate();
    const [contextLoading, setContextLoading] = useState({ visible: false });
    const [nomeUsuario, setNomeUsuario] = useState('');

    const handleLogoff = () => {
        Cookies.remove('token');
        Cookies.remove('nomeUsuario');
        Cookies.remove('userId');
        Cookies.remove('nivelAcesso');
        setContextLoading({ visible: true });
        setTimeout(() => {
            navigate('/login');
            setContextLoading({ visible: false })
        }, 5000);
    }

    const handleTrocarSenha = () => {
        navigate('/trocar-senha');
    }

    useEffect(() => {
        const storedUserName = Cookies.get('nomeUsuario');

        if (storedUserName) {
            setNomeUsuario(storedUserName);
        }
    }, [])

    return (
        <div>
            <Header />
            <div className="container-minha-conta">
                <div className="subcontainer-minha-conta">

                    <Icon icon="mingcute:user-4-fill" id="icone-minha-conta" />

                    <Title
                        text={'Minha Conta'}
                    />
                    <Text
                        text={"Usuário: " + [nomeUsuario]}
                        fontSize={'20px'}
                    />

                    <div className="contianer-buttons-usuario">
                        <div>
                            <Button
                                text={'Trocar senha'}
                                onClick={handleTrocarSenha}
                            />
                        </div>
                        <div>
                            <Button
                                text={'Sair da Conta'}
                                onClick={handleLogoff}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {contextLoading.visible && (
                <>
                    <Loading message={'Desconectando...'} />
                </>
            )}

        </div>
    );
}

export default Conta;