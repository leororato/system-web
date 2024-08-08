import { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import './PackingListProduto.css';
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Text from "../../../components/Text";
import Title from "../../../components/Title";

function PackingListProduto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [packingList, setPackingList] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [filteredProdutos, setFilteredProdutos] = useState([]);

    const [buscaIdProduto, setBuscaIdProduto] = useState('');
    const [buscaDescricaoProduto, setBuscaDescricaoProduto] = useState('');
    const [buscaOrdemDeProducao, setBuscaOrdemDeProducao] = useState('');

    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedId: null });
    const [contextDelete, setContextDelete] = useState({ visible: false, x: 0, y: 0, selectedId: null });
    const [botaoAdicionar, setBotaoAdicionar] = useState({ visible: true });
    const [contextAdicionar, setContextAdicionar] = useState({ visible: false });

    const [formData, setFormData] = useState({
        idPackingList: id,
        descricaoProduto: '',
        ordemProducao: ''
    });


    useEffect(() => {
        const fetchPackingList = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/packinglist/${id}`);
                setPackingList(response.data);
            } catch (error) {
                console.error('Erro ao renderizar a lista:', error);
            }
        };

        const fetchProdutos = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/packinglistproduto/${id}`);
                setProdutos(response.data);
                setFilteredProdutos(response.data);
            } catch (error) {
                console.error('Erro ao renderizar o produto:', error);
            }
        }

        fetchPackingList();
        fetchProdutos();
    }, [id]);

    useEffect(() => {
        const filterProdutos = produtos.filter(p =>
            p.idProduto.toString().includes(buscaIdProduto) &&
            p.descricaoProduto.toLowerCase().includes(buscaDescricaoProduto.toLowerCase()) &&
            p.ordemProducao.toString().includes(buscaOrdemDeProducao)
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        for (const key in formData) {
            if (formData[key] === "") {
                alert(`Por favor, preencha o campo: ${key}`);
                return false;
            }
        }
        return true;
    };

    const handleClickOutside = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null
        })
    }

    const handleRightClick = (e, idProduto) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: idProduto
        })
    }

    const handleEdit = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null
        })
        navigate(`/editar-sub-volume/${contextMenu.selectedId}`)
    }

    const handleDelete = (e) => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null
        })
        setContextDelete({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: contextMenu.selectedId
        })
    }

    const handleDeleteConfirm = () => {
        axios.delete(`http://localhost:8080/api/sub-volume/${contextDelete.selectedId}`)
            .then(() => {
                navigate(`/packing-list-produto/${id}`);
                setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
            })
            .catch((error) => {
                console.error('Erro ao excluir:', error);
            });
    }

    const handleAddProduto = () => {
        setContextAdicionar({ visible: true });
        setBotaoAdicionar({ visible: false })
    }

    const handleSalvarProduto = (e) => {
        e.preventDefault();
        if(!validateForm()){
            return;
        }
        axios.post('http://localhost:8080/api/produto', formData)
            .then(() => {
                setContextAdicionar({ visible: false });
                alert('Produto criado com sucesso!');
            })
            .catch((error) => {
                alert('Erro ao salvar produto!')
                console.error('Erro ao salvar o produto:', error);
            });
    }

    const handleCancelarAddProduto = () => {
        setContextAdicionar({ visible: false });
        setBotaoAdicionar({ visible: true });
    }

    return (
        <div className="container-produto">
            <div>
                <Header />
            </div>

            <div style={{ width: '100%' }}>
                <div className='container-listagem-prod'>
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
                            <li key={packingList.idPackingList} className='li-listagem'>
                                <div>{packingList.idPackingList}</div>
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
                        value={buscaIdProduto}
                        onChange={(e) => setBuscaIdProduto(e.target.value)}
                    /></div>
                <div>
                    <Input
                        type={'text'}
                        placeholder={'Descrição do Produto'}
                        value={buscaDescricaoProduto}
                        onChange={(e) => setBuscaDescricaoProduto(e.target.value)}
                    /></div>
                <div>
                    <Input
                        type={'text'}
                        placeholder={'Ordem de Produção'}
                        value={buscaOrdemDeProducao}
                        onChange={(e) => setBuscaOrdemDeProducao(e.target.value)}
                    /></div>
            </div>

            {/* INICIO DO CONTAINER DO ADICIONAR PRODUTO */}

            <div className="produto-container-prod">
                <div className="lista-produto">
                    {botaoAdicionar.visible && (
                        <div className="container-button-adicionar-produto">

                            <Button
                                className={'button-adicionar-produto'}
                                text={'Adicionar Produto'}
                                padding={10}
                                fontSize={15}
                                borderRadius={5}
                                onClick={handleAddProduto}
                            /></div>
                    )}

                    <>
                        {contextAdicionar.visible && (
                            <div className="container-adicionar-produtos">
                                <Title
                                    classname={'title-adicionar-produtos'}
                                    text={'Criar um novo Produto'}
                                />
                                <div className="container-adicionar-produtos-inputs">
                                    <div id="div-id-prod">
                                        <Text
                                            text={'ID do produto:'}
                                        />
                                        <Input
                                            type={'text'}
                                            title={'Digite o ID do produto...'}
                                            placeholder={'Ex: CF000001'}
                                            name={'idProduto'}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div id="div-desc-prod">
                                        <Text
                                            text={'Descrição do Produto:'}
                                        />
                                        <Input
                                            type={'text'}
                                            title={'Digite a descrição do produto...'}
                                            placeholder={'Ex: Batedor Ind. CF 17000'}
                                            name={'descricaoProduto'}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div id="div-os">
                                        <Text
                                            text={'Ordem de Produção:'}
                                        />
                                        <Input
                                            type={'text'}
                                            title={'Digite a ordem de produção...'}
                                            placeholder={'Ex: OS 515-001-01'}
                                            name={'ordemProducao'}
                                            onChange={handleChange}
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
                    </>
                    {/* FIM DO CONTAINER DO ADICIONAR PRODUTO */}




                    <ul>
                        <li id="header-lista-prod">
                            <div>Id PackingList</div>
                            <div>Id do Produto</div>
                            <div>Seq</div>
                            <div>Descrição</div>
                            <div>Ordem de Produção</div>
                        </li>
                        {filteredProdutos.length > 0 ? (
                            filteredProdutos.map((p) => (
                                <li key={p.idProduto} onContextMenu={(e) => handleRightClick(e, p.idProduto)}>
                                    <div>{packingList.idPackingList}</div>
                                    <div>{p.idProduto}</div>
                                    <div>{p.seq}</div>
                                    <div>{p.descricaoProduto}</div>
                                    <div>{p.ordemProducao}</div>
                                </li>
                            ))
                        ) : (
                            <li>Nenhum produto encontrado</li>
                        )}
                    </ul>
                </div>


                {contextMenu.visible && (
                    <div className="context-menu" style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
                        <button onClick={handleEdit}>Editar</button>
                        <button onClick={handleDelete}>Excluir</button>
                    </div>
                )}

                {contextDelete.visible && (
                    <>
                        <div className="overlay"></div>
                        <div className="context-delete">
                            <div>
                                <Text
                                    text={'Tem certeza que deseja excluir o Produto?'}
                                    fontSize={20}
                                />
                            </div>

                            <div className="buttons-delete">
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


            </div>
        </div>
    );
}

export default PackingListProduto;
