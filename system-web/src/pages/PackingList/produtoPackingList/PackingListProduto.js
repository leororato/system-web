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
import Autocomplete from "../../../components/Autocomplete/Autocomplete";

function PackingListProduto() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [packingList, setPackingList] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [filteredProdutos, setFilteredProdutos] = useState([]);
    
    const [produtoNomus, setProdutoNomus] = useState([]);

    const [buscaIdProduto, setBuscaIdProduto] = useState('');
    const [buscaDescricaoProduto, setBuscaDescricaoProduto] = useState('');
    const [buscaOrdemDeProducao, setBuscaOrdemDeProducao] = useState('');
    
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedId: null });
    const [contextDelete, setContextDelete] = useState({ visible: false, x: 0, y: 0, selectedId: null });
    const [botaoAdicionar, setBotaoAdicionar] = useState({ visible: true });
    const [contextAdicionar, setContextAdicionar] = useState({ visible: false });
    
    const [formDataProduto, setFormDataProduto] = useState({
        idPackingList: id,
        idProduto: '',
        codigoMaquina: '',
        nomeMaquina: '',
        codigoOrdem: ''
    });

    useEffect(() => {
        console.log('Produtos carregados:', produtos);
        console.log('PackingList carregada:', packingList);
        console.log('Filtered Produtos:', filteredProdutos);
    }, [produtos, packingList, filteredProdutos]);
    

    useEffect(() => {
        const fetchPackingList = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/packinglist/${id}`);
                console.log('PackingList carregada:', response.data);
                setPackingList(response.data);
            } catch (error) {
                console.error('Erro ao carregar a packing list:', error);
            }
        };
    
        const fetchProdutos = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/pl-produto/packinglist/${id}`);
                console.log('Produtos carregados:', response.data);
                setProdutos(response.data);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        };
    
        fetchPackingList();
        fetchProdutos();
    }, [id]);
    
    
    
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

    // const validateForm = () => {
    //     for (const key in formDataProduto) {
    //         if (formDataProduto[key] === "") {
    //             alert(`Por favor, preencha o campo: ${key}`);
    //             return false;
    //         }
    //     }
    //     return true;
    // };

    const handleClickOutside = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null
        });
    };

    const handleRightClick = (e, idProduto) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedId: idProduto
        });
    };

    const handleEdit = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedId: null
        });
        navigate(`/editar-sub-volume/${contextMenu.selectedId}`);
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
            selectedId: contextMenu.selectedId
        });
    };

    const handleDeleteConfirm = () => {
        axios.delete(`http://localhost:8080/api/sub-volume/${contextDelete.selectedId}`)
            .then(() => {
                navigate(`/packing-list-produto/${id}`);
                setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
            })
            .catch((error) => {
                console.error('Erro ao excluir:', error);
            });
    };

    const handleAddProduto = () => {
        setContextAdicionar({ visible: true });
        setBotaoAdicionar({ visible: false });
    };

    const handleSalvarProduto = (e) => {
        e.preventDefault();

        // if (!validateForm()) {
        //     return;
        // }
    
        const payload = {
            id: {
                idPackinglist: parseInt(formDataProduto.idPackingList, 10), 
                idProduto: parseInt(formDataProduto.idProduto, 10) 
            },
            produto: formDataProduto.codigoMaquina, 
            descricaoProduto: formDataProduto.nomeMaquina, 
            ordemProducao: formDataProduto.codigoOrdem 
        };
    
        console.log('Payload:', payload);
    
        axios.post('http://localhost:8080/api/pl-produto', payload)
            .then(response => {
                alert('Produto adicionado com sucesso!');
                setContextAdicionar({ visible: false });
                navigate(0);
            })
            .catch(error => {
                alert('Erro ao salvar produto!');
                console.error('Erro ao adicionar o produto:', error);
            });
    };
    
    const handleCancelarAddProduto = () => {
        setContextAdicionar({ visible: false });
        setBotaoAdicionar({ visible: true });
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/api/ordens/details`)
            .then(response => setProdutoNomus(response.data))
            .catch(error => console.error('Erro ao buscar todos os produtos Nomus: ', error));
    }, []);

    const handleAutocompleteChange = (item) => {
        setFormDataProduto(prevData => ({
            ...prevData,
            idProduto: item.idProduto,
            codigoMaquina: item.codigoMaquina,
            nomeMaquina: item.nomeMaquina,
            codigoOrdem: item.codigoOrdem
        }));
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
                    />
                </div>
                <div>
                    <Input
                        type={'text'}
                        placeholder={'Descrição do Produto'}
                        value={buscaDescricaoProduto}
                        onChange={(e) => setBuscaDescricaoProduto(e.target.value)}
                    />
                </div>
                <div>
                    <Input
                        type={'text'}
                        placeholder={'Ordem de Produção'}
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
                                fontSize={15}
                                borderRadius={5}
                                onClick={handleAddProduto}
                            />
                        </div>
                    )}

                    {contextAdicionar.visible && (
                        <div className="container-adicionar-produtos">
                            <Title
                                classname={'title-adicionar-produtos'}
                                text={'Adicionar um novo produto ao PackingList:'}
                            />
                            <div className="container-autocomplete">
                                <div id="div-desc-prod">
                                    <Text
                                        text={'Pesquisar por Produto ou Ordem:'}
                                    />
                                    <Autocomplete
                                    id="input-autocomplete-adicionar-prod" 
                                    data={produtoNomus}
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
                    </li>
                        {filteredProdutos.length > 0 ? (
                            filteredProdutos.map((p) => (
                                <li key={`${p.id.idProduto}-${p.id.seq}`} onContextMenu={(e) => handleRightClick(e, p.idProduto)}>
                                    <div>{packingList.idPackingList}</div>
                                    <div>{p.id.idProduto}</div>
                                    <div>{p.id.seq}</div>
                                    <div>{p.descricaoProduto}</div>
                                    <div>{p.ordemProducao}</div>
                                </li>
                            ))
                        ) : (
                            <li>Nenhum produto encontrado</li>
                        )}
                    </ul>
                    </div>
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




























// import { useEffect, useState } from "react";
// import Header from "../../../components/Header/Header";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { format } from "date-fns";
// import './PackingListProduto.css';
// import Input from "../../../components/Input";
// import Button from "../../../components/Button";
// import Text from "../../../components/Text";
// import Title from "../../../components/Title";
// import Autocomplete from "../../../components/Autocomplete/Autocomplete";

// function PackingListProduto() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [packingList, setPackingList] = useState([]);
//     const [produtos, setProdutos] = useState([]);
//     const [filteredProdutos, setFilteredProdutos] = useState([]);
    
//     const [produtoNomus, setProdutoNomus] = useState([]);

//     const [buscaIdProduto, setBuscaIdProduto] = useState('');
//     const [buscaDescricaoProduto, setBuscaDescricaoProduto] = useState('');
//     const [buscaOrdemDeProducao, setBuscaOrdemDeProducao] = useState('');
    
//     const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedId: null });
//     const [contextDelete, setContextDelete] = useState({ visible: false, x: 0, y: 0, selectedId: null });
//     const [botaoAdicionar, setBotaoAdicionar] = useState({ visible: true });
//     const [contextAdicionar, setContextAdicionar] = useState({ visible: false });
    
//     const [formDataProduto, setFormDataProduto] = useState({
//         idPackingList: id,
//         idProduto: '',
//         codigoMaquina: '',
//         nomeMaquina: '',
//         codigoOrdem: ''
//     });

//     useEffect(() => {
//         const fetchPackingList = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8080/api/packinglist/${id}`);
//                 setPackingList(response.data);
//             } catch (error) {
//                 console.error('Erro ao renderizar a lista:', error);
//             }
//         };

