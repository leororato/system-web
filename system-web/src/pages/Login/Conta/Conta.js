import { Icon } from "@iconify/react/dist/iconify.js";
import Header from "../../../components/Header/Header";
import Title from "../../../components/Title";
import Text from "../../../components/Text";
import "./Conta.css";


function Conta() {

    return (
        <div>
            <Header />

            <div className="container-minha-conta">
                <div className="subcontainer-minha-conta">

                    <Icon icon="mingcute:user-4-fill" id="icone-minha-conta"/>

                    <Title
                        text={'Minha Conta'}
                    />

                    <div id="text-minha-conta">
                        <Text
                            text={'Está é uma conta vinculada ao sistema NOMUS, portanto se deseja alterar alguma informação em sua conta, acesse o NOMUS para altera-lá.'}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Conta;