
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import './PackingList.css';
import Title from '../../../components/Title';
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
import ExcluirItemSegundoFator from '../../../components/ExcluirItemSegundoFator/ExcluirItemSegundoFator';
import ExcluirItem from '../../../components/ExcluirItem/ExcluirItem';


function PackingList() {


    const navigate = useNavigate();
    const userId = Cookies.get('userId');
    const location = useLocation();
    const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [estadoDaPagina, setEstadoDaPagina] = useState('Carregando');
    const [contextLoading, setContextLoading] = useState({ visible: false });
    const [packingLists, setPackingLists] = useState([]);

    const [buscaInvoice, setBuscaInvoice] = useState('');
    const [filteredPackinglist, setFilteredPackinglist] = useState([]);
    const [contextFiltro, setContextFiltro] = useState({ visible: false, x: 0, y: 0 })
    const filtroRef = useRef(null);
    const [filtrosDeListagem, setFiltrosDeListagem] = useState({
        dataInicio: null,
        dataFim: null,
        emAndamento: false,
        finalizado: false
    })

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
        fetchListaPackinglist();
    }, []);

    const fetchListaPackinglist = async () => {
        setEstadoDaPagina('Carregando');
        setContextLoading({ visible: true });
        console.log("Enviando filtros: ", filtrosDeListagem);

        try {
            const response = await api.post('/packinglist/listagem-packinglist-inicio', filtrosDeListagem);
            setPackingLists(response.data);
            console.log("Dados recebidos:", response.data);

        } catch (error) {
            console.error("Erro ao buscar packinglists:", error);
            setErrorMessage(error.response?.data || "Erro desconhecido ao buscar as packinglists");
            setTimeout(() => setErrorMessage(null), 5000);

        } finally {
            setContextLoading({ visible: false });
        }
    };
    

    const handleMenuFiltros = () => {
        if (contextFiltro.visible) {
            setContextFiltro({ visible: false });
        } else {
            setContextFiltro({ visible: true });
        }
    }

    useEffect(() => {
        if (contextFiltro.visible) {
            document.addEventListener('mousedown', handleClickOutsideFiltro);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideFiltro);
        }

        return () => document.removeEventListener('mousedown', handleClickOutsideFiltro);
    }, [contextFiltro.visible]);

    const handleClickOutsideFiltro = (event) => {
        if (filtroRef.current && !filtroRef.current.contains(event.target)) {
            setContextFiltro({ visible: false });
        }
    };


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
            await api.put(
                `/packinglist/deletar-packinglist/${itemDeletado}/${permissaoParaExcluir}`,
                { userId }
            );

            setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
            setSucessMessage(`Packinglist ${itemDeletado} deletado com sucesso`);
            setTimeout(() => setSucessMessage(null), 5000);

            await fetchListaPackinglist();

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
            await api.delete(`/packinglist/${itemDeletado}/${permissaoParaExcluir}`);

            setSucessMessage(`Packinglist ${itemDeletado} deletado com sucesso`);
            setTimeout(() => {
                setSucessMessage(null);
            }, 5000);

            setContextDeleteSegundoFator({ visible: false, selectedId: null, x: 0, y: 0 });
            await fetchListaPackinglist();

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
                responseType: 'arraybuffer',  // Definimos o responseType corretamente
            };

            const response = await api.get(`/packinglist/pdf/${contextMenu.selectedId}`, configHeaderPdf);

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `packinglist_${contextMenu.selectedId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();  // Remover o link após o clique
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao gerar o PDF";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);
        }
    };

    useEffect(() => {
        fetchListaPackinglist();
    }, [filtrosDeListagem]);

    const checkboxIsChecked = (name) => {
        setFiltrosDeListagem(prev => ({
            ...prev,
            [name]: !prev[name]
        }));
    };

    const salvarDataFiltro = (e, name) => {
        if (filtrosDeListagem[name]) {
            setFiltrosDeListagem(filtrosDeListagem => ({
                ...filtrosDeListagem,
                [name]: null
            }))

        } else {
            setFiltrosDeListagem(filtrosDeListagem => ({
                ...filtrosDeListagem,
                [name]: e.target.value
            }))
        }
    }


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

                    <div className="botao-filtros-inicio"
                        onClick={handleMenuFiltros} title='Filtros' style={{ position: 'relative' }}>
                        <Button
                            text={"Filtros"}
                            className={'button-filtro'}
                        />
                        <Icon icon="eva:arrow-down-fill" id='icon-arrow-down' />

                        {contextFiltro.visible && (
                            <div ref={filtroRef} className="filter-container" onClick={(e) => e.stopPropagation()}>
                                <div className="filter-item-data">
                                    <label htmlFor="filter-date">Data Início</label>
                                    <Input
                                        id="filter-date"
                                        type={'date'}
                                        value={filtrosDeListagem.filtroDataInicio || ""}
                                        onChange={(e) => salvarDataFiltro(e, 'dataInicio')}
                                    />
                                </div>
                                <div className="filter-item-data">
                                    <label htmlFor="filter-date">Data Fim</label>
                                    <Input
                                        id="filter-date"
                                        type={'date'}
                                        value={filtrosDeListagem.filtroDataFim || ""}
                                        onChange={(e) => salvarDataFiltro(e, 'dataFim')}
                                    />
                                </div>
                                <div className="filter-item">
                                    <div>
                                        <Input
                                            id="filter-in-progress"
                                            type={'checkbox'}
                                            name={'filtroAndamento'}
                                            value={filtrosDeListagem.filtroAndamento || ""}
                                            onChange={() => checkboxIsChecked('emAndamento')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="filter-in-progress">Em andamento</label>
                                    </div>
                                </div>
                                <div className="filter-item">
                                    <div>
                                        <Input
                                            id="filter-completed"
                                            type={'checkbox'}
                                            value={filtrosDeListagem.filtroFinalizado || ""}
                                            onChange={() => checkboxIsChecked('finalizado')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="filter-completed">Finalizados</label>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                            <div>{p.nomeClienteImportador}</div>
                                            <div>{p.nomeClienteConsignatario}</div>
                                            <div>{p.nomeClienteNotificado}</div>
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
                        <ExcluirItem
                            descricao={'Tem certeza que deseja excluir o Packing List?'}
                            onClickBotaoCancelar={(e) => { setContextDelete({ visible: false }); }}
                            onClickBotaoExcluir={handleDeleteConfirm}
                        />
                    </>
                )}

                {contextDeleteSegundoFator.visible && (
                    <>
                        <ExcluirItemSegundoFator
                            onSubmit={handleDeleteConfirmSegundoFator}
                            descricao={'Esta packinglist possui produtos, para confirmar a exclusão da packinglist digite a palavra "Excluir" no campo abaixo:'}
                            onChange={handleChange}
                            onClickBotaoCancelar={() => { setContextDeleteSegundoFator({ visible: false }); }}
                            onClickBotaoExcluir={handleDeleteConfirmSegundoFator}
                        />
                    </>
                )}

            </div>

            {
                contextLoading.visible ? (
                    <div className="loading">
                        <Loading message={estadoDaPagina === 'Carregando' ? 'Carregando...' : 'Excluindo...'} />
                    </div>
                ) : (
                    <div></div>
                )
            }

        </div >
    );
}

export default PackingList;