//         const fetchProdutos = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8080/api/pl-produto`);
//                 setProdutos(response.data);
//                 setFilteredProdutos(response.data);
//             } catch (error) {
//                 console.error('Erro ao renderizar o produto:', error);
//             }
//         }

//         fetchPackingList();
//         fetchProdutos();
//     }, [id]);



//     useEffect(() => {
//         const filterProdutos = produtos.filter(p =>
//             (p.idProduto?.toString() || '').includes(buscaIdProduto) &&
//             (p.descricaoProduto ? p.descricaoProduto.toLowerCase() : '').includes(buscaDescricaoProduto.toLowerCase()) &&
//             (p.ordemProducao?.toString() || '').includes(buscaOrdemDeProducao)
//         );
//         setFilteredProdutos(filterProdutos);
//     }, [buscaIdProduto, buscaDescricaoProduto, buscaOrdemDeProducao, produtos]);

//     const formatarData = (dtCriacao) => {
//         if (!dtCriacao) return 'Data inválida';
//         return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
//     };



//     useEffect(() => {
//         document.addEventListener('click', handleClickOutside);
//         return () => {
//             document.removeEventListener('click', handleClickOutside);
//         };
//     }, []);



//     const validateForm = () => {
//         for (const key in formDataProduto) {
//             if (formDataProduto[key] === "") {
//                 alert(`Por favor, preencha o campo: ${key}`);
//                 return false;
//             }
//         }
//         return true;
//     };



//     const handleClickOutside = () => {
//         setContextMenu({
//             visible: false,
//             x: 0,
//             y: 0,
//             selectedId: null
//         });
//     };



//     const handleRightClick = (e, idProduto) => {
//         e.preventDefault();
//         setContextMenu({
//             visible: true,
//             x: e.pageX,
//             y: e.pageY,
//             selectedId: idProduto
//         });
//     };



//     const handleEdit = () => {
//         setContextMenu({
//             visible: false,
//             x: 0,
//             y: 0,
//             selectedId: null
//         });
//         navigate(`/editar-sub-volume/${contextMenu.selectedId}`);
//     };



//     const handleDelete = (e) => {
//         setContextMenu({
//             visible: false,
//             x: 0,
//             y: 0,
//             selectedId: null
//         });
//         setContextDelete({
//             visible: true,
//             x: e.pageX,
//             y: e.pageY,
//             selectedId: contextMenu.selectedId
//         });
//     };



//     const handleDeleteConfirm = () => {
//         axios.delete(`http://localhost:8080/api/sub-volume/${contextDelete.selectedId}`)
//             .then(() => {
//                 navigate(`/packing-list-produto/${id}`);
//                 setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
//             })
//             .catch((error) => {
//                 console.error('Erro ao excluir:', error);
//             });
//     };



//     const handleAddProduto = () => {
//         setContextAdicionar({ visible: true });
//         setBotaoAdicionar({ visible: false });
//     };



//     const handleSalvarProduto = (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }
    
//         const payload = {
//             id: {
//                 idPackinglist: parseInt(formDataProduto.idPackingList, 10), // Converte para número inteiro
//                 idProduto: parseInt(formDataProduto.idProduto, 10) // Converte para número inteiro
//             },
//             produto: formDataProduto.codigoMaquina, // Ajuste conforme o esperado
//             descricaoProduto: formDataProduto.nomeMaquina, // Ajuste conforme o esperado
//             ordemProducao: formDataProduto.codigoOrdem // Ajuste conforme o esperado
//         };
    
//         console.log('Payload:', payload);
    
//         axios.post('http://localhost:8080/api/pl-produto', payload)
//             .then(response => {
//                 alert('Produto criado com sucesso!');
//                 setContextAdicionar({ visible: false });
//             })
//             .catch(error => {
//                 alert('Erro ao salvar produto!');
//                 console.error('Erro ao salvar o produto:', error);
//             });
//     };
    

        

//     const handleCancelarAddProduto = () => {
//         setContextAdicionar({ visible: false });
//         setBotaoAdicionar({ visible: true });
//     };



//     useEffect(() => {
//         axios.get(`http://localhost:8080/api/ordens/details`)
//             .then(response => setProdutoNomus(response.data))
//             .catch(error => console.error('Erro ao buscar todos os produtos Nomus: ', error));
//     }, []);



//     const handleAutocompleteChange = (item) => {
//         setFormDataProduto(prevData => ({
//             ...prevData,
//             idProduto: item.idProduto,
//             codigoMaquina: item.codigoMaquina,
//             nomeMaquina: item.nomeMaquina,
//             codigoOrdem: item.codigoOrdem
//         }));
//     }
    

    
//     return (
//         <div className="container-produto">
//             <div>
//                 <Header />
//             </div>

//             <div style={{ width: '100%' }}>
//                 <div className='container-listagem-prod'>
//                     <ul>
//                         <li className="header">
//                             <div>ID</div>
//                             <div>Data Criação</div>
//                             <div>País Origem</div>
//                             <div>Fronteira</div>
//                             <div>Local Embarque</div>
//                             <div>Local Destino</div>
//                             <div>Termos Pagamento</div>
//                             <div>Dados Bancários</div>
//                             <div>Incoterm</div>
//                             <div>Invoice</div>
//                             <div>Tipo Transporte</div>
//                             <div>Peso Líquido Total</div>
//                             <div>Peso Bruto Total</div>
//                             <div>Idioma</div>
//                         </li>

//                         {packingList && (
//                             <li key={packingList.idPackingList} className='li-listagem'>
//                                 <div>{packingList.idPackingList}</div>
//                                 <div>{formatarData(packingList.dtCriacao)}</div>
//                                 <div>{packingList.paisOrigem}</div>
//                                 <div>{packingList.fronteira}</div>
//                                 <div>{packingList.localEmbarque}</div>
//                                 <div>{packingList.localDestino}</div>
//                                 <div>{packingList.termosPagamento}</div>
//                                 <div>{packingList.dadosBancarios}</div>
//                                 <div>{packingList.incoterm}</div>
//                                 <div>{packingList.invoice}</div>
//                                 <div>{packingList.tipoTransporte}</div>
//                                 <div>{packingList.pesoLiquidoTotal}</div>
//                                 <div>{packingList.pesoBrutoTotal}</div>
//                                 <div>{packingList.idioma}</div>
//                             </li>
//                         )}
//                     </ul>
//                 </div>
//             </div>

//             <div className="container-pesquisar-produto">
//                 <div>
//                     <Input
//                         type={'text'}
//                         placeholder={'ID do Produto'}
//                         value={buscaIdProduto}
//                         onChange={(e) => setBuscaIdProduto(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <Input
//                         type={'text'}
//                         placeholder={'Descrição do Produto'}
//                         value={buscaDescricaoProduto}
//                         onChange={(e) => setBuscaDescricaoProduto(e.target.value)}
//                     />
//                 </div>
//                 <div>
//                     <Input
//                         type={'text'}
//                         placeholder={'Ordem de Produção'}
//                         value={buscaOrdemDeProducao}
//                         onChange={(e) => setBuscaOrdemDeProducao(e.target.value)}
//                     />
//                 </div>
//             </div>

//             <div className="produto-container-prod">
//                 <div className="lista-produto">
//                     {botaoAdicionar.visible && (
//                         <div className="container-button-adicionar-produto">
//                             <Button
//                                 className={'button-adicionar-produto'}
//                                 text={'Adicionar Produto'}
//                                 padding={10}
//                                 fontSize={15}
//                                 borderRadius={5}
//                                 onClick={handleAddProduto}
//                             />
//                         </div>
//                     )}

//                     {contextAdicionar.visible && (
//                         <div className="container-adicionar-produtos">
//                             <Title
//                                 classname={'title-adicionar-produtos'}
//                                 text={'Criar um novo Produto'}
//                             />
//                             <div className="container-adicionar-produtos-inputs">
//                                 <div id="div-desc-prod">
//                                     <Text
//                                         text={'Pesquisa alguma informação do Produto:'}
//                                     />
//                                     <Autocomplete 
//                                     data={produtoNomus}
//                                     onSelect={(item) => handleAutocompleteChange(item)} 
//                                     displayField={'itensConcatenados'}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="buttons-adicionar-produtos">
//                                 <Button
//                                     className={'button-salvar-add-prod'}
//                                     text={'SALVAR'}
//                                     fontSize={15}
//                                     borderRadius={5}
//                                     padding={10}
//                                     onClick={handleSalvarProduto}
//                                 />

//                                 <Button
//                                     className={'button-cancelar-add-prod'}
//                                     text={'CANCELAR'}
//                                     fontSize={15}
//                                     borderRadius={5}
//                                     padding={10}
//                                     onClick={handleCancelarAddProduto}
//                                 />
//                             </div>
//                         </div>
//                     )}

//                     <ul>
//                         <li id="header-lista-prod">
//                             <div>Id PackingList</div>
//                             <div>Id do Produto</div>
//                             <div>Seq</div>
//                             <div>Descrição</div>
//                             <div>Ordem de Produção</div>
//                         </li>
//                         {filteredProdutos.length > 0 ? (
//                             filteredProdutos.map((p) => (
//                                 <li key={`${p.id.idProduto}-${p.id.seq}`} onContextMenu={(e) => handleRightClick(e, p.idProduto)}>
//                                 <div>{packingList.idPackingList}</div>
//                                 <div>{p.id.idProduto}</div>
//                                 <div>{p.id.seq}</div>
//                                 <div>{p.descricaoProduto}</div>
//                                 <div>{p.ordemProducao}</div>
//                             </li>
//                             ))
//                         ) : (
//                             <li>Nenhum produto encontrado</li>
//                         )}
//                     </ul>
//                 </div>

//                 {contextMenu.visible && (
//                     <div className="context-menu" style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}>
//                         <button onClick={handleEdit}>Editar</button>
//                         <button onClick={handleDelete}>Excluir</button>
//                     </div>
//                 )}

//                 {contextDelete.visible && (
//                     <>
//                         <div className="overlay"></div>
//                         <div className="context-delete">
//                             <div>
//                                 <Text
//                                     text={'Tem certeza que deseja excluir o Produto?'}
//                                     fontSize={20}
//                                 />
//                             </div>

//                             <div className="buttons-delete">
//                                 <Button
//                                     className={'button-cancelar'}
//                                     text={'CANCELAR'}
//                                     fontSize={20}
//                                     onClick={() => { setContextDelete({ visible: false }); }}
//                                 />
//                                 <Button
//                                     className={'button-excluir'}
//                                     text={'EXCLUIR'}
//                                     fontSize={20}
//                                     onClick={handleDeleteConfirm}
//                                 />
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default PackingListProduto;


