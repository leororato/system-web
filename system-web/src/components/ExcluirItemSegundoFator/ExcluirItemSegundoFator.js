import React, { useState } from 'react';
import './ExcluirItemSegundoFator.css';
import Text from '../Text';
import Input from '../Input';
import Button from '../Button';

const ExcluirItem = ({
    onSubmit,
    descricao,
    onChange,
    onClickBotaoCancelar,
    onClickBotaoExcluir
}) => {

    return (
        <>
            <div className="overlay"></div>
            <div className="context-delete-segundo-fator">
                <form onSubmit={onSubmit}>
                    <div>
                        <div id="container-text-confirmar-exclusao">
                            <Text
                                text={descricao}
                                fontSize={18}
                            />
                        </div>
                        <div id="container-input-confirmar-exclusao">
                            <Input
                                className="input-confirmar-exclusao"
                                type={'text'}
                                placeholder={'Digite: Excluir'}
                                onChange={onChange}
                            />
                        </div>
                    </div>

                    <div className="buttons-delete-segundo-fator">
                        <Button
                            className={'button-cancelar'}
                            text={'Cancelar'}
                            fontSize={20}
                            onClick={onClickBotaoCancelar}
                        />
                        <Button
                            className={'button-excluir'}
                            text={'Confirmar'}
                            fontSize={20}
                            type={"submit"}
                            onClick={onClickBotaoExcluir}
                        />
                    </div>
                </form>

            </div>
        </>
    );
}

export default ExcluirItem;
