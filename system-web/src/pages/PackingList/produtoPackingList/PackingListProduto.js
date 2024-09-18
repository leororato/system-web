
import { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import { BrowserRouter, unstable_HistoryRouter, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import './PackingListProduto.css';
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Text from "../../../components/Text";
import Title from "../../../components/Title";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import { Icon } from "@iconify/react/dist/iconify.js";
import Cookies from 'js-cookie';
import api from '../../../axiosConfig';


function PackingListProduto() {

    // Obtenha o token JWT do cookie
    const token = Cookies.get('jwt');

    // Configure o header da requisição
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const { id } = useParams();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null);
    const [sucessMessage, setSucessMessage] = useState(null);
    const [atualizadorDeEstados, setAtualizadorDeEstados] = useState(0);

    const [packingList, setPackingList] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [filteredProdutos, setFilteredProdutos] = useState([]);

    const [produtoNomus, setProdutoNomus] = useState([]);

    const [buscaIdProduto, setBuscaIdProduto] = useState('');
    const [buscaDescricaoProduto, setBuscaDescricaoProduto] = useState('');
    const [buscaOrdemDeProducao, setBuscaOrdemDeProducao] = useState('');

    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedId: null, selectedSeq: null });
    const [contextDelete, setContextDelete] = useState({ visible: false, x: 0, y: 0, selectedId: null, selectedSeq: null });
    const [botaoAdicionar, setBotaoAdicionar] = useState({ visible: true });
    const [contextAdicionar, setContextAdicionar] = useState({ visible: false });

    const [formDataProduto, setFormDataProduto] = useState({
        idPackinglist: id,
        idProduto: '',
        codigoMaquina: '',
        nomeMaquina: '',
        codigoOrdem: ''
    });





    const fetchPackingList = async () => {
        try {

            const response = await api.get(`/packinglist/${id}`, config);
            setPackingList(response.data);

        } catch (error) {

            const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar Packing List";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);

        }
    };

    useEffect(() => {
        fetchPackingList();
    }, []);

    const fetchProdutos = async () => {
        try {

            const response = await api.get(`/pl-produto/packinglist/${id}`, config);
            setProdutos(response.data);

        } catch (error) {

            const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar produtos";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);


    useEffect(() => {
        const filterProdutos = produtos.filter(p =>
            (p.idProduto?.toString() || '').includes(buscaIdProduto) &&
            (p.descricaoProduto ? p.descricaoProduto.toLowerCase() : '').includes(buscaDescricaoProduto.toLowerCase()) &&
            (p.ordemProducao?.toString() || '').includes(buscaOrdemDeProducao)
        );
        setFilteredProdutos(filterProdutos);
    }, [buscaIdProduto, buscaDescricaoProduto, buscaOrdemDeProducao, produtos]);



    const formatarData = (dtCriacao) => {
        if (!dtCriacao) return 'Data inválida';
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };



    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);



    useEffect(() => {
        api.get(`/ordens/details`, config)
            .then(response =>

                setProdutoNomus(response.data))

            .catch((error) => {

                const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar ordens";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000);
            })

    }, []);



    const handleClickOutside = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null
        });
    };



    const handleRightClick = (e, idProduto, seq) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: idProduto,
            selectedSeq: seq
        });
    };



    const handleEdit = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null
        });
        navigate(`/volumes/${packingList.idPackinglist}/${contextMenu.selectedId}/${contextMenu.selectedSeq}`);
    };




    const handleDelete = (e) => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null
        });
        setContextDelete({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: contextMenu.selectedId,
            selectedSeq: contextMenu.selectedSeq
        });
    };



    const handleDeleteConfirm = () => {

        api.delete(`/volume-produto/${packingList.idPackinglist}/${contextDelete.selectedId}/${contextDelete.selectedSeq}`, config)
            .then(() => {

                api.delete(`/pl-produto/${packingList.idPackinglist}/${contextDelete.selectedId}/${contextDelete.selectedSeq}`, config)
                    .then(() => {

                        setSucessMessage(`Produto ${contextDelete.selectedId} excluído com sucesso!`);
                        setTimeout(() => {
                            setSucessMessage(null)
                        }, 5000);

                        setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });

                        fetchProdutos();
                        fetchPackingList();
                    })
                    .catch((error) => {

                        const errorMessage = error.response?.data?.message || "Erro desconhecido ao excluir Produto";
                        setErrorMessage(errorMessage);

                        setTimeout(() => {
                            setErrorMessage(null);
                        }, 5000);

                    })

            })
            .catch((error) => {

                setErrorMessage('Erro ao excluir o Produto (ERRO NA EXCLUSÃO DO VOLUME PRODUTO)')

            });
    };



    const handleAddProduto = () => {
        setContextAdicionar({ visible: true });
        setBotaoAdicionar({ visible: false });
    };



    const handleSalvarProduto = (e) => {
        e.preventDefault();

        const payload = {
            id: {
                idPackinglist: parseInt(formDataProduto.idPackinglist, 10),
                idProduto: parseInt(formDataProduto.idProduto, 10)
            },
            produto: formDataProduto.codigoMaquina,
            descricaoProduto: formDataProduto.nomeMaquina,
            ordemProducao: formDataProduto.codigoOrdem,
            totalPesoLiquido: '0',
            totalPesoBruto: '0'
        };

        api.post('/pl-produto', payload, config)
            .then(response => {

                if (response.status === 201) {


                    setSucessMessage('Produto adicionado com sucesso!');

                    setTimeout(() => {
                        setSucessMessage(null);
                    }, 5000);

                    setContextAdicionar({ visible: false });
                    setBotaoAdicionar({ visible: true });

                    fetchProdutos();
                }

            })
            .catch(error => {
                const errorMessage = error.response?.data?.message || "Erro desconhecido ao adicionar Produto";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            });
    };


    const handleSucessClose = () => {
        setSucessMessage(null);
    }

    const handleErrorClose = () => {
        setErrorMessage(null);
    }



    const handleCancelarAddProduto = () => {
        setContextAdicionar({ visible: false });
        setBotaoAdicionar({ visible: true });
    };



    const handleAutocompleteChange = (item) => {
        setFormDataProduto(prevData => ({
            ...prevData,
            idProduto: item.idProduto,
            codigoMaquina: item.codigoMaquina,
            nomeMaquina: item.nomeMaquina,
            codigoOrdem: item.codigoOrdem
        }));
    }


    const handleGerarQRCodesProduto = () => {
        // Redireciona para a página de exibir QR codes para todos os volumes do produto
        navigate(`/exibir-qrcodes/${id}/${contextMenu.selectedId}/${contextMenu.selectedSeq}`);
    };



    return (
        <div className="container-produto">
            <div>
                <Header />
                <ErrorNotification message={errorMessage} onClose={handleErrorClose} />
                <SucessNotification message={sucessMessage} onClose={handleSucessClose} />
            </div>

            <div className='container-listagem-prod'>
                <div className="sub-container-listagem-prod">
                    <ul>
                        <li className="header">
                            <div>ID</div>
                            <div>Data Criação</div>
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

                        {packingList && (
                            <li key={packingList.idPackinglist} className='li-listagem-produto'>
                                <div>{packingList.idPackinglist}</div>
                                <div>{formatarData(packingList.dtCriacao)}</div>
                                <div>{packingList.paisOrigem}</div>
                                <div>{packingList.fronteira}</div>
                                <div>{packingList.localEmbarque}</div>
                                <div>{packingList.localDestino}</div>
                                <div>{packingList.termosPagamento}</div>
                                <div>{packingList.dadosBancarios}</div>
                                <div>{packingList.incoterm}</div>
                                <div>{packingList.invoice}</div>
                                <div>{packingList.tipoTransporte}</div>
                                <div>{packingList.pesoLiquidoTotal}</div>
                                <div>{packingList.pesoBrutoTotal}</div>
                                <div>{packingList.idioma}</div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="container-pesquisar-produto">
                <div>
                    <Input
                        type={'text'}
                        placeholder={'ID do Produto'}
                        title={'Pesquise pelo ID do produto...'}
                        value={buscaIdProduto}
                        onChange={(e) => setBuscaIdProduto(e.target.value)}
                    />
                </div>
                <div>
                    <Input
                        type={'text'}
                        placeholder={'Descrição do Produto'}
                        title={'Pesquise pela descrição do produto...'}
                        value={buscaDescricaoProduto}
                        onChange={(e) => setBuscaDescricaoProduto(e.target.value)}
                    />
                </div>
                <div>
                    <Input
                        type={'text'}
                        placeholder={'Ordem de Produção'}
                        title={'Pesquise pela ordem de produção do produto...'}
                        value={buscaOrdemDeProducao}
                        onChange={(e) => setBuscaOrdemDeProducao(e.target.value)}
                    />
                </div>
            </div>

            <div className="produto-container-prod">
                <div className="lista-produto">
                    {botaoAdicionar.visible && (
                        <div className="container-button-adicionar-produto">
                            <Button
                                className={'button-adicionar-produto'}
                                text={'Adicionar Produto'}
                                padding={10}
                                fontSize={12}
                                borderRadius={5}
                                onClick={handleAddProduto}
                            />
                        </div>
                    )}

                    {contextAdicionar.visible && (
                        <div className="container-adicionar-produtos">
                            <Title
                                classname={'title-adicionar-produtos'}
                                text={'Adicionar um novo produto ao Packinglist:'}
                                color={'#1780e2'}
                            />
                            <div className="container-autocomplete">
                                <div id="div-desc-prod">
                                    <Text
                                        text={'Pesquisar por Produto ou Ordem:'}
                                    />
                                    <Autocomplete
                                        id="input-autocomplete-adicionar-prod"
                                        data={produtoNomus}
                                        title={'Pesquise pelo nome do produto ou pela OS...'}
                                        onSelect={(item) => handleAutocompleteChange(item)}
                                        displayField={'itensConcatenados'}
                                    />
                                </div>
                            </div>

                            <div className="buttons-adicionar-produtos">
                                <Button
                                    className={'button-salvar-add-prod'}
                                    text={'SALVAR'}
                                    fontSize={15}
                                    borderRadius={5}
                                    padding={10}
                                    onClick={handleSalvarProduto}
                                />

                                <Button
                                    className={'button-cancelar-add-prod'}
                                    text={'CANCELAR'}
                                    fontSize={15}
                                    borderRadius={5}
                                    padding={10}
                                    onClick={handleCancelarAddProduto}
                                />
                            </div>
                        </div>
                    )}
                    <div className="ul-lista-produtos">
                        <ul>
                            <li id="header-lista-prod">
                                <div>Id PackingList</div>
                                <div>Id do Produto</div>
                                <div>Seq</div>
                                <div>Descrição</div>
                                <div>Ordem de Produção</div>
                                <div>Total Peso Líquido</div>
                                <div>Total Peso Bruto</div>
                            </li>
                            {filteredProdutos.length > 0 ? (
                                filteredProdutos.map((p) => (
                                    <li key={`${p.id.idProduto}-${p.id.seq}`} onContextMenu={(e) => handleRightClick(e, p.id.idProduto, p.id.seq)} id="lista-prod-1">
                                        <div>{packingList.idPackinglist}</div>
                                        <div>{p.id.idProduto}</div>
                                        <div>{p.id.seq}</div>
                                        <div>{p.descricaoProduto}</div>
                                        <div>{p.ordemProducao}</div>
                                        <div>{p.totalPesoLiquido}</div>
                                        <div>{p.totalPesoBruto}</div>
                                    </li>
                                ))
                            ) : (
                                <li>Nenhum produto encontrado</li>
                            )}
                        </ul>
                    </div>
                </div>

                {contextMenu.visible && (
                    <div className='context-menu' style={{
                        top: `${contextMenu.y}px`, left: `${contextMenu.x}px`
                    }}>
                        <div id='container-icon-menu' onClick={handleEdit}>
                            <Icon icon="mdi:edit" id='icone-menu' />
                            <p>Listar Volumes</p>
                        </div>
                        <div id='container-icon-menu' onClick={handleGerarQRCodesProduto}>
                            <Icon icon="vaadin:qrcode" id='icone-menu' />
                            <p>Gerar QR Code</p>
                        </div>
                        <div id='container-icon-menu-excluir' onClick={handleDelete} >
                            <Icon icon="material-symbols:delete-outline" id='icone-menu' />
                            <p>Excluir</p>
                        </div>
                    </div>


                )}

                {contextDelete.visible && (
                    <>
                        <div className="overlay"></div>
                        <div className="context-delete">
                            <div>
                                <Text
                                    text={'Tem certeza que deseja excluir o Volume?'}
                                    fontSize={20}
                                />
                            </div>

                            <div className="buttons-delete">
                                <Button
                                    className={'button-cancelar'}
                                    text={'CANCELAR'}
                                    fontSize={20}
                                    onClick={() => { setContextDelete({ visible: false }); }}
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
            </div>
        </div>
    );
}

export default PackingListProduto;
