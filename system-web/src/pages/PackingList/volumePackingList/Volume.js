import { useEffect, useState, useRef } from "react";
import Header from "../../../components/Header/Header";
import { useParams } from "react-router-dom";
import './Volume.css';
import axios from "axios";
import Button from "../../../components/Button";
import Title from "../../../components/Title";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import Input from "../../../components/Input";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import Text from "../../../components/Text";
import { format } from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";

function Volume() {

    // ------------------------------------- PRODUTOS ------------------------------------- //

    // CHAVES COMPOSTAS DO PRODUTO SELECIONADO NA PAGINA ANTERIOR
    const { id, idProduto, seq } = useParams();

    // CARREGA OS DADOS DO PRODUTO SELECIONADO NA PAGINA ANTERIOR
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);





    // ------------------------------------- ^PRODUTOS^ ------------------------------------- //              

    // ------------------------------------- VOLUMES ------------------------------------- //

    const [idVolumeSave, setIdVolumeSave] = useState();

    // FAZ A VALIDAÇAO DE QUANDO UM VOLUME É CRIADO PARA ENVIAR O VOLUME PRODUTO
    const [volumeCriado, setVolumeCriado] = useState(false);

    const [contextDelete, setContextDelete] = useState({ visible: false, x: 0, y: 0, selectedIdVolume: '' });

    const [contextMenu, setContextMenu] = useState({ visible: false, selectedIdVolume: '' });

    // CARREGA O VALOR O IDVOLUME QUANDO CLICA EM CIMA DE ALGUM ITEM
    const [salvarIdVolume, setSalvarIdVolume] = useState('');

    // CARREGA A DESCRICAO DO TIPO DE VOLUME DO ITEM QUANDO CLICA EM CIMA
    const [salvarTipoDeVolumeAtual, setSalvarTipoDeVolumeAtual] = useState({ descricao: '' });

    // ATUALIZADOR DO ESTADO DA LISTA DE APRESENTAÇAO DE TODOS OS VOLUMES
    const [atualizarEstadoLista, setAtualizarEstadoLista] = useState(0);

    const [atualizarEstadoListaSubVolumes, setAtualizarEstadoListaSubVolumes] = useState(0);

    // CONTAINER QUE POSSUI TODOS OS VOLUMES
    const [volumes, setVolumes] = useState([]);

    // CONTAINER QUE POSSUI TODOS OS TIPOS DE VOLUMES
    const [tiposDeVolume, setTiposDeVolume] = useState([]);

    // CONTAINER QUE POSSUI TODOS OS TIPOS DE VOLUMES EM ARRAY PARA USAR NO AUTOCOMPLETE
    const [tiposDeVolumeArray, setTiposDeVolumeArray] = useState([]);

    // FORM DATA DO PUT VOLUME
    const [volumeEdicao, setVolumeEdicao] = useState({
        idTipoVolumeId: '',
        quantidadeItens: '',
        descricao: '',
        altura: '',
        largura: '',
        comprimento: '',
        pesoLiquido: '',
        pesoBruto: '',
        observacao: '',
    });

    // FORM DATA DO POST VOLUME
    const [formDataVolume, setFormDataVolume] = useState({
        idTipoVolumeId: '',
        quantidadeItens: '',
        descricao: '',
        altura: '',
        largura: '',
        comprimento: '',
        pesoLiquido: '',
        pesoBruto: '',
        observacao: ''
    });




    // ------------------------------------- ^VOLUMES^ ------------------------------------- //              

    // ------------------------------------- SUB VOLUMES ------------------------------------- //

    const [contextMenuSubVolume, setContextMenuSubVolume] = useState({ visible: false, selectedIdVolume: '', selectedIdSubVolume: '' });

    const [contextSubVolumes, setContextSubVolumes] = useState({ visible: false, selectedIdVolume: '' });

    const [subVolumesPorVolume, setSubVolumesPorVolume] = useState({});

    // CONTAINER QUE POSSUI TODOS OS SUBVOLUMES
    const [subVolumeSelecionado, setSubVolumeSelecionado] = useState([]);

    // SALVAR OS IDS PARA EDITAR OU DELETAR SUBVOLUMES
    const [subVolumesIds, setSubVolumesIds] = useState({});

    // FORM DATA SUBVOLUME
    const [formDataSubVolume, setFormDataSubVolume] = useState({});

    const [contextSubVolumeLista, setContextSubVolumeLista] = useState({ visible: false, selectedIdVolume: '' });
    const [definirBotaoMostrarMais, setDefinirBotaoMostrarMais] = useState({});

    const [contextDeleteSubVolume, setContextDeleteSubVolume] = useState({ visible: false, x: 0, y: 0, selectedIdVolume: '', selectedIdSubVolume: '' });
    const [contextEditarSubVolume, setContextEditarSubVolume] = useState({ visible: false, x: 0, y: 0, selectedIdVolume: '', selectedIdSubVolume: '' });






    // ------------------------------------- ^SUB VOLUMES^ ------------------------------------- //              

    // ------------------------------------- CONTEXTOS ------------------------------------- //

    // PARTE DA FUNÇÃO PARA FECHAR OS CONTEXTOS AO CLICAR FORA DELES 
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [contextEditar, setContextEditar] = useState({ visible: false, selectedIdVolume: '' });

    // PARTES DA FUNÇAO CONTEXTOS
    const overlayRef = useRef(null);
    const contextMenuRef = useRef(null);
    const contextEditarRef = useRef(null);
    const contextMenuSubVolumeRef = useRef(null);
    const contextSubVolumesRef = useRef(null);

    // MENSAGENS DE SUCESSO E ERRO
    const [errorMessage, setErrorMessage] = useState(null);
    const [sucessMessage, setSucessMessage] = useState(null);




    // ------------------------------------- ^CONTEXTOS^ ------------------------------------- //              

    // ------------------------------------- EXIBIR PRODUTO ------------------------------------- //



    // BUSCAR O PRODUTO QUE FOI SELECIONADO E OS SEUS VOLUMES
    useEffect(() => {
        const fetchProdutoSelecionado = async () => {

            try {
                const response = await axios.get(`http://localhost:8080/api/pl-produto/${id}/${idProduto}/${seq}`);
                setProdutoSelecionado(response.data);
            } catch (error) {
                console.error("Erro ao carregar o produto selecionado: ", error);
            }

        };


        const fetchVolumes = async () => {

            try {
                const response = await axios.get(`http://localhost:8080/api/volume/produto/${id}/${idProduto}/${seq}`);
                setVolumes(response.data);
            } catch (error) {
                console.error("Erro ao carregar os volumes: ", error);
            }
        }

        fetchProdutoSelecionado();
        fetchVolumes();

    }, [id, idProduto, seq, atualizarEstadoLista]);














    // ------------------------------------- ^EXIBIR PRODUTOS^ ------------------------------------- //              

    // ------------------------------------- VOLUMES ------------------------------------- //


    // BUSCANDO TODOS OS TIPOS DE VOLUME E ARMAZENANDO CADA UM EM UM OBJETO E SALVANDO UMA VARIAVEL OBJETO COMUM
    useEffect(() => {
        const fetchTipoDeVolume = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tipo-de-volume`);
                const tipoVolumeMap = response.data.reduce((acc, tipo) => {
                    acc[tipo.idTipoVolume] = tipo.descricao;
                    return acc;
                }, {});
                setTiposDeVolume(tipoVolumeMap);
                setTiposDeVolumeArray(response.data); // Armazena o array original
            } catch (error) {
                console.error("Erro ao buscar tipo de volume: ", error);
            }
        }
        fetchTipoDeVolume();
    }, []);


    // BUSCANDO O TIPO DE VOLUME DO PRODUTO SELECIONADO
    useEffect(() => {
        const fetchTipoDeVolume = async () => {
            if (!volumeEdicao.idTipoVolumeId) return;
            try {
                const response = await axios.get(`http://localhost:8080/api/tipo-de-volume/${volumeEdicao.idTipoVolumeId}`);
                setSalvarTipoDeVolumeAtual({ descricao: response.data.descricao });
            } catch (error) {
                console.error("Erro ao buscar tipo de volume: ", error);
            }
        };

        fetchTipoDeVolume();
    }, [volumeEdicao.idTipoVolumeId]);


    // SALVANDO O VOLUME 
    const handleSalvarVolume = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/api/volume`, formDataVolume);
            setIdVolumeSave(response.data.idVolume);
            setAtualizarEstadoLista(atualizarEstadoLista + 1);

            setFormDataVolume({
                idTipoVolumeId: '',
                quantidadeItens: '',
                descricao: '',
                altura: '',
                largura: '',
                comprimento: '',
                pesoLiquido: '',
                pesoBruto: '',
                observacao: ''
            });

            setOverlayVisible(false);
            setSucessMessage('Volume adicionado com sucesso!');
            setTimeout(() => setSucessMessage(null), 5000);
            setVolumeCriado(true); // Define que o volume foi criado

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao adicionar Volume";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);
            console.error('Erro ao adicionar o volume: ', error);
        }
    };


    // SALVANDO ITEM VOLUME CRIADO NO VOLUME PRODUTO
    useEffect(() => {
        if (volumeCriado && idVolumeSave) {
            const salvarVolumeProduto = async () => {
                try {
                    await axios.post(`http://localhost:8080/api/volume-produto`, {
                        id: {
                            idPackinglist: id,
                            idProduto: idProduto,
                            seq: seq,
                            idVolume: idVolumeSave
                        },
                        qrCodeVolumeProduto: "teste"
                    });

                    setAtualizarEstadoLista(atualizarEstadoLista + 1);

                    setVolumeCriado(false); // Reseta o estado após sucesso

                } catch (error) {
                    const errorMessage = error.response?.data || "Erro desconhecido ao adicionar Volume Produto";
                    setErrorMessage(errorMessage);
                    setTimeout(() => setErrorMessage(null), 5000);
                    console.error('Erro ao adicionar o VolumeProduto: ', error);
                }
            };

            salvarVolumeProduto();
        }
    }, [volumeCriado, idVolumeSave, id, idProduto, seq]);


    //ATUALIZANDO O VOLUME
    const handleAtualizarVolume = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/api/volume/${salvarIdVolume}`, volumeEdicao)
            .then(response => {

                setFormDataVolume({
                    idTipoVolumeId: '',
                    quantidadeItens: '',
                    descricao: '',
                    altura: '',
                    largura: '',
                    comprimento: '',
                    pesoLiquido: '',
                    pesoBruto: '',
                    observacao: ''
                })

                setContextEditar({ visible: false, selectedIdVolume: '' });
                setSucessMessage('Volume atualizado com sucesso!');
                setTimeout(() => setSucessMessage(null), 5000);
                setAtualizarEstadoLista(atualizarEstadoLista + 1);
            })
            .catch(error => {
                const errorMessage = error.response?.data || "Erro desconhecido ao atualizar Volume";
                setErrorMessage(errorMessage);
                setTimeout(() => setErrorMessage(null), 5000);
                console.error('Erro ao atualizar o volume: ', error);
            });
    }


    // PARTE DA FUNÇAO PARA SALVAR OS ITENS EDITADOS PUT
    useEffect(() => {
        if (salvarIdVolume.length > 0) {
            const fetchProdutoEdicao = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/volume/${salvarIdVolume}`);
                    setVolumeEdicao(response.data);
                } catch (error) {
                    console.error('Erro: ', error);
                }
            };

            fetchProdutoEdicao();
        }
    }, [salvarIdVolume]);


    // ENTRAR NO BOTAO ADICIONAR VOLUME
    const handleAddVolume = () => {
        setOverlayVisible(true);
    }


    // CANCELANDO A ADIÇAO DE VOLUME
    const handleCancelAddVolume = () => {
        setOverlayVisible(false);
        setContextEditar({ visible: false, selectedIdVolume: '' });

        setFormDataVolume({
            idTipoVolumeId: '',
            quantidadeItens: '',
            descricao: '',
            altura: '',
            largura: '',
            comprimento: '',
            pesoLiquido: '',
            pesoBruto: '',
            observacao: ''
        })
    }


    // AÇAO PARA QUANDO CLICAR NO BOTAO EDITAR VOLUME
    const handleEdit = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedIdVolume: null
        });
        setContextEditar({ visible: true, selectedIdVolume: contextMenu.selectedIdVolume });
    }




    // AÇAO PARA QUANDO CLICAR NO BOTAO EXCLUIR VOLUME
    const handleDelete = (e) => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedIdVolume: null
        });
        setContextDelete({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedIdVolume: contextMenu.selectedIdVolume
        })
    }

    // AÇAO PARA CONFIRMAR A EXCLUSAO DO VOLUME
    const handleDeleteConfirm = () => {
        const idVolumeSelecionado = contextDelete.selectedIdVolume;
        axios.delete(`http://localhost:8080/api/volume/${idVolumeSelecionado}`)
            .then(() => {

                setAtualizarEstadoLista(atualizarEstadoLista + 1);
                setSucessMessage(`Volume ${idVolumeSelecionado} deletado com sucesso!`);

                setContextDelete({ visible: false, x: 0, y: 0, selectedIdVolume: null });

                setTimeout(() => {
                    setSucessMessage(null)
                }, 5000);




                axios.delete(`http://localhost:8080/api/volume-produto/${id}/${idProduto}/${seq}/${idVolumeSelecionado}`)
                    .then(() => {

                        setSucessMessage(`Volume ${idVolumeSelecionado} deletado com sucesso!`);
                        setAtualizarEstadoLista(atualizarEstadoLista + 1);
                        setTimeout(() => {
                            setSucessMessage(null)
                        }, 5000);

                    })
                    .catch((error) => {

                        setErrorMessage('Erro ao deletar Volume Produto ( VOLUME PRODUTO NÃO FOI SALVO! )');

                        setTimeout(() => {
                            setErrorMessage(null);
                        }, 5000);

                    });
            })
            .catch((error) => {

                const errorMessage = error.response?.data || "Erro desconhecido ao deletar Volume...";
                setErrorMessage('ERRO AO DELETAR O VOLUME: ', errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            });
    }



    // ------------------------------------- ^VOLUMES^ ------------------------------------- //              

    // ------------------------------------- SUB VOLUMES ------------------------------------- //

    // SALVAR SUBVOLUME
    const handleSalvarSubVolume = async (e) => {
        e.preventDefault();

        await axios.post(`http://localhost:8080/api/subvolume`, formDataSubVolume)
            .then(() => {

                setSucessMessage('Sub Volume adicionado com sucesso');

                setTimeout(() => setSucessMessage(null), 5000);
                setAtualizarEstadoListaSubVolumes(atualizarEstadoListaSubVolumes + 1);

                fetchSubVolumesContexto(salvarIdVolume);
                setFormDataSubVolume(
                    {
                        id: {
                            idVolume: salvarIdVolume,
                        },
                        descricao: "",
                        quantidade: ""
                    }
                );

            })
            .catch(error => {
                const errorMessage = error.response?.data || "Erro desconhecido ao adicionar Sub Volume";
                setErrorMessage(errorMessage);
                setTimeout(() => setErrorMessage(null), 5000);
            })
    }


    // BUSCANDO OS SUBVOLUMES EXISTENTES PELO IDVOLUME
    const fetchSubVolumes = async (idVolume) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/subvolume/volume/${idVolume}`);
            setSubVolumesPorVolume(prevState => ({
                ...prevState,
                [idVolume]: response.data
            }));
        } catch (error) {
            console.error("Erro ao buscar sub volumes: ", error);
        }
    }


    // BUSCAR OS SUBVOLUMES DO ITEM SELECIONADO
    const fetchSubVolumesContexto = async (idVolume) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/subvolume/volume/${idVolume}`);
            setSubVolumeSelecionado(response.data);
            console.log('testee', response.data)
        } catch (error) {
            console.error("Erro ao buscar sub volumes: ", error);
            console.log('testee deu erro')

        }
    }


    // CANCELANDO A ADIÇAO DE SUBVOLUME
    const handleCancelAddSubvolume = () => {
        setContextSubVolumes({ visible: false });
        setFormDataSubVolume({});
    }


    // AÇAO PARA IR AOS SUB VOLUMES
    const handleSubVolumes = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedIdVolume: null
        });
        setFormDataSubVolume(
            {
                id: {
                    idVolume: contextMenu.selectedIdVolume,
                },
                descricao: "",
                quantidade: ""
            }
        );
        setContextMenuSubVolume({ visible: false });
        fetchSubVolumesContexto(salvarIdVolume);
        setContextSubVolumes({
            visible: true,
            x: 0,
            y: 0,
            selectedIdVolume: contextMenu.selectedIdVolume
        });
        setAtualizarEstadoListaSubVolumes(atualizarEstadoListaSubVolumes + 1);
    }


    // ABRIR LISTA DE SUBVOLUMES AO CLICAR NO MAIS +
    const handleSubVolumeList = (e, idVolume) => {
        e.preventDefault();

        // Verifica se já temos os subvolumes carregados para este volume
        if (!subVolumesPorVolume[idVolume]) {
            fetchSubVolumes(idVolume);
        }

        setDefinirBotaoMostrarMais(prevState => ({
            ...prevState,
            [idVolume]: 'diminuir'
        }));
        setContextSubVolumeLista(prevState => ({
            ...prevState,
            [idVolume]: !prevState[idVolume] // Alterna o estado de visibilidade para este volume específico
        }));
    };


    // FECHAR LISTA DE SUBVOLUMES AO CLICAR NO MENOS -
    const hideSubVolumeList = (e, idVolume) => {
        e.preventDefault();

        setDefinirBotaoMostrarMais(prevState => ({
            ...prevState,
            [idVolume]: 'mostrar'
        }));

        setContextSubVolumeLista(prevState => ({
            ...prevState,
            [idVolume]: false // Esconde o subvolume para este volume específico
        }));

        console.log('idVolume', idVolume);
    };


    const handleEditSubVolume = () => {
        setContextMenuSubVolume({
            visible: false,
            x: 0,
            y: 0,
            selectedIdVolume: null
        });
        setContextEditarSubVolume({ visible: true, selectedIdVolume: contextMenu.selectedIdVolume });
    }


     // AÇAO PARA QUANDO CLICAR NO BOTAO EXCLUIR VOLUME
     const handleDeleteSubVolume = (e) => {
        setContextMenuSubVolume({
            visible: false,
            x: 0,
            y: 0,
            selectedIdVolume: null
        });
        setContextDeleteSubVolume({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedIdVolume: contextMenuSubVolume.idVolume,
            selectedIdSubVolume: contextMenuSubVolume.idSubVolume
        })
    }






    // ------------------------------------- ^SUB VOLUMES^ ------------------------------------- //              

    // ------------------------------------- FUNÇÕES PARALELAS ------------------------------------- //


    // PARTE DA FUNÇÃO PARA FECHAR OS CONTEXTOS AO CLICAR FORA DELES 
    useEffect(() => {
        if (overlayVisible || contextMenu.visible || contextEditar.visible || contextSubVolumes.visible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [overlayVisible, contextMenu, contextEditar, contextSubVolumes]);


    // FUNÇAO PARA CONVERTER O MAPEAMENTO DOS IDS EM UM ARRAY PARA O AUTOCOMPLETE
    const getTipoDeVolumeArray = () => {
        return tiposDeVolumeArray;
    }

    // relacionado a inserir a hora da criaçao
    const formatarData = (dtCriacao) => {
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };


    // FECHAR MENSAGEM DE ERRO OU SUCESSO
    const closeMessages = () => {
        setErrorMessage(null);
        setSucessMessage(null);
    }








    // ------------------------------------- ^FUNÇÕES PARALELAS^ ------------------------------------- //              

    // ------------------------------------- INPUTS ------------------------------------- //


    // FUNÇAO PARA SALVAR O QUE ESTA SENDO DIGITADO NOS INPUTS DO POST
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataVolume(prevData => ({
            ...prevData,
            [name]: value
        }));
    }


    // FUNÇAO PARA SALVAR O QUE ESTA SENDO DIGITADO NOS INPUTS DO PUT
    const handleChangeEdicao = (e) => {
        const { name, value } = e.target;
        setVolumeEdicao(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // FUNÇAO PARA SALVAR O QUE ESTA SENDO DIGITADO NOS INPUTS DO SUBVOLUME
    const handleChangeSubVolume = (e) => {
        const { name, value } = e.target;
        setFormDataSubVolume(prevData => ({
            ...prevData,
            [name]: value
        }));
    }


    // FUNÇAO PARA SALVAR O QUE ESTA SENDO DIGITADO NO INPUT DO AUTOCOMPLETE DO POST
    const handleAutocompleteChangeTipoVolume = (item) => {
        setFormDataVolume(prevData => ({
            ...prevData,
            idTipoVolumeId: item.idTipoVolume
        }));
    };


    // FUNÇAO PARA SALVAR O QUE ESTA SENDO DIGITADO NO INPUT DO AUTOCOMPLETE DO PUT
    const handleAutocompleteChangeTipoVolumeEdicao = (selectedOption) => {
        setVolumeEdicao(prevState => ({
            ...prevState,
            idTipoVolumeId: selectedOption.idTipoVolume,
        }));
    };








    // ------------------------------------- ^INPUTS^ ------------------------------------- //              

    // ------------------------------------- FUNÇÕES CONTEXTOS ------------------------------------- // 

    // PARTE DA FUNÇÃO PARA FECHAR OS CONTEXTOS AO CLICAR FORA DELES 
    const handleClickOutside = (event) => {
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
            setOverlayVisible(false);

            setFormDataVolume({
                idTipoVolumeId: '',
                quantidadeItens: '',
                descricao: '',
                altura: '',
                largura: '',
                comprimento: '',
                pesoLiquido: '',
                pesoBruto: '',
                observacao: ''
            });
        }

        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
            setContextMenu({ visible: false, selectedIdVolume: '' });
        }

        if (contextMenuSubVolumeRef.current && !contextMenuSubVolumeRef.current.contains(event.target)) {
            setContextMenuSubVolume({ visible: false, selectedIdVolume: '', selectedIdSubVolume: '' })
        }

        if (contextEditarRef.current && !contextEditarRef.current.contains(event.target)) {
            setContextEditar({ visible: false, selectedIdVolume: '' });
        }

        if (contextSubVolumesRef.current && !contextSubVolumesRef.current.contains(event.target)) {
            setContextSubVolumes({ visible: false, selectedIdVolume: '' });

            setFormDataSubVolume({});
        }
    }


    // AÇAO PARA QUANDO CLICAR COM O BOTAO DIREITO EM CIMA DE ALGUM ITEM
    const handleRightClick = (e, idVolume) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedIdVolume: idVolume
        });
        setSalvarIdVolume(`${idVolume}`);
    };


    // AÇAO PARA QUANDO CLICAR COM O BOTAO DIREITO EM CIMA DE ALGUM SUBVOLUME
    const handleRightClickSubVolume = (e, idVolume, idSubVolume) => {
        e.preventDefault();
        setContextMenuSubVolume({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedIdVolume: idVolume,
            selectedIdSubVolume: idSubVolume
        });
        setSubVolumesIds({
            idVolume: idVolume,
            idSubVolume: idSubVolume
        });
    };















    // ------------------------------------- ^FUNÇÕES CONTEXTOS^ ------------------------------------- //              

    // ------------------------------------- RETURN ------------------------------------- //              

    return (
        <div className="volume-container">
            <Header />
            <SucessNotification message={sucessMessage} onClose={closeMessages} id="message" />
            <ErrorNotification message={errorMessage} onClose={closeMessages} id="message" />

            <div>
                <div className='container-listagem-produto-volume'>
                    <div className="subcontainer-listagem-produto-volume">
                        <ul>
                            <li className="header-produto-volume">
                                <div>Id PackingList</div>
                                <div>Id do Produto</div>
                                <div>Seq</div>
                                <div>Descrição</div>
                                <div>Ordem de Produção</div>
                            </li>
                            {produtoSelecionado && (
                                <li key={id} className='li-listagem-produto-volume'>
                                    <div>{id}</div>
                                    <div>{produtoSelecionado.id.idProduto}</div>
                                    <div>{produtoSelecionado.id.seq}</div>
                                    <div>{produtoSelecionado.descricaoProduto}</div>
                                    <div>{produtoSelecionado.ordemProducao}</div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>



            <div className="org-lista-1">
                <div className="org-lista-2">
                    <div id="container-botao-add-volume">
                        <Button
                            className={'button-adicionar-volume'}
                            text={'Adicionar Volume'}
                            padding={10}
                            fontSize={15}
                            borderRadius={5}
                            onClick={handleAddVolume}
                        />
                    </div>

                    <div className='container-listagem-volume'>
                        <ul>
                            <li className="header-volume">
                                <div id="list-vol">ID Volume</div>
                                <div id="list-vol">Tipo do Volume</div>
                                <div id="list-vol">Quantidade de Itens</div>
                                <div id="list-vol">Descrição</div>
                                <div id="list-vol">Altura</div>
                                <div id="list-vol">Largura</div>
                                <div id="list-vol">Comprimento</div>
                                <div id="list-vol">Peso Líquido</div>
                                <div id="list-vol">Peso Bruto</div>
                                <div id="list-vol">Observação</div>
                            </li>

                            {volumes.length > 0 ? (
                                volumes.map((v) => (
                                    <li key={v.idVolume} onContextMenu={(e) => handleRightClick(e, v.idVolume)} className='li-listagem-volume'>
                                        <div id="container-list-vol">
                                            <div id="list-vol-divs">
                                                <div id="list-vol">{v.idVolume}</div>
                                                <div id="list-vol">{tiposDeVolume[v.idTipoVolumeId]}</div>
                                                <div id="list-vol">{v.quantidadeItens}</div>
                                                <div id="list-vol">{v.descricao}</div>
                                                <div id="list-vol">{v.altura}</div>
                                                <div id="list-vol">{v.largura}</div>
                                                <div id="list-vol">{v.comprimento}</div>
                                                <div id="list-vol">{v.pesoLiquido}</div>
                                                <div id="list-vol">{v.pesoBruto}</div>
                                                <div id="list-vol">{v.observacao}</div>
                                            </div>
                                            <div id="container-icon-plus">
                                                {definirBotaoMostrarMais[v.idVolume] === 'diminuir' ? (
                                                    <Icon icon="ic:baseline-minus" id="ic-outline-plus" onClick={(e) => hideSubVolumeList(e, v.idVolume)} />
                                                ) : (
                                                    <Icon icon="ic:outline-plus" id="ic-outline-plus" onClick={(e) => handleSubVolumeList(e, v.idVolume)} />
                                                )}
                                            </div>
                                        </div>

                                        {contextSubVolumeLista[v.idVolume] && (
                                            <div id="listagem-subvolume">
                                                <div className="lista-subvolume-overlay">
                                                    <div className="ul-lista-subvolume">
                                                        <ul>
                                                            <li className="header-produto-subvolume" id="grid-lista">
                                                                <div id="lista-1">Id Volume</div>
                                                                <div id="lista-1">Id SubVolume</div>
                                                                <div id="lista-1">Descrição</div>
                                                                <div id="lista-1">Quantidade</div>
                                                            </li>
                                                            {subVolumesPorVolume[v.idVolume] && subVolumesPorVolume[v.idVolume].length > 0 ? (
                                                                subVolumesPorVolume[v.idVolume].map((subVolume) => (
                                                                    <li key={subVolume.id.idSubVolume} className='li-listagem-produto-subvolume' id="grid-lista"
                                                                        onContextMenu={(e) => handleRightClickSubVolume(e, subVolume.idVolume)}>
                                                                        <div>{subVolume.id.idVolume}</div>
                                                                        <div>{subVolume.id.idSubVolume}</div>
                                                                        <div>{subVolume.descricao}</div>
                                                                        <div>{subVolume.quantidade}</div>
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <div id="container-nao-existe-subvolume">
                                                                    <div id="nao-existe-subvolume">
                                                                        <li>Não há nada para exibir, adicione um sub-volume...</li>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <div id="nao-existe-volume">
                                    <li>Não há nada para exibir, adicione um novo volume...</li>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>
            </div>


            {
                overlayVisible && (
                    <div className="overlay">
                        <div className="overlay-content" ref={overlayRef}>
                            <Title
                                classname={'title-adicionar-volume'}
                                text={'Adicionar um volume:'}
                                color={'#1780e2'}
                            />
                            <div className="subcontainer-volume">
                                <div className="container-input-adicionar-volume">
                                    <form>
                                        <div className="input-group-volume">
                                            <div>
                                                <label>Tipo de volume:</label>
                                                <Autocomplete
                                                    data={getTipoDeVolumeArray()}
                                                    onSelect={handleAutocompleteChangeTipoVolume}
                                                    displayField={'descricao'}
                                                />
                                            </div>
                                            <div>
                                                <label>Quantidade de itens:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'quantidadeItens'}
                                                    min={'0'}
                                                    placeholder={'Quantidade de itens...'}
                                                    value={formDataVolume.quantidadeItens}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Descrição:</label>
                                                <Input
                                                    type={'text'}
                                                    name={'descricao'}
                                                    placeholder={'Descrição...'}
                                                    value={formDataVolume.descricao}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Altura:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'altura'}
                                                    min={'0'}
                                                    placeholder={'Altura...'}
                                                    value={formDataVolume.altura}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Largura:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'largura'}
                                                    min={'0'}
                                                    placeholder={'Largura...'}
                                                    value={formDataVolume.largura}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div id="div-comprimento">
                                                <label>Comprimento:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'comprimento'}
                                                    min={'0'}
                                                    placeholder={'Comprimento...'}
                                                    value={formDataVolume.comprimento}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Peso Líquido:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoLiquido'}
                                                    min={'0'}
                                                    placeholder={'Peso líquido...'}
                                                    value={formDataVolume.pesoLiquido}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Peso Bruto:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoBruto'}
                                                    min={'0'}
                                                    placeholder={'Peso bruto...'}
                                                    value={formDataVolume.pesoBruto}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div id="div-observacao">
                                                <label>Observação:</label>
                                                <Input
                                                    type={'text'}
                                                    name={'observacao'}
                                                    placeholder={'Observação...'}
                                                    value={formDataVolume.observacao}
                                                    onChange={handleChange}
                                                />
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
                                    onClick={handleSalvarVolume}
                                />
                                <Button
                                    className={'button-cancelar-add-volume'}
                                    text={'CANCELAR'}
                                    fontSize={15}
                                    padding={10}
                                    borderRadius={5}
                                    onClick={handleCancelAddVolume}
                                />
                            </div>
                        </div>
                    </div>
                )
            }


            {
                contextEditar.visible && (

                    <div className="overlay">
                        <div className="overlay-content" ref={contextEditarRef}>
                            <Title
                                classname={'title-adicionar-volume'}
                                text={'Editar o volume:'}
                                color={'#1780e2'}
                            />
                            <div className="subcontainer-volume">
                                <div className="container-input-adicionar-volume">
                                    <form>
                                        <div className="input-group-volume">
                                            <div>
                                                <label>Tipo de volume:</label>
                                                <Autocomplete
                                                    data={getTipoDeVolumeArray()}
                                                    onSelect={handleAutocompleteChangeTipoVolumeEdicao}
                                                    displayField={'descricao'}
                                                    value={salvarTipoDeVolumeAtual.descricao}
                                                />
                                            </div>
                                            <div>
                                                <label>Quantidade de itens:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'quantidadeItens'}
                                                    min={'0'}
                                                    placeholder={'Quantidade de itens...'}
                                                    value={volumeEdicao.quantidadeItens}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Descrição:</label>
                                                <Input
                                                    type={'text'}
                                                    name={'descricao'}
                                                    placeholder={'Descrição...'}
                                                    value={volumeEdicao.descricao}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Altura:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'altura'}
                                                    min={'0'}
                                                    placeholder={'Altura...'}
                                                    value={volumeEdicao.altura}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Largura:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'largura'}
                                                    min={'0'}
                                                    placeholder={'Largura...'}
                                                    value={volumeEdicao.largura}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Comprimento:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'comprimento'}
                                                    min={'0'}
                                                    placeholder={'Comprimento...'}
                                                    value={volumeEdicao.comprimento || ''}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Peso Líquido:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoLiquido'}
                                                    min={'0'}
                                                    placeholder={'Peso líquido...'}
                                                    value={volumeEdicao.pesoLiquido}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Peso Bruto:</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoBruto'}
                                                    min={'0'}
                                                    placeholder={'Peso bruto...'}
                                                    value={volumeEdicao.pesoBruto}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Observação:</label>
                                                <Input
                                                    type={'text'}
                                                    name={'observacao'}
                                                    placeholder={'Observação...'}
                                                    value={volumeEdicao.observacao || ''}
                                                    onChange={handleChangeEdicao}
                                                />
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
                                    onClick={handleAtualizarVolume}
                                />
                                <Button
                                    className={'button-cancelar-add-volume'}
                                    text={'CANCELAR'}
                                    fontSize={15}
                                    padding={10}
                                    borderRadius={5}
                                    onClick={handleCancelAddVolume}
                                />
                            </div>
                        </div>
                    </div>
                )
            }


            {
                contextSubVolumes.visible && (
                    <div className="overlay">
                        <div className="overlay-content" ref={contextSubVolumesRef}>
                            <div className="title-subvolume-lista">
                                <Title
                                    text={'Adicionar Sub-Volumes'}
                                    color={'#1780e2'}
                                />
                            </div>

                            <div className="subcontainer-subvolume">
                                <div className="container-input-adicionar-subvolume">
                                    <form>
                                        <div className="input-group-subvolume">
                                            <div className="container-input-subvolume">

                                                <div>
                                                    <label>Descrição:</label>
                                                    <Input
                                                        type={'text'}
                                                        placeholder={'Digite a descrição...'}
                                                        name={'descricao'}
                                                        onChange={handleChangeSubVolume}
                                                        value={formDataSubVolume.descricao}
                                                    />
                                                </div>

                                                <div id="div-quantidade-subvolume">
                                                    <label>Quantidade:</label>
                                                    <Input
                                                        placeholder={'Digite a quantidade...'}
                                                        name={'quantidade'}
                                                        type={'number'}
                                                        min={'1'}
                                                        onChange={handleChangeSubVolume}
                                                        value={formDataSubVolume.quantidade}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                            <div className="buttons-adicionar-subvolume">
                                <Button
                                    className={'button-salvar-add-subvolume'}
                                    text={'SALVAR'}
                                    fontSize={15}
                                    padding={10}
                                    borderRadius={5}
                                    onClick={handleSalvarSubVolume}
                                />
                                <Button
                                    className={'button-cancelar-add-subvolume'}
                                    text={'CANCELAR'}
                                    fontSize={15}
                                    padding={10}
                                    borderRadius={5}
                                    onClick={handleCancelAddSubvolume}
                                />
                            </div>



                            <div id="title-lista-subvolume">
                                <Text
                                    text={'| Lista de Sub Volumes |'}
                                    color={'#1780e2'}
                                    fontSize={17}
                                />
                            </div>

                            <div id="listagem-subvolume">
                                <div className="lista-subvolume-overlay">
                                    <div className="ul-lista-subvolume">
                                        <ul>
                                            <li className="header-produto-subvolume" id="grid-lista">
                                                <div id="lista-1">Id Volume</div>
                                                <div id="lista-1">Id SubVolume</div>
                                                <div id="lista-1">Descrição</div>
                                                <div id="lista-1">Quantidade</div>
                                            </li>
                                            {subVolumeSelecionado.length > 0 ? (
                                                subVolumeSelecionado && subVolumeSelecionado.map((subVolume, idVolume) => (
                                                    <li key={subVolume.id.idSubVolume} className='li-listagem-produto-subvolume' id="grid-lista"
                                                        onContextMenu={(e) => handleRightClickSubVolume(e, subVolume.idVolume)}>
                                                        <div>{subVolume.id.idVolume}</div>
                                                        <div>{subVolume.id.idSubVolume}</div>
                                                        <div>{subVolume.descricao}</div>
                                                        <div>{subVolume.quantidade}</div>
                                                    </li>
                                                ))
                                            ) : (
                                                <div id="container-nao-existe-subvolume">
                                                    <div id="nao-existe-subvolume">
                                                        <li>Não há nada para exibir, adicione um sub-volume...</li>
                                                    </div>
                                                </div>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }



            {
                contextMenu.visible && (
                    <div className="context-menu" style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }} ref={contextMenuRef}>
                        <button onClick={handleEdit}>Editar</button>
                        <button onClick={handleSubVolumes}>Adicionar Sub-Volume</button>
                        <button onClick={handleDelete}>Excluir</button>
                    </div>
                )}


            {
                contextMenuSubVolume.visible && (
                    <div className="context-menu" style={{ top: `${contextMenuSubVolume.y}px`, left: `${contextMenuSubVolume.x}px` }} ref={contextMenuSubVolumeRef}>
                        <button onClick={handleEditSubVolume}>Editar Sub-Volume</button>
                        <button onClick={handleSubVolumes}>Adicionar Sub-Volume</button>
                        <button onClick={handleDeleteSubVolume}>Excluir Sub-Volume</button>
                    </div>
                )}



            {
                contextDelete.visible && (
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
                )
            }


        </div >
    );
}

export default Volume;