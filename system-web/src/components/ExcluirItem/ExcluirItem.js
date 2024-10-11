import './ExcluirItem.css';
import Text from '../Text';
import Button from '../Button';

const ExcluirItem = ({
    descricao,
    onClickBotaoCancelar,
    onClickBotaoExcluir
}) => {
    return (
        <>
            <div className="overlay"></div>
            <div className="context-delete">
                <div style={{ marginTop: '10px'}}>
                    <Text
                        text={descricao}
                        fontSize={18}
                    />
                </div>

                <div className="buttons-delete">
                    <Button
                        className={'button-cancelar'}
                        text={'Cancelar'}
                        fontSize={15}
                        onClick={onClickBotaoCancelar}
                    />
                    <Button
                        className={'button-excluir'}
                        text={'Excluir'}
                        fontSize={15}
                        onClick={onClickBotaoExcluir}
                    />
                </div>
            </div>
        </>
    );
}

export default ExcluirItem;