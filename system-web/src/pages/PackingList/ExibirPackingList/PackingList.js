
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import './PackingList.css';
import Title from '../../../components/Title';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Input from '../../../components/Input';
import ErrorNotification from '../../../components/ErrorNotification/ErrorNotification';
import SucessNotification from '../../../components/SucessNotification/SucessNotification';
import { Icon } from '@iconify/react/dist/iconify.js';

function PackingList() {

    const navigate = useNavigate();

    const location = useLocation();
    const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [packingLists, setPackingLists] = useState([]);
    const [atualizarEstadoLista, setAtualizarEstadoLista] = useState(0);

    const [clientes, setClientes] = useState({});

    const [buscaInvoice, setBuscaInvoice] = useState('');
    const [filteredPackinglist, setFilteredPackinglist] = useState([]);

    const [tipoDeVolume, setTipoDeVolume] = useState({
        descricao: ''
    });

    const [contextMenu, setContextMenu] = useState({
        visible: false, x: 0, y: 0, selectedId: null
    });

    const [contextDelete, setContextDelete] = useState({
        visible: false, x: 0, y: 0, selectedId: null
    });

    const [contextVolume, setContextVolume] = useState({
        visible: false, x: 0, y: 0
    });


    useEffect(() => {
        const filterPackinglist = packingLists.filter(p =>
            (p.invoice ? p.invoice.toLowerCase() : '').includes(buscaInvoice.toLowerCase())
        );
        setFilteredPackinglist(filterPackinglist);
    }, [buscaInvoice, packingLists]);


    useEffect(() => {
        const fetchPackingLists = async () => {
            try {

                const response = await axios.get('http://localhost:8080/api/packinglist');
                setPackingLists(response.data);
                console.log(response.data);
            } catch (error) {

                const errorMessage = error.response?.data || "Erro desconhecido ao buscar os PackingLists";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            }
        };



        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/clienteNomus');
                const clientesData = response.data.reduce((acc, cliente) => {
                    acc[cliente.id] = cliente.nome;
                    return acc;
                }, {});
                setClientes(clientesData);

            } catch (error) {

                const errorMessage = error.response?.data || "Erro desconhecido ao buscar clientes";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000)

            }
        };

        fetchPackingLists();
        fetchClientes();
    }, [atualizarEstadoLista]);



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
                // Limpa o estado de navegação para evitar que a mensagem apareça ao recarregar a página
                navigate('/inicio', { replace: true, state: {} });
            }, 5000);

            // Limpar o timeout caso o componente seja desmontado antes dos 5 segundos
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



    const handleDelete = (event) => {
        setContextMenu({ visible: false, x: 0, y: 0, selectedId: null });
        setContextDelete({
            visible: true, x: event.pageX, y: event.pageY, selectedId: contextMenu.selectedId
        });
    };



    const handleDeleteConfirm = () => {
        const itemDeletado = contextDelete.selectedId;


        axios.delete(`http://localhost:8080/api/packinglist/${itemDeletado}`)
            .then(() => {
                setPackingLists(packingLists.filter(packingList =>
                    packingList.id !== contextDelete.selectedId));
                setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
                setSucessMessage(`PackingList ${itemDeletado} deletado com sucesso`);

                setAtualizarEstadoLista(atualizarEstadoLista + 1);
            })
            .catch(error => {

                const errorMessage = error.response?.data || "Erro desconhecido ao excluir PackingList";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000)

            });
    };



    const handleList = () => {
        setContextMenu({ visible: false, x: 0, y: 0, selectedId: null });
        navigate(`/packing-list-produto/${contextMenu.selectedId}`);
    };



    const handleCreateTipoDeVolume = (e) => {
        e.preventDefault();

        axios.post(`http://localhost:8080/api/tipo-de-volume`, tipoDeVolume)
            .then((response) => {

                setSucessMessage(`Tipo de Volume '${response.data.descricao}' criado com sucesso`);

                setTimeout(() => {
                    navigate(0);
                }, 2000);

            })
            .catch(error => {

                const errorMessage = error.response?.data || "Erro desconhecido ao criar o Tipo de Volume";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            });
    }

    const handleErrorClose = () => {
        setErrorMessage(null);
    }

    const handleAutocompleteChange = (item) => {

    };



    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={handleErrorClose} />
            {sucessMessage && <SucessNotification message={sucessMessage} onClose={() => setSucessMessage(null)} />}

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

                        {filteredPackinglist && filteredPackinglist.length > 0 ? (
                            filteredPackinglist.map((p) => (
                                <li key={p.idPackingList} onContextMenu={(event) =>
                                    handleRightClick(event, p.idPackingList)} className='li-listagem'>
                                    <div>{p.idPackingList}</div>
                                    <div>{formatarData(p.dtCriacao)}</div>
                                    <div>{clientes[p.idImportador] || p.idImportador}</div>
                                    <div>{clientes[p.idConsignatario] || p.idConsignatario}</div>
                                    <div>{clientes[p.idNotificado] || p.idNotificado}</div>
                                    <div>{p.paisOrigem}</div>
                                    <div>{p.fronteira}</div>
                                    <div>{p.localEmbarque}</div>
                                    <div>{p.localDestino}</div>
                                    <div>{p.termosPagamento}</div>
                                    <div>{p.dadosBancarios}</div>
                                    <div>{p.incoterm}</div>
                                    <div>{p.invoice}</div>
                                    <div>{p.tipoTransporte}</div>
                                    <div>{p.pesoLiquidoTotal}</div>
                                    <div>{p.pesoBrutoTotal}</div>
                                    <div>{p.idioma}</div>
                                </li>
                            ))

                        ) : (
                            <div id="nao-existe-packinglist">
                                <li>Não há nada para exibir, adicione uma PackingList...</li>
                            </div>
                        )}

                        {/* {packingLists.length > 0 ? (

                            Array.isArray(packingLists) && packingLists.map((p) => (
                                <li key={p.idPackingList} onContextMenu={(event) =>
                                    handleRightClick(event, p.idPackingList)} className='li-listagem'>
                                    <div>{p.idPackingList}</div>
                                    <div>{formatarData(p.dtCriacao)}</div>
                                    <div>{clientes[p.idImportador] || p.idImportador}</div>
                                    <div>{clientes[p.idConsignatario] || p.idConsignatario}</div>
                                    <div>{clientes[p.idNotificado] || p.idNotificado}</div>
                                    <div>{p.paisOrigem}</div>
                                    <div>{p.fronteira}</div>
                                    <div>{p.localEmbarque}</div>
                                    <div>{p.localDestino}</div>
                                    <div>{p.termosPagamento}</div>
                                    <div>{p.dadosBancarios}</div>
                                    <div>{p.incoterm}</div>
                                    <div>{p.invoice}</div>
                                    <div>{p.tipoTransporte}</div>
                                    <div>{p.pesoLiquidoTotal}</div>
                                    <div>{p.pesoBrutoTotal}</div>
                                    <div>{p.idioma}</div>
                                </li>
                            ))

                        ) : (
                            <div id="nao-existe-packinglist">
                                <li>Não há nada para exibir, adicione uma PackingList...</li>
                            </div>
                        )} */}
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
                                    text={'CANCELAR'}
                                    fontSize={20}
                                    onClick={(e) => { setContextDelete({ visible: false }); }}
                                />
                                <Button
                                    className={'button-excluir'}
                                    text={'EXCLUIR'}
                                    fontSize={20}
                                    onClick={handleDeleteConfirm}
                                />
                            </div>
                        </div>
                    </>
                )}

                {contextVolume.visible && (
                    <>
                        <div className='overlay'></div>
                        <div className='context-volume'>
                            <div className='container-text-input'>
                                <div className='container-text-cv'>
                                    <Text
                                        text={'Criar tipo de volume:'}
                                        fontSize={15}
                                    /></div>
                                <div className='container-input-criar-volume'>
                                    <Input
                                        className={"input-tipo-volume"}
                                        placeholder={'Ex: Pallet...'}
                                        padding={7}
                                        title={'Digite o tipo de volume...'}
                                        onChange={(e) => setTipoDeVolume({ descricao: e.target.value })}
                                    /></div>
                            </div>

                            <div className='buttons-create'>
                                <Button
                                    className={'button-cancelar-volume'}
                                    text={'CANCELAR'}
                                    fontSize={15}
                                    onClick={() => setContextVolume({ visible: false })}
                                />
                                <Button
                                    className={'button-criar-volume'}
                                    text={'CRIAR'}
                                    fontSize={15}
                                    onClick={handleCreateTipoDeVolume}
                                />
                            </div>
                        </div>
                    </>
                )}


            </div>
        </div>
    );
}

export default PackingList;