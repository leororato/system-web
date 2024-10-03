
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import './PackingList.css';
import Title from '../../../components/Title';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Input from '../../../components/Input';
import ErrorNotification from '../../../components/ErrorNotification/ErrorNotification';
import SucessNotification from '../../../components/SucessNotification/SucessNotification';
import { Icon } from '@iconify/react/dist/iconify.js';
import Cookies from 'js-cookie';
import api from '../../../axiosConfig';
import Loading from '../../../components/Loading/Loading';


function PackingList() {

    // Obtenha o token JWT do cookie
    const token = Cookies.get('jwt');

    // Configure o header da requisição
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };


    const navigate = useNavigate();

    const location = useLocation();
    const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [estadoDaPagina, setEstadoDaPagina] = useState('Carregando');
    const [contextLoading, setContextLoading] = useState({ visible: false });
    const [packingLists, setPackingLists] = useState([]);

    const [clientes, setClientes] = useState({});

    const [buscaInvoice, setBuscaInvoice] = useState('');
    const [filteredPackinglist, setFilteredPackinglist] = useState([]);

    const [contextMenu, setContextMenu] = useState({
        visible: false, x: 0, y: 0, selectedId: null
    });

    const [inputDeleteSegundoFator, setInputDeleteSegundoFator] = useState("");
    const [contextDeleteSegundoFator, setContextDeleteSegundoFator] = useState({ visible: false, x: 0, y: 0, selectedId: null })
    const [contextDelete, setContextDelete] = useState({
        visible: false, x: 0, y: 0, selectedId: null
    });

    useEffect(() => {
        const filterPackinglist = packingLists.filter(p =>
            (p.invoice ? p.invoice.toLowerCase() : '').includes(buscaInvoice.toLowerCase())
        );
        setFilteredPackinglist(filterPackinglist);
    }, [buscaInvoice, packingLists]);


    useEffect(() => {
        fetchPackingListContainer();
    }, []);


    const fetchPackingListContainer = () => {

        const fetchPackingLists = async () => {
            setEstadoDaPagina('Carregando')
            try {
                const response = await api.get('/packinglist', config);
                setPackingLists(response.data);
                setContextLoading({ visible: true })
            } catch (error) {
                const errorMessage = error.response?.data?.message;
                setErrorMessage(errorMessage);

                console.log("Erro: ", errorMessage)

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
            } finally {
                setContextLoading({ visible: false })
            }
        }


        const fetchClientes = async () => {
            setEstadoDaPagina('Carregando')
            try {
                const response = await api.get('/clienteNomus', config);
                const clientesData = response.data.reduce((acc, cliente) => {
                    acc[cliente.id] = cliente.nome;
                    return acc;
                }, {});
                setClientes(clientesData);
                setContextLoading({ visible: true });

            } catch (error) {

                const errorMessage = error.response?.data?.message;
                setErrorMessage(errorMessage);
                console.log("erro: ", error)
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000)
            } finally {
                setContextLoading({ visible: false })
            }
        };

        fetchPackingLists();
        fetchClientes();
    }


    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    useEffect(() => {
        if (sucessMessage) {
            const timer = setTimeout(() => {
                setSucessMessage(null);
                navigate(location.state, { replace: true, state: {} });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [sucessMessage, navigate]);




    const formatarData = (dtCriacao) => {
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };


    const handleRightClick = (event, id) => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            selectedId: id
        });
    };



    const handleClickOutside = () => {
        setContextMenu({ visible: false, x: 0, y: 0, selectedId: null });
    };



    const handleEdit = () => {
        setContextMenu({ visible: false, x: 0, y: 0, selectedId: null });
        navigate(`/editar-packing-list/${contextMenu.selectedId}`);
    };


    const handleChange = (e) => {
        setInputDeleteSegundoFator(e.target.value);
    }


    const handleDelete = (event) => {
        setContextMenu({ visible: false, x: 0, y: 0, selectedId: null });
        setContextDelete({
            visible: true, x: event.pageX, y: event.pageY, selectedId: contextMenu.selectedId
        });
    };


    const handleDeleteSegundoFator = (e) => {

        setContextDelete({ visible: false });
        setContextDeleteSegundoFator({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: contextDelete.selectedId
        })

    }


    const handleDeleteConfirm = async (e) => {
        const itemDeletado = contextDelete.selectedId;
        setEstadoDaPagina('Excluindo')
        setContextLoading({ visible: true });
        const permissaoParaExcluir = "semPermissao";

        try {
            await api.delete(`/packinglist/${itemDeletado}/${permissaoParaExcluir}`, config);


            // setPackingLists(packingLists.filter(packingList =>
            //     packingList.id !== contextDelete.selectedId));
            setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
            setSucessMessage(`Packinglist ${itemDeletado} deletado com sucesso`);
            setTimeout(() => setSucessMessage(null), 5000);

            fetchPackingListContainer();

        } catch (error) {

            if (error.response?.status === 409) {
                handleDeleteSegundoFator(e);

                const errorMessage = error.response?.data || "Erro desconhecido ao excluir Packinglist";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
            }

            const errorMessage = error.response?.data || "Erro desconhecido ao excluir Packinglist";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000)

        } finally {
            setContextLoading({ visible: false });
        }
    };


    const handleDeleteConfirmSegundoFator = async (e) => {
        e.preventDefault();

        const itemDeletado = contextDeleteSegundoFator.selectedId;
        setEstadoDaPagina('Excluindo');
        setContextLoading({ visible: true });

        const permissaoParaExcluir = (inputDeleteSegundoFator === "Excluir") ? "comPermissao" : "palavraChaveErrada";

        try {
            await api.delete(`/packinglist/${itemDeletado}/${permissaoParaExcluir}`, config);

            setSucessMessage(`Packinglist ${itemDeletado} deletado com sucesso`);
            setTimeout(() => {
                setSucessMessage(null);
            }, 5000);

            setContextDeleteSegundoFator({ visible: false, selectedId: null, x: 0, y: 0 });
            await fetchPackingListContainer();

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao excluir Packinglist";

            if (error.response?.status === 406) {
                setErrorMessage("A palavra de confirmação foi digitada incorretamente");
            } else {
                setErrorMessage(errorMessage);

            }

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

            setContextDeleteSegundoFator({ visible: false, selectedId: null });

        } finally {
            setContextLoading({ visible: false });

        }
    }


    const handleList = () => {
        setContextMenu({ visible: false, x: 0, y: 0, selectedId: null });
        navigate(`/packing-list-produto/${contextMenu.selectedId}`);
    };


    const handleErrorClose = () => {
        setErrorMessage(null);
    }

    const gerarQrCode = async (e) => {
        e.preventDefault();

        try {
            navigate(`/exibir-qrcode-packinglist/${contextMenu.selectedId}`);
        }
        catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao ir para a página 'Gerar QR Code da Packinglist'";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);
        }
    }


    const handleGerarPdf = async () => {
        try {

            const configHeaderPdf = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'arraybuffer',  // Inclua o responseType dentro do config
            };

            const response = await axios.get(`http://localhost:8080/api/packinglist/pdf/${contextMenu.selectedId}`, configHeaderPdf);

            // Criar um URL para o blob e forçar o download
            const blob = new Blob([response.data], { type: 'application/pdf' }); // Defina o tipo explicitamente
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `packinglist_${contextMenu.selectedId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao gerar o PDF";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);
        }
    };

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={handleErrorClose} />
            {sucessMessage ? (
                <SucessNotification message={sucessMessage} onClose={() => setSucessMessage(null)} />
            ) : (
                <></>
            )}

            <div className='title-container'>
                <Title
                    classname={'title'}
                    text={'Listagem de Packing Lists'}
                    fontSize={30}
                    color={'#1780e2'}
                />
            </div>

            <div className='container-listagem'>
                <div className='buttons'>
                    <div className='button-container-listagem'>
                        <Button
                            className={'button-item'}
                            text={'Novo Packing List'}
                            title={'Clique aqui para adicionar um novo PackingList...'}
                            padding={10}
                            borderRadius={2}
                            fontSize={15}
                            onClick={() => navigate('/cadastrar-packing-list')}
                        />
                    </div>

                    <div className='busca-invoice-input'>
                        <Input
                            type={'text'}
                            placeholder={'Invoice'}
                            title={'Pesquise pelo INVOICE da packinglist...'}
                            value={buscaInvoice}
                            onChange={(e) => setBuscaInvoice(e.target.value)}
                        />
                    </div>

                </div>
                <div className='container-listagem-inicio'>
                    <ul>
                        <li className="header">
                            <div>ID</div>
                            <div>Data Criação</div>
                            <div>Importador</div>
                            <div>Consignatário</div>
                            <div>Notificado</div>
                            <div>País Origem</div>
                            <div>Fronteira</div>
                            <div>Local Embarque</div>
                            <div>Local Destino</div>
                            <div>Termos Pagamento</div>
                            <div>Dados Bancários</div>
                            <div>Incoterm</div>
                            <div>Invoice</div>
                            <div>Tipo Transporte</div>
                            <div>Peso Líquido Total</div>
                            <div>Peso Bruto Total</div>
                            <div>Idioma</div>
                        </li>

                        <>
                            {filteredPackinglist && filteredPackinglist.length > 0 ? (
                                filteredPackinglist.map((p) => {
                                    let dadosSeparados = [];
                                    if (p.dadosBancarios != null) {
                                        dadosSeparados = p.dadosBancarios.split('$');
                                    }

                                    return (
                                        <li key={p.idPackinglist} onContextMenu={(event) => handleRightClick(event, p.idPackinglist)} className='li-listagem'>
                                            <div>{p.idPackinglist}</div>
                                            <div>{formatarData(p.dtCriacao)}</div>
                                            <div>{clientes[p.idImportador] || p.idImportador}</div>
                                            <div>{clientes[p.idConsignatario] || p.idConsignatario}</div>
                                            <div>{clientes[p.idNotificado] || p.idNotificado}</div>
                                            <div>{p.paisOrigem}</div>
                                            <div>{p.fronteira}</div>
                                            <div>{p.localEmbarque}</div>
                                            <div>{p.localDestino}</div>
                                            <div>{p.termosPagamento}</div>

                                            {p.dadosBancarios != null ? (
                                                <div>
                                                    {dadosSeparados[0] + '\n'
                                                        + 'Agência: ' + dadosSeparados[1] + '\n'
                                                        + 'Conta: ' + dadosSeparados[2] + '\n'
                                                        + 'Swift: ' + dadosSeparados[3] + '\n'
                                                        + 'Iban: ' + dadosSeparados[4] + '\n'}
                                                </div>

                                            ) : (
                                                <div></div>
                                            )}

                                            <div>{p.incoterm}</div>
                                            <div>{p.invoice}</div>
                                            <div>{p.tipoTransporte}</div>
                                            <div>{p.pesoLiquidoTotal}</div>
                                            <div>{p.pesoBrutoTotal}</div>
                                            <div>{p.idioma}</div>
                                        </li>
                                    );
                                })
                            ) : (
                                <div id="nao-existe-packinglist">
                                    <li>Não há nada para exibir, adicione uma PackingList...</li>
                                </div>
                            )}
                        </>

                    </ul>
                </div>
                {contextMenu.visible && (

                    <div className='context-menu' style={{
                        top: `${contextMenu.y}px`, left: `${contextMenu.x}px`
                    }}>
                        <div id='container-icon-menu' onClick={handleEdit}>
                            <Icon icon="mdi:edit" id='icone-menu' />
                            <p>Editar</p>
                        </div>
                        <div id='container-icon-menu' onClick={handleList}>
                            <Icon icon="ci:list-add" id='icone-menu' />
                            <p>Listar Produto</p>
                        </div>
                        <div id='container-icon-menu' onClick={gerarQrCode}>
                            <Icon icon="vaadin:qrcode" id='icone-menu' />
                            <p>Gerar QR Code</p>
                        </div>
                        <div id='container-icon-menu' onClick={handleGerarPdf}>
                            <Icon icon="tdesign:file-pdf" id='icone-menu' />
                            <p>Gerar PDF</p>
                        </div>
                        <div id='container-icon-menu-excluir' onClick={handleDelete} >
                            <Icon icon="material-symbols:delete-outline" id='icone-menu' />
                            <p>Excluir</p>
                        </div>
                    </div>
                )}

                {contextDelete.visible && (
                    <>
                        <div className='overlay'></div>
                        <div className='context-delete'>
                            <div>
                                <Text
                                    text={'Tem certeza que deseja excluir o Packing List?'}
                                    fontSize={20}
                                />
                            </div>

                            <div className='buttons-delete'>
                                <Button
                                    className={'button-cancelar'}
                                    text={'Cancelar'}
                                    fontSize={20}
                                    onClick={(e) => { setContextDelete({ visible: false }); }}
                                />
                                <Button
                                    className={'button-excluir'}
                                    text={'Excluir'}
                                    fontSize={20}
                                    onClick={handleDeleteConfirm}
                                />
                            </div>
                        </div>
                    </>
                )}


                {contextDeleteSegundoFator.visible && (

                    <div>
                        <>
                            <div className="overlay"></div>
                            <div className="context-delete-segundo-fator">
                                <form onSubmit={handleDeleteConfirmSegundoFator}>
                                    <div>
                                        <div id="container-text-confirmar-exclusao-produto">
                                            <Text
                                                text={'Esta packinglist possui produtos, para confirmar a exclusão da packinglist digite a palavra "Excluir" no campo abaixo:'}
                                                fontSize={18}
                                            />
                                        </div>
                                        <div id="container-input-confirmar-exclusao-produto">
                                            <Input
                                                className="input-confirmar-exclusao-produto"
                                                type={'text'}
                                                placeholder={'Digite: Excluir'}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="buttons-delete-segundo-fator">
                                        <Button
                                            className={'button-cancelar'}
                                            text={'Cancelar'}
                                            fontSize={20}
                                            onClick={() => { setContextDeleteSegundoFator({ visible: false }); }}
                                        />
                                        <Button
                                            className={'button-excluir'}
                                            text={'Confirmar'}
                                            fontSize={20}
                                            type={"submit"}
                                            onClick={handleDeleteConfirmSegundoFator}
                                        />
                                    </div>
                                </form>

                            </div>
                        </>
                    </div>

                )}

            </div>

            {contextLoading.visible ? (
                <div className="loading">
                    <Loading message={estadoDaPagina === 'Carregando' ? 'Carregando...' : 'Excluindo...'} />
                </div>
            ) : (
                <div></div>
            )}

        </div>
    );
}

export default PackingList;