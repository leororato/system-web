import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Text from "../../components/Text";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Unauthorized() {
    const [timer, setTimer] = useState(20); // Começa com 20 segundos (ou qualquer valor desejado)
    const navigate = useNavigate();

    useEffect(() => {
        if (timer === 0) {
            // Redireciona o usuário quando o timer chega a 0
            Cookies.remove('token');
            Cookies.remove('nomeUsuario');
            Cookies.remove('userId');
            Cookies.remove('nivelAcesso');
            navigate("/");
        } else {
            // Atualiza o timer a cada segundo
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            // Limpa o intervalo quando o componente desmonta ou o timer chega a 0
            return () => clearInterval(intervalId);
        }
    }, [timer, navigate]);

    return (
        <div>
            <Header />
            <Text 
                text={`Você não tem permissão para acessar esta página. Você será redirecionado para a página inicial em: ${timer} segundos.`}
            />
        </div>
    );
}

export default Unauthorized;
