
import { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
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
import Loading from "../../../components/Loading/Loading";


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
    const [estadoDaPagina, setEstadoDaPagina] = useState("Carregando");
    const [contextLoading, setContextLoading] = useState({ visible: false });

    const [packingList, setPackingList] = useState([]);
    const [tipoPackinglist, setTipoPackinglist] = useState("");
    const [dadosSeparados, setDadosSeparados] = useState([])
    const [produtos, setProdutos] = useState([]);
    const [filteredProdutos, setFilteredProdutos] = useState([]);
    const [produtoNomus, setProdutoNomus] = useState([]);

    const [buscaIdProduto, setBuscaIdProduto] = useState('');
    const [buscaDescricaoProduto, setBuscaDescricaoProduto] = useState('');
    const [buscaOrdemDeProducao, setBuscaOrdemDeProducao] = useState('');

    const contextEditarRef = useRef(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedId: null, selectedSeq: null, selectedDesc: null });
    const [contextEditar, setContextEditar] = useState({ visible: false, selectedIdProduto: '', selectedSeq: null });
    const [contextDelete, setContextDelete] = useState({ visible: false, x: 0, y: 0, selectedId: null, selectedSeq: null, selectedDesc: null });
    const [contextDeleteSegundoFator, setContextDeleteSegundoFator] = useState({ visible: false, x: 0, y: 0, selectedId: null, selectedSeq: null });
    const [inputDeleteSegundoFator, setInputDeleteSegundoFator] = useState("");
    const [botaoAdicionar, setBotaoAdicionar] = useState({ visible: true });
    const [contextAdicionar, setContextAdicionar] = useState({ visible: false });

    const [infoProdutoParaExibirNoModoEdicao, setInfoProdutoParaExibirNoModoEdicao] = useState({
        idPackinglist: id,
        seq: "",
        descricaoProduto: "",
        ordemProducao: "",
        totalPesoLiquido: "",
        totalPesoBruto: "",
        comprimento: ""
    });
    const [formDataProduto, setFormDataProduto] = useState({
        idPackinglist: id,
        idProduto: '',
        codigoMaquina: '',
        nomeMaquina: '',
        codigoOrdem: ''
    });


    const fetchPackingList = async () => {
        setEstadoDaPagina("Carregando");
        try {
            const response = await api.get(`/packinglist/${id}`, config);
            setContextLoading({ visible: true });
            setPackingList(response.data);
            setDadosSeparados(response.data.dadosBancarios.split('$'));

            console.log(response.data.tipoTransporte)

            const tipoTransporte = response.data.tipoTransporte
            if (tipoTransporte === "Marítimo" || tipoTransporte === "Terrestre") {
                setTipoPackinglist("maquina");
            } else if (tipoTransporte === "Aéreo") {
                setTipoPackinglist("reposicao");
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar Packing List";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
        }
    };

    useEffect(() => {
        fetchPackingList();
    }, []);

    const fetchProdutos = async () => {
        setEstadoDaPagina("Carregando");
        try {
            const response = await api.get(`/pl-produto/packinglist/${id}`, config);
            setProdutos(response.data);
            setContextLoading({ visible: true });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar produtos";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
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
        fetchProdutoNomus();
    }, []);

    const fetchProdutoNomus = async () => {
        setEstadoDaPagina("Carregando");
        try {
            const response = await api.get(`/ordens/details`, config)
            setProdutoNomus(response.data);
            setContextLoading({ visible: true });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar ordens";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
        }
    }


    const handleClickOutside = (event) => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null,
            selectedSeq: null,
            selectedDesc: null
        });

    };


    const handleRightClick = (e, idProduto, seq, produto, descricaoProduto, ordemProducao, totalPesoLiquido, totalPesoBruto, comprimento, largura, altura) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: idProduto,
            selectedSeq: seq,
            selectedDesc: descricaoProduto
        });

        setInfoProdutoParaExibirNoModoEdicao({
            idProduto: idProduto,
            seq: seq,
            produto: produto,
            descricaoProduto: descricaoProduto,
            ordemProducao: ordemProducao,
            totalPesoLiquido: totalPesoLiquido,
            totalPesoBruto: totalPesoBruto,
            comprimento: comprimento,
            largura: largura,
            altura: altura
        })
    };

    const handleEdit = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedIdProduto: null,
            selectedSeq: null
        });

        setContextEditar({ visible: true, selectedIdPackinglist: id, selectedIdProduto: contextMenu.selectedId, selectedSeq: contextMenu.selectedSeq });
    }

    const handleListarVolumes = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null,
            selectedSeq: null,
            selectedDesc: null
        });
        navigate(`/volumes/${packingList.idPackinglist}/${contextMenu.selectedId}/${contextMenu.selectedSeq}`);
    };

    const handleChange = (e) => {
        setInputDeleteSegundoFator(e.target.value);
    }

    const handleChangePesoBruto = (e) => {
        setInfoProdutoParaExibirNoModoEdicao({...infoProdutoParaExibirNoModoEdicao, totalPesoBruto: e.target.value });
    }

    const handleChangeDimensao = (e) => {
        const { name, value } = e.target;
        setInfoProdutoParaExibirNoModoEdicao({ ...infoProdutoParaExibirNoModoEdicao, [name]: value });
    }

    const handleAtualizarProduto = async () => {
        setEstadoDaPagina('Salvando');
        setContextLoading({ visible: true });

        const idPackinglist = id;
        const idProduto = infoProdutoParaExibirNoModoEdicao.idProduto;
        const seq = infoProdutoParaExibirNoModoEdicao.seq;

        const payload = {
            produto: infoProdutoParaExibirNoModoEdicao.produto,
            descricaoProduto: infoProdutoParaExibirNoModoEdicao.descricaoProduto,
            ordemProducao: infoProdutoParaExibirNoModoEdicao.ordemProducao,
            totalPesoLiquido: infoProdutoParaExibirNoModoEdicao.totalPesoLiquido,
            totalPesoBruto: infoProdutoParaExibirNoModoEdicao.totalPesoBruto,
            comprimento: infoProdutoParaExibirNoModoEdicao.comprimento,
            largura: infoProdutoParaExibirNoModoEdicao.largura,
            altura: infoProdutoParaExibirNoModoEdicao.altura
        }

        console.log('payload: ', payload)
        console.log('requisiçao: ', idPackinglist, idProduto, seq)
        try {
            await api.put(`/pl-produto/${idPackinglist}/${idProduto}/${seq}`, payload, config);

            setSucessMessage('Volume de reposição atualizado com sucesso!');
            setTimeout(() => setSucessMessage(null), 5000);

            fetchPackingList();
            fetchProdutos();

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao atualizar Volume de Reposição";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);

        } finally {
            setContextLoading({ visible: false })
            setContextEditar({ visible: false, selectedIdProduto: null, selectedSeq: null })
        }
    }

    const handleCancelarEditarProduto = () => {

        setContextEditar({ visible: false, selectedIdVolume: '' });

        setFormDataProduto({
            idPackinglist: id,
            idProduto: '',
            seq: '',
            codigoMaquina: '',
            nomeMaquina: '',
            codigoOrdem: ''
        })
    }

    const handleDelete = (e) => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null,
            selectedSeq: null,
            selectedDesc: null
        });
        setContextDelete({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: contextMenu.selectedId,
            selectedSeq: contextMenu.selectedSeq,
            selectedDesc: contextMenu.selectedDesc
        });

    };

    const handleDeleteSegundoFator = (e) => {
        setContextDelete({ visible: false });

        setContextDeleteSegundoFator({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: contextDelete.selectedId,
            selectedSeq: contextDelete.selectedSeq,
            selectedDesc: contextDelete.selectedDesc
        });
    }

    const handleDeleteConfirm = async (e) => {
        setEstadoDaPagina("Excluindo");
        const permissaoParaExcluir = "semPermissao";

        try {

            await api.delete(`/pl-produto/${packingList.idPackinglist}/${contextDelete.selectedId}/${contextDelete.selectedSeq}/${permissaoParaExcluir}`, config);
            setSucessMessage(`Produto ${contextDelete.selectedDesc} excluído com sucesso!`);
            setTimeout(() => {
                setSucessMessage(null)
            }, 5000);

            setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
            await fetchProdutos();

        } catch (error) {
            console.error('erro:', error.response)
            if (error.response?.status === 409) {
                handleDeleteSegundoFator(e);
                console.log(error.response)
                const errorMessage = error.response?.data || "Erro desconhecido ao excluir Produto";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            } else {
                const errorMessage = error.response?.data?.message || "Erro desconhecido ao excluir Produto";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            }

        } finally {
            setContextLoading({ visible: false });
        }

    };

    const handleDeleteConfirmSegundoFator = async (e) => {
        e.preventDefault();
        setEstadoDaPagina("Excluindo");

        const permissaoParaExcluir = (inputDeleteSegundoFator === "Excluir") ? "comPermissao" : "semPermissao";

        try {
            await api.delete(`/pl-produto/${packingList.idPackinglist}/${contextDeleteSegundoFator.selectedId}/${contextDeleteSegundoFator.selectedSeq}/${permissaoParaExcluir}`, config);

            setSucessMessage(`Produto ${contextDeleteSegundoFator.selectedDesc} excluído com sucesso!`);
            setTimeout(() => {
                setSucessMessage(null)
            }, 5000);

            setContextDeleteSegundoFator({ visible: false, x: 0, y: 0, selectedId: null });

            await fetchProdutos();
            await fetchPackingList();

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao excluir Produto";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

        } finally {
            setContextLoading({ visible: false });

        }

    }


    const handleAddProduto = () => {
        setContextAdicionar({ visible: true });
        setBotaoAdicionar({ visible: false });
    };


    const handleSalvarProduto = async (e) => {
        e.preventDefault();
        setEstadoDaPagina("Salvando");

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

        try {
            await api.post('/pl-produto', payload, config);

            setSucessMessage('Produto adicionado com sucesso!');
            setTimeout(() => {
                setSucessMessage(null);
            }, 5000);

            setContextAdicionar({ visible: false });
            setBotaoAdicionar({ visible: true });
            setContextLoading({ visible: true });

            await fetchProdutos();

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao adicionar Produto";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
        }
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
                                <div>
                                    {dadosSeparados[0] + '\n'
                                        + 'Agência: ' + dadosSeparados[1] + '\n'
                                        + 'Conta: ' + dadosSeparados[2] + '\n'
                                        + 'Swift: ' + dadosSeparados[3] + '\n'
                                        + 'Iban: ' + dadosSeparados[4] + '\n'}
                                </div>
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

            <div className={tipoPackinglist === "maquina" ? "produto-container-prod" : "produto-container-prod-maior"}>
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
                                <div>Produto</div>
                                <div>Descrição</div>
                                <div>Ordem de Produção</div>
                                <div>Total Peso Líquido</div>
                                <div>Total Peso Bruto</div>
                                {tipoPackinglist === "reposicao" && (
                                    <div>Dimensão</div>
                                )}
                            </li>
                            {filteredProdutos.length > 0 ? (
                                filteredProdutos.map((p) => (
                                    <li key={`${p.id.idProduto}-${p.id.seq}`} onContextMenu={(e) => handleRightClick(e, p.id.idProduto, p.id.seq, p.produto, p.descricaoProduto, p.ordemProducao, p.totalPesoLiquido, p.totalPesoBruto, p.comprimento, p.largura, p.altura)} id="lista-prod-1">
                                        <div>{packingList.idPackinglist}</div>
                                        <div>{p.id.idProduto}</div>
                                        <div>{p.id.seq}</div>
                                        <div>{p.produto}</div>
                                        <div>{p.descricaoProduto}</div>
                                        <div>{p.ordemProducao}</div>
                                        <div>{p.totalPesoLiquido}</div>
                                        <div>{p.totalPesoBruto}</div>
                                        {tipoPackinglist === "reposicao" && (
                                            <div>{p.comprimento + ' X ' + p.largura + ' X ' + p.altura}</div>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <div id="nao-existe-produto">
                                    <li>
                                        <Text
                                            text={"Nenhum produto encontrado"}
                                            fontSize={'14px'}
                                        />
                                    </li>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            </div>


            {contextMenu.visible && (
                <div className='context-menu' style={{
                    top: `${contextMenu.y}px`, left: `${contextMenu.x}px`
                }}>
                    {tipoPackinglist === "reposicao" && (
                        <div id='container-icon-menu' onClick={handleEdit}>
                            <Icon icon="mdi:edit" id='icone-menu' />
                            <p>Editar</p>
                        </div>
                    )}
                    <div id='container-icon-menu' onClick={handleListarVolumes}>
                        <Icon icon="ci:list-add" id='icone-menu' />
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


            {contextDeleteSegundoFator.visible && (

                <div>
                    <>
                        <div className="overlay"></div>
                        <div className="context-delete-segundo-fator">
                            <form onSubmit={handleDeleteConfirmSegundoFator}>
                                <div>
                                    <div id="container-text-confirmar-exclusao-produto">
                                        <Text
                                            text={'Este produto possui volumes, para confirmar a exclusão do produto digite a palavra "Excluir" no campo abaixo:'}
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


            {
                contextEditar.visible && (

                    <div className="overlay">
                        <div className="overlay-content" ref={contextEditarRef}>
                            <Title
                                classname={'title-adicionar-volume'}
                                text={'Editar o volume de reposição:'}
                                color={'#1780e2'}
                            />
                            <div className="subcontainer-volume">
                                <div className="container-input-adicionar-volume">
                                    <form>
                                        <div className="input-group-produto">
                                            <div>
                                                <label>Produto:</label>
                                                <Input
                                                    type={'text'}
                                                    placeholder={infoProdutoParaExibirNoModoEdicao.produto}
                                                    title={'Não é possível alterar o código do produto...'}
                                                    value={infoProdutoParaExibirNoModoEdicao.produto}
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label>Descrição:</label>
                                                <Input
                                                    type={'text'}
                                                    placeholder={infoProdutoParaExibirNoModoEdicao.descricaoProduto}
                                                    title={'Não é possível alterar a descrição...'}
                                                    value={infoProdutoParaExibirNoModoEdicao.descricaoProduto}
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label>Ordem de produção:</label>
                                                <Input
                                                    type={'text'}
                                                    placeholder={infoProdutoParaExibirNoModoEdicao.ordemProducao || "Não possui ordem de produção..."}
                                                    title={'Não é possível alterar a ordem de produção...'}
                                                    value={infoProdutoParaExibirNoModoEdicao.descricaoProduto}
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label>Peso líquido total:</label>
                                                <Input
                                                    type={'text'}
                                                    placeholder={infoProdutoParaExibirNoModoEdicao.pesoLiquidoTotal || "Não possui volumes ainda..."}
                                                    title={'Não é possível alterar o peso líquido total...'}
                                                    value={infoProdutoParaExibirNoModoEdicao.totalPesoLiquido}
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <label>Peso bruto total:</label>
                                                <Input
                                                    type={'text'}
                                                    placeholder={infoProdutoParaExibirNoModoEdicao.pesoBrutoTotal || "Não possui volumes ainda..."}
                                                    title={'Não é possível alterar o peso bruto total...'}
                                                    value={infoProdutoParaExibirNoModoEdicao.totalPesoBruto}
                                                    onChange={handleChangePesoBruto}
                                                />
                                            </div>

                                            <div id="container-edit-prod-dims">

                                                <label>Dimensões:</label>

                                                <div id="sub-dimensao-container">
                                                    <div className="container-inputs-dimensao-produto">
                                                        <div>
                                                            <label>Comprimento (cm):</label>
                                                            <Input
                                                                type={'number'}
                                                                title={'Digite o comprimento do volume...'}
                                                                placeholder={infoProdutoParaExibirNoModoEdicao.comprimento || "Ainda não possui..."}
                                                                name={'comprimento'}
                                                                value={infoProdutoParaExibirNoModoEdicao.comprimento}
                                                                onChange={handleChangeDimensao}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>Largura (cm):</label>
                                                            <Input
                                                                type={'number'}
                                                                title={'Digite a largura do volume...'}
                                                                placeholder={infoProdutoParaExibirNoModoEdicao.largura || "Ainda não possui..."}
                                                                name={'largura'}
                                                                value={infoProdutoParaExibirNoModoEdicao.largura}
                                                                onChange={handleChangeDimensao}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>Altura (cm)</label>
                                                            <Input
                                                                type={'number'}
                                                                title={'Digite a altura do volume...'}
                                                                placeholder={infoProdutoParaExibirNoModoEdicao.altura || "Ainda não possui..."}
                                                                name={'altura'}
                                                                value={infoProdutoParaExibirNoModoEdicao.altura}
                                                                onChange={handleChangeDimensao}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>


                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="buttons-adicionar-volume">
                                <Button
                                    className={'button-salvar-add-volume'}
                                    text={'SALVAR'}
                                    fontSize={15}
                                    padding={10}
                                    borderRadius={5}
                                    onClick={handleAtualizarProduto}
                                />
                                <Button
                                    className={'button-cancelar-add-volume'}
                                    text={'CANCELAR'}
                                    fontSize={15}
                                    padding={10}
                                    borderRadius={5}
                                    onClick={handleCancelarEditarProduto}
                                />
                            </div>
                        </div>
                    </div>
                )
            }



            {contextLoading.visible ? (
                <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : estadoDaPagina === "Salvando" ? "Salvando..." : "Excluindo..."} />
            ) : (
                <></>
            )}
        </div>
    );
}

export default PackingListProduto;
