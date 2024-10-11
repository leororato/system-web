import { Icon } from "@iconify/react/dist/iconify.js";
import Header from "../../../components/Header/Header";
import Title from "../../../components/Title";
import Text from "../../../components/Text";
import "./Conta.css";
import Button from "../../../components/Button";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import Loading from "../../../components/Loading/Loading";


function Conta() {

    const navigate = useNavigate();
    const [contextLoading, setContextLoading] = useState({ visible: false });
    const [nomeUsuario, setNomeUsuario] = useState('');

    const handleLogoff = () => {
        Cookies.remove('jwt');
        setContextLoading({ visible: true });
        setTimeout(() => {
            navigate('/login');
            setContextLoading({ visible: false })
        }, 5000);
    }

    useEffect(() => {
        const storedUserName = localStorage.getItem('nomeUsuario');

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
                    <div id="text-minha-conta">
                        <Text
                            text={'Está é uma conta vinculada ao sistema NOMUS, portanto se deseja alterar alguma informação em sua conta, acesse o NOMUS para altera-lá.'}
                        />
                    </div>

                    <Button
                        text={'Sair da Conta'}
                        onClick={handleLogoff}
                    />
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