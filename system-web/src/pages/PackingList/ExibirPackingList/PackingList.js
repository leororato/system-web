
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../../components/Header/Header';
import './PackingList.css';
import Title from '../../../components/Title';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Input from '../../../components/Input';

function Inicio() {
    const navigate = useNavigate();
    const [packingLists, setPackingLists] = useState([]);
    const [clientes, setClientes] = useState({});
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedId: null });
    const [contextDelete, setContextDelete] = useState({ visible: false, x: 0, y: 0, selectedId: null });
    const [contextVolume, setContextVolume] = useState({ visible: false, x: 0, y: 0 });

    const handleVolume = (e) => {
        setContextVolume({ visible: true, x: e.pageX, y: e.pageY });
    };

    const formatarData = (dtCriacao) => {
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };  

    useEffect(() => {
        const fetchPackingLists = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/packinglist');
                setPackingLists(response.data);
            } catch (error) {
                console.error('Erro ao buscar os Packing lists', error);
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
                console.error('Erro ao buscar os clientes', error);
            }
        };

        fetchPackingLists();
        fetchClientes();
    }, []);

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
        console.log("Editar item com ID: ", contextMenu.selectedId);
        setContextMenu({ visible: false, x: 0, y: 0, selectedId: null });
        navigate(`/editar-packing-list/${contextMenu.selectedId}`);
    };

    const handleDelete = (event) => {
        console.log("Excluir item com ID: ", contextMenu.selectedId);
        setContextMenu({ visible: false, x: 0, y: 0, selectedId: null });
        setContextDelete({ visible: true, x: event.pageX, y: event.pageY, selectedId: contextMenu.selectedId });
    };

    const handleDeleteConfirm = () => {
        axios.delete(`http://localhost:8080/api/packinglist/${contextDelete.selectedId}`)
            .then(() => {
                setPackingLists(packingLists.filter(packingList => packingList.id !== contextDelete.selectedId));
                setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
                alert('Packing List Excluido!');
                navigate(0);
            })
            .catch(error => {
                console.error('Erro ao excluir o Packing List', error);
            });
    };

    const handleList = () => {
        setContextMenu({ visible: false, x: 0, y: 0, selectedId: null });
        navigate(`/packing-list-produto/${contextMenu.selectedId}`);
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <Header />
            <div className='title-container'>
                <Title
                    classname={'title'}
                    text={'Listagem de Packing Lists'}
                    fontSize={30}
                    color={'#1780e2'}
                />
            </div>

            <div className='buttons'>
                <div className='button-container-listagem'>
                    <Button
                        className={'button-item'}
                        text={'Novo Packing List'}
                        padding={10}
                        borderRadius={5}
                        fontSize={15}
                        onClick={() => navigate('/cadastrar-packing-list')}
                    />
                </div>
                <div className='button-container-listagem'>
                    <Button
                        className={'button-item'}
                        text={'Clientes'}
                        padding={10}
                        borderRadius={5}
                        fontSize={15}
                        onClick={() => navigate('/clientes')}
                    />
                </div>
                {/* <div className='button-container-listagem'>
                    <Button
                        className={'button-item'}
                        text={'Tipo de Volume'}
                        padding={10}
                        borderRadius={5}
                        fontSize={15}
                        onClick={handleVolume}
                    />
                </div> */}
            </div>

            <div className='container-listagem'>
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

                        {Array.isArray(packingLists) && packingLists.map((p) => (
                            <li key={p.idPackingList} onContextMenu={(event) => handleRightClick(event, p.idPackingList)} className='li-listagem'>
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
                        ))}
                    </ul>
                </div>
                {contextMenu.visible && (
                    <div className='context-menu' style={{ top:  `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
                        <button onClick={handleEdit}>Editar</button>
                        <button onClick={handleList}>Listar Produto</button>
                        <button onClick={handleDelete}>Excluir</button>
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
                        <div className='context-delete' style={{ height: "300px", width: "400px" }}>
                            <div className='criar-tipo-volume-text'>
                                <Text
                                    text={'Criar Tipo de Volume'}
                                    fontSize={20}
                                />
                            </div>

                            <Input
                                className={"input-tipo-volume"}
                                placeholder={'Digite o tipo de volume...'}
                                padding={7}
                            />

                            <div className='buttons-create'>
                                <Button
                                    className={'button-cancelar'}
                                    text={'CANCELAR'}
                                    fontSize={20}
                                    onClick={(e) => { setContextVolume({ visible: false }); }}
                                />
                                <Button
                                    className={'button-excluir'}
                                    text={'CRIAR'}
                                    fontSize={20}
                                    onClick={handleVolume}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Inicio;