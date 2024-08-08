import Header from "../../components/Header/Header";
import Input from "../../components/Input";
import Text from "../../components/Text";
import Title from "../../components/Title";
import './CadastroTipoVolume.css'


    function CadastroTipoVolume() {
        return(
            <div>
                <Header />

                <div className="container-geral">
                    <Title 
                    id={'title'}
                    text={'Cadastrar Tipo do Volume'}
                    />
                    <div className="itens-container">
                    <Text 
                    text={'Tipo do Volume:'}
                    />
                    <Input 
                    type={'text'}
                    placeholder={'Descrição do tipo de volume...'}
                    title={'Tipo do volume'}
                    />
                    </div>
                </div>
            </div>
        );
    }

    export default CadastroTipoVolume;