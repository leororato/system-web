import { useEffect, useState, useRef } from "react";
import Header from "../../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import './Volume.css';
import Button from "../../../components/Button";
import Title from "../../../components/Title";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import Input from "../../../components/Input";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import Text from "../../../components/Text";
import { format } from "date-fns";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, CircularProgress } from "@mui/material";
import Cookies from 'js-cookie';
import api from '../../../axiosConfig';
import Loading from "../../../components/Loading/Loading";



function Volume() {

    // Obtenha o token JWT do cookie
    const token = Cookies.get('jwt');

    // Configure o header da requisição
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    // ------------------------------------- PRODUTOS ------------------------------------- //

    // CHAVES COMPOSTAS DO PRODUTO SELECIONADO NA PAGINA ANTERIOR
    const { id, idProduto, seq } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [estadoDaPagina, setEstadoDaPagina] = useState("Carregando");
    const [contextLoading, setContextLoading] = useState({ visible: false });

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
        idTipoVolumeId: '16',
        quantidadeItens: '1',
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

    // CONTEXTO OPÇÕES EDITAR ADICIONAR EXCLUIR
    const [contextMenuSubVolume, setContextMenuSubVolume] = useState({ visible: false, selectedIdVolume: '', selectedIdSubVolume: '' });
    // OVERLAY ADICIONAR EDITAR 
    const [contextSubVolumes, setContextSubVolumes] = useState({ visible: false, selectedIdVolume: '' });
    // CONTAINER DOS SUBVOLUMES PESQUISADOR PELO IDVOLUME
    const [subVolumesPorVolume, setSubVolumesPorVolume] = useState({});

    // CONTAINER QUE POSSUI TODOS OS SUBVOLUMES
    const [subVolumeSelecionado, setSubVolumeSelecionado] = useState([]);

    // SALVAR OS IDS PARA EDITAR OU DELETAR SUBVOLUMES
    const [subVolumesIds, setSubVolumesIds] = useState({});

    // ESTADO DO OVERLAY ( ADICIONAR OU EDITAR)
    const [estadoSubVolumeOverlay, setEstadoSubVolumeOverlay] = useState('');

    // ESTADO DO EXCLUIR (VOLUME OU SUBVOLUME)
    const [estadoExcluirOverlay, setEstadoExcluirOverlay] = useState('');


    // FORM DATA SUBVOLUME
    const [formDataSubVolume, setFormDataSubVolume] = useState({});

    const [contextSubVolumeLista, setContextSubVolumeLista] = useState({ visible: false, selectedIdVolume: '' });
    const [definirBotaoMostrarMais, setDefinirBotaoMostrarMais] = useState({});

    const [formDataEditarSubVolume, setFormDataEditarSubVolume] = useState(
        {
            id: {
                idVolume: '',
            },
            descricao: "",
            quantidade: ""
        }
    );




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


    // ------------------------------------- QR CODE ------------------------------------- //   

    // CARREGA O VALOR DOS IDS DO VOLUME PARA GERAR QRCODES
    const [salvarIdsVolume, setSalvarIdsVolume] = useState({
        idVolumeProduto: '',
        idPackinglist: id,
        idProduto: idProduto,
        seq: seq,
        idVolume: ''
    });

    // ------------------------------------- ^QR CODE^ ------------------------------------- //   

    // ------------------------------------- EXIBIR PRODUTO ------------------------------------- //

    // CARREGA OS PRODUTOS EXISTENTES AO ENTRAR NA PAGINA
    useEffect(() => {

        fetchProdutoSelecionado();

    }, [])



    // BUSCAR O PRODUTO QUE FOI SELECIONADO E OS SEUS VOLUMES
    const fetchProdutoSelecionado = async () => {

        setEstadoDaPagina("Carregando");
        setContextLoading({ visible: true });
        setLoading(true);

        try {
            const response = await api.get(`/pl-produto/${id}/${idProduto}/${seq}`, config);
            setProdutoSelecionado(response.data);

        } catch (error) {
            const errorMessage = error.response?.data?.message.message || "Erro desconhecido ao carregar o produto selecionado";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
            setLoading(false);
        }
    };


    // CARREGA OS VOLUMES EXISTENTES AO ENTRAR NA PAGINA
    useEffect(() => {
        fetchVolumes();
    }, [])

    // ATUALIZA A LISTA DOS VOLUMES EXISTENTES NA TELA, QUANDO É CHAMADO
    const fetchVolumes = async () => {

        setEstadoDaPagina("Carregando");
        setLoading(true);
        setContextLoading({ visible: true });

        try {
            const response = await api.get(`/volume/produto/${id}/${idProduto}/${seq}`, config);
            setVolumes(response.data);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao carregar volumes";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        } finally {
            setContextLoading({ visible: false });
            setLoading(false);
        }
    }



    // ------------------------------------- ^EXIBIR PRODUTOS^ ------------------------------------- //              

    // ------------------------------------- VOLUMES ------------------------------------- //


    // BUSCANDO TODOS OS TIPOS DE VOLUME E ARMAZENANDO CADA UM EM UM OBJETO E SALVANDO UMA VARIAVEL OBJETO COMUM
    useEffect(() => {

        const fetchTipoDeVolume = async () => {
            setEstadoDaPagina("Carregando");
            setContextLoading({ visible: true });

            try {
                const response = await api.get(`/tipo-de-volume`, config);
                const tipoVolumeMap = response.data.reduce((acc, tipo) => {
                    acc[tipo.idTipoVolume] = tipo.descricao;
                    return acc;
                }, {});
                setTiposDeVolume(tipoVolumeMap);
                setTiposDeVolumeArray(response.data); // Armazena o array original
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar tipo de volume";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
            } finally {
                setContextLoading({ visible: false });
            }
        }

        fetchTipoDeVolume();
    }, []);


    // BUSCANDO O TIPO DE VOLUME DO PRODUTO SELECIONADO

    const fetchTipoDeVolume = async (tipoDeVolume) => {

        await setSalvarTipoDeVolumeAtual(tiposDeVolume[tipoDeVolume]);

        console.log(salvarTipoDeVolumeAtual);


        // setEstadoDaPagina("Carregando");
        // setContextLoading({ visible: true });

        // if (!volumeEdicao.idTipoVolumeId) return;

        // try {
        //     const response = await api.get(`/tipo-de-volume/${volumeEdicao.idTipoVolumeId}`, config);
        //     setSalvarTipoDeVolumeAtual({ descricao: response.data.descricao });
        // } catch (error) {
        //     const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar tipo de volume";
        //     setErrorMessage(errorMessage);

        //     setTimeout(() => {
        //         setErrorMessage(null);
        //     }, 5000);
        // }
    };



    // SALVANDO O VOLUME 
    const handleSalvarVolume = async (e) => {
        e.preventDefault();

        setEstadoDaPagina("Salvando");
        setContextLoading({ visible: true });

        try {
            const response = await api.post(`/volume`, formDataVolume, config);
            setIdVolumeSave(response.data.idVolume);

            setFormDataVolume({
                idTipoVolumeId: '16',
                quantidadeItens: '1',
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
            setVolumeCriado(true);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao adicionar Volume";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);
        } finally {
            setContextLoading({ visible: false });
        }


    };


    // SALVANDO ITEM VOLUME CRIADO NO VOLUME PRODUTO
    useEffect(() => {
        if (volumeCriado && idVolumeSave) {
            setEstadoDaPagina("Salvando");
            setContextLoading({ visible: true });
            const salvarVolumeProduto = async () => {
                try {
                    await api.post(`/volume-produto`, {
                        id: {
                            idPackinglist: id,
                            idProduto: idProduto,
                            seq: seq,
                            idVolume: idVolumeSave
                        },
                        qrCodeVolumeProduto: `${id}-${idProduto}-${seq}-${idVolumeSave}`

                    }, config);

                    fetchVolumes();
                    fetchProdutoSelecionado();

                    setVolumeCriado(false);

                } catch (error) {
                    const errorMessage = error.response?.data?.message || "Erro desconhecido ao adicionar Volume Produto";
                    setErrorMessage(errorMessage);
                    setTimeout(() => setErrorMessage(null), 5000);
                } finally {
                    setContextLoading({ visible: false });
                }

            };

            salvarVolumeProduto();
        }
    }, [volumeCriado, idVolumeSave, id, idProduto, seq]);


    //ATUALIZANDO O VOLUME
    const handleAtualizarVolume = async (e) => {
        e.preventDefault();

        setEstadoDaPagina("Atualizando");
        setContextLoading({ visible: true });

        try {
            await api.put(`/volume/${salvarIdVolume.idVolume}`, volumeEdicao, config)

            setFormDataVolume({
                idTipoVolumeId: '16',
                quantidadeItens: '1',
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

            fetchVolumes();
            fetchProdutoSelecionado();

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao atualizar Volume";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);
        } finally {
            setContextLoading({ visible: false });
        }
    }


    // ENTRAR NO BOTAO ADICIONAR VOLUME
    const handleAddVolume = () => {
        setOverlayVisible(true);
    }


    // CANCELANDO A ADIÇAO DE VOLUME
    const handleCancelAddVolume = () => {
        setOverlayVisible(false);
        setContextEditar({ visible: false, selectedIdVolume: '' });

        setFormDataVolume({
            idTipoVolumeId: '16',
            quantidadeItens: '1',
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
        setEstadoExcluirOverlay('volume');
    }

    // AÇAO PARA CONFIRMAR A EXCLUSAO DO VOLUME
    const handleDeleteConfirm = async () => {
        const idVolumeSelecionado = contextDelete.selectedIdVolume;
        setEstadoDaPagina("Excluindo");
        setContextLoading({ visible: true });

        try {
            api.delete(`/volume-produto/${id}/${idProduto}/${seq}/${idVolumeSelecionado}`, config);

            setSucessMessage(`Volume ${idVolumeSelecionado} deletado com sucesso!`);
            setTimeout(() => {
                setSucessMessage(null)
            }, 5000);

            try {
                await api.delete(`/volume/${idVolumeSelecionado}`, config);

                setSucessMessage(`Volume ${idVolumeSelecionado} deletado com sucesso!`);

                setContextDelete({ visible: false, x: 0, y: 0, selectedIdVolume: null });

                setTimeout(() => {
                    setSucessMessage(null);
                }, 5000);

                fetchVolumes();
                fetchProdutoSelecionado();
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Erro desconhecido ao deletar Volume...";
                setErrorMessage('ERRO AO DELETAR O VOLUME: ', errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            }

        } catch (error) {
            setErrorMessage('Erro ao deletar Volume Produto ( VOLUME PRODUTO NÃO FOI SALVO! )');

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        } finally {
            setContextLoading({ visible: false });

        }

    }

    const handleSubmit = (event) => {
        event.preventDefault();
        handleSalvarVolume();
    };

    const handleSubmitSubvolume = (event) => {
        event.preventDefault();
        handleSalvarSubVolume();
    };

    // ------------------------------------- ^VOLUMES^ ------------------------------------- //              

    // ------------------------------------- SUB VOLUMES ------------------------------------- //

    // SALVAR SUBVOLUME
    const handleSalvarSubVolume = async (e) => {
        e.preventDefault();

        setEstadoDaPagina('Salvando');
        setContextLoading({ visible: true });

        try {
            await api.post(`/subvolume`, formDataSubVolume, config);

            setSucessMessage('Subvolume adicionado com sucesso');

            setTimeout(() => setSucessMessage(null), 5000);

            fetchSubVolumes(salvarIdVolume.idVolume);
            fetchSubVolumesContexto(salvarIdVolume.idVolume);
            setFormDataSubVolume(
                {
                    id: {
                        idVolume: salvarIdVolume.idVolume,
                    },
                    descricao: "",
                    quantidade: ""
                }
            );

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao adicionar Subvolume";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);

        } finally {
            setContextLoading({ visible: false });
        }
    }

    // ATUALIZAR SUB VOLUME
    const handleSalvarEdicaoSubVolume = async (e) => {
        e.preventDefault();

        setEstadoDaPagina('Atualizando');
        setContextLoading({ visible: true });

        const idVolume = subVolumesIds.idVolume;
        const idSubVolume = subVolumesIds.idSubVolume;

        if (formDataEditarSubVolume.descricao === null) {
            setErrorMessage('Preencha o campo DESCRIÇÃO');
            return;
        } else if (formDataEditarSubVolume.quantidade === null) {
            setErrorMessage('Preencha o campo QUANTIDADE');
            return;
        }

        try {
            await api.put(`/subvolume/${idVolume}/${idSubVolume}`, formDataEditarSubVolume, config);

            setSucessMessage('Subvolume atualizado com sucesso');

            setTimeout(() => setSucessMessage(null), 5000);

            fetchSubVolumesContexto(salvarIdVolume.idVolume);
            setFormDataEditarSubVolume(
                {
                    id: {
                        idVolume: '',
                        idSubVolume: '',
                    },
                    descricao: "",
                    quantidade: ""
                }
            );

            fetchSubVolumes(idVolume);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao atualizar Subvolume";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);

        } finally {
            setContextLoading({ visible: false });
        }
    }


    // DELETANDO O SUB VOLUME
    const handleDeleteSubVolumeConfirm = async () => {

        setEstadoDaPagina("Excluindo");
        setContextLoading({ visible: true });

        const idVolume = subVolumesIds.idVolume;
        const idSubVolume = subVolumesIds.idSubVolume;
        const descricao = subVolumesIds.descricao;

        try {
            await api.delete(`/subvolume/${idVolume}/${idSubVolume}`, config);

            setSucessMessage(`Subvolume '${descricao}' deletado com sucesso!`);
            setContextDelete({ visible: false, x: 0, y: 0, selectedIdVolume: null });

            if (contextSubVolumes.visible === true) {
                fetchSubVolumesContexto(idVolume);
            } else (fetchSubVolumes(idVolume));

            setTimeout(() => {
                setSucessMessage(null)
            }, 5000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao deletar Subvolume";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
        }
    }


    // BUSCANDO OS SUBVOLUMES EXISTENTES PELO IDVOLUME
    const fetchSubVolumes = async (idVolume) => {
        setEstadoDaPagina("Carregando");
        setContextLoading({ visible: true });
        setLoading(true);

        try {
            const response = await api.get(`/subvolume/volume/${idVolume}`, config);
            setSubVolumesPorVolume(prevState => ({
                ...prevState,
                [idVolume]: response.data
            }));

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar Subvolumes";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
            setLoading(false);
        }
    }


    // BUSCAR OS SUBVOLUMES DO ITEM SELECIONADO PARA EXIBIR A LISTA NO OVERLAY DO CONTEXTO ADICIONAR SUBVOLUME
    const fetchSubVolumesContexto = async (idVolume) => {
        setEstadoDaPagina("Carregando");
        setContextLoading({ visible: true });

        try {
            const response = await api.get(`/subvolume/volume/${idVolume}`, config);
            setSubVolumeSelecionado(response.data);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar Subvolumes";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        } finally {
            setContextLoading({ visible: false });
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
                    idVolume: contextMenu.selectedIdVolume || subVolumesIds.idVolume,
                },
                descricao: "",
                quantidade: ""
            }
        );
        setContextMenuSubVolume({ visible: false });
        fetchSubVolumesContexto(salvarIdVolume.idVolume);
        setContextSubVolumes({
            visible: true,
            x: 0,
            y: 0,
            selectedIdVolume: contextMenu.selectedIdVolume
        });
        setEstadoSubVolumeOverlay('adicionar');
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
            [idVolume]: !prevState[idVolume]
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
            [idVolume]: false
        }));
    };


    const handleEditSubVolume = () => {
        setContextMenuSubVolume({
            visible: false,
            x: 0,
            y: 0,
            selectedIdVolume: null
        });
        setContextSubVolumes({
            visible: true,
            x: 0,
            y: 0,
            selectedIdVolume: contextMenu.selectedIdVolume
        });
        setFormDataEditarSubVolume(
            {
                id: {
                    idVolume: subVolumesIds.idVolume,
                    idSubVolume: subVolumesIds.idSubVolume
                },
                descricao: subVolumesIds.descricao,
                quantidade: subVolumesIds.quantidade
            }
        )
        setEstadoSubVolumeOverlay('editar');
        fetchSubVolumesContexto(salvarIdVolume.idVolume);
    }


    // AÇAO PARA QUANDO CLICAR NO BOTAO EXCLUIR VOLUME
    const handleDeleteSubVolume = (e) => {
        setContextMenuSubVolume({
            visible: false,
            x: 0,
            y: 0,
            selectedIdVolume: null
        });
        setContextDelete({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedIdVolume: contextMenuSubVolume.idVolume,
            selectedIdSubVolume: contextMenuSubVolume.idSubVolume
        })
        setEstadoExcluirOverlay('subvolume');
    }


    const handleRightClickSubVolume = (e, idVolume, idSubVolume, descricao, quantidade) => {
        e.preventDefault();
        setContextMenuSubVolume({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedIdVolume: idVolume,
            selectedIdSubVolume: idSubVolume
        });

        setSalvarIdVolume(prevState => {
            const newState = {
                idVolume: idVolume,
            };
            return newState;
        });

        // Usando callback para garantir que o estado seja atualizado corretamente
        setSubVolumesIds(prevState => {
            const newState = {
                idVolume: idVolume,
                idSubVolume: idSubVolume,
                descricao: descricao,
                quantidade: quantidade
            };
            return newState;
        });

    };


    // FUNÇAO PARA SALVAR O QUE ESTA SENDO DIGITADO NOS INPUTS DO PUT
    const handleChangeEdicao = (e) => {
        const { name, value } = e.target;
        setVolumeEdicao(prevState => ({
            ...prevState,
            [name]: value
        }));
    };







    // ------------------------------------- ^SUB VOLUMES^ ------------------------------------- //    

    // ------------------------------------- FUNÇÕES QR CODE ------------------------------------- //

    // QUANDO O SALVARIDVOLUME FOI ALTERADO, VAI CHAMAR ESTE useEFFECT PARA SETAR OS IDS USADOS NA REQUISIÇAO DO IDVOLUMEPRODUTO
    useEffect(() => {
        setSalvarIdsVolume({
            idVolumeProduto: '',
            idPackinglist: id,
            idProduto: idProduto,
            seq: seq,
            idVolume: salvarIdVolume.idVolume
        })
    }, [salvarIdVolume]);


    const gerarQrCode = async (e) => {
        e.preventDefault();
        const idVolume = salvarIdVolume.idVolume;

        try {
            navigate(`/exibir-qrcode/${idVolume}`);
        }
        catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao ir para a página 'Gerar QR Code'";
            setErrorMessage(errorMessage);
            setTimeout(() => setErrorMessage(null), 5000);
        }
    }




    // ------------------------------------- ^FUNÇÕES QR CODE^ ------------------------------------- //


    // ------------------------------------- FUNÇÕES PARALELAS ------------------------------------- //


    // PARTE DA FUNÇÃO PARA FECHAR OS CONTEXTOS AO CLICAR FORA DELES 
    useEffect(() => {
        if (overlayVisible || contextMenu.visible || contextEditar.visible || contextSubVolumes.visible || contextMenuSubVolume) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [overlayVisible, contextMenu, contextEditar, contextSubVolumes, contextMenuSubVolume]);


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




    // FUNÇAO PARA SALVAR O QUE ESTA SENDO DIGITADO NOS INPUTS DO SUBVOLUME
    const handleChangeSubVolume = (e) => {
        const { name, value } = e.target;
        setFormDataSubVolume(prevData => ({
            ...prevData,
            [name]: value
        }));
    }


    // FUNÇAO PARA SALVAR O QUE ESTA SENDO DIGITADO NOS INPUTS DO SUBVOLUME NA EDIÇAO
    const handleChangeEdicaoSubVolume = (e) => {
        const { name, value } = e.target;
        setFormDataEditarSubVolume(prevData => ({
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
                idTipoVolumeId: '16',
                quantidadeItens: '1',
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
            setSubVolumeSelecionado({})
            setFormDataSubVolume({});
        }
    }


    // AÇAO PARA QUANDO CLICAR COM O BOTAO DIREITO EM CIMA DE ALGUM ITEM
    const handleRightClick = async (e, idVolume, tipoDeVolume, quantidadeItens, descricao, altura, largura, comprimento, pesoLiquido, pesoBruto, observacao) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedIdVolume: idVolume
        });

        setSalvarIdVolume(prevState => {
            const newState = {
                idVolume: idVolume,
            };
            return newState;
        });

        setVolumeEdicao({
            idTipoVolumeId: tipoDeVolume,
            quantidadeItens: quantidadeItens,
            descricao: descricao,
            altura: altura,
            largura: largura,
            comprimento: comprimento,
            pesoLiquido: pesoLiquido,
            pesoBruto: pesoBruto,
            observacao: observacao,
        })

        await fetchTipoDeVolume(tipoDeVolume);

    };


    useEffect(() => {
        // Função para lidar com o pressionamento da tecla Enter

        if (overlayVisible === false) {
            const handleKeyDown = (event) => {
                if (event.key === 'ArrowUp') {
                    event.preventDefault(); // Impede o comportamento padrão do Enter
                    setOverlayVisible(true); // Abre o overlay
                }
            };

            // Adiciona o manipulador de eventos para o pressionamento da tecla
            document.addEventListener('keydown', handleKeyDown);

            // Remove o manipulador de eventos quando o componente for desmontado
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, []);






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
                                <div>Total Peso Líquido</div>
                                <div>Total Peso Bruto</div>
                            </li>

                            {loading ? (
                                <Box sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    backgroundColor: '#f5f5f5',
                                    padding: '20px',
                                    borderEndEndRadius: '10px',
                                    borderEndStartRadius: '10px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1);',
                                    animation: 'fadeIn 0.5s ease-in-out',
                                    width: '100%',
                                    textAlign: 'center'
                                }}>

                                    <Text
                                        text={'Buscando o produto...'}
                                    />
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    {produtoSelecionado && (
                                        <li key={id} className='li-listagem-produto-volume'>
                                            <div>{id}</div>
                                            <div>{produtoSelecionado.id.idProduto}</div>
                                            <div>{produtoSelecionado.id.seq}</div>
                                            <div>{produtoSelecionado.descricaoProduto}</div>
                                            <div>{produtoSelecionado.ordemProducao}</div>
                                            <div>{produtoSelecionado.totalPesoLiquido}</div>
                                            <div>{produtoSelecionado.totalPesoBruto}</div>
                                        </li>
                                    )}
                                </>
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
                                <div id="list-vol">Quantidade Itens</div>
                                <div id="list-vol">Descrição</div>
                                <div id="list-vol">Altura</div>
                                <div id="list-vol">Largura</div>
                                <div id="list-vol">Comprimento</div>
                                <div id="list-vol">Peso Líquido</div>
                                <div id="list-vol">Peso Bruto</div>
                                <div id="list-vol">Observação</div>
                            </li>

                            {loading ? (
                                <Box sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '20px',
                                    backgroundColor: '#f5f5f5',
                                    borderEndEndRadius: '10px',
                                    borderEndStartRadius: '10px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1);',
                                    animation: 'fadeIn 0.5s ease-in-out',
                                    width: '100%',
                                    textAlign: 'center'
                                }}>

                                    <Text
                                        text={'Buscando os volumes...'}
                                    />
                                    <CircularProgress />
                                </Box>
                            ) : (
                                <>
                                    {volumes.length > 0 ? (
                                        volumes.map((v) => (
                                            <li key={v.idVolume} className='li-listagem-volume'>
                                                <div id="container-list-vol">
                                                    <div id="list-vol-divs" onContextMenu={(e) => handleRightClick(e, v.idVolume, v.idTipoVolumeId,
                                                        v.quantidadeItens, v.descricao, v.altura, v.largura, v.comprimento, v.pesoLiquido, v.pesoBruto, v.observacao)}>
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
                                                    <div id="container-icon-plus" title='Exibir/Esconder subvolumes'>
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
                                                                    <div id="title-subvolumes-overlay">
                                                                        <h3>Subvolumes</h3>
                                                                        <Icon icon="fa6-solid:box-open" style={{ fontSize: '1.5em' }} />
                                                                    </div>
                                                                    <li className="header-produto-subvolume" id="grid-lista">
                                                                        <div id="lista-1">Descrição</div>
                                                                        <div id="lista-1">Quantidade</div>
                                                                    </li>

                                                                    {loading ? (
                                                                        <Box sx={{
                                                                            display: 'flex',
                                                                            gap: '10px',
                                                                            justifyContent: 'center',
                                                                            flexDirection: 'column',
                                                                            alignItems: 'center',
                                                                            padding: '20px',
                                                                            backgroundColor: '#f5f5f5',
                                                                            borderEndEndRadius: '10px',
                                                                            borderEndStartRadius: '10px',
                                                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1);',
                                                                            animation: 'fadeIn 0.5s ease-in-out',
                                                                            width: '100%',
                                                                            textAlign: 'center'
                                                                        }}>

                                                                            <Text
                                                                                text={'Buscando os volumes...'}
                                                                            />
                                                                            <CircularProgress />
                                                                        </Box>
                                                                    ) : (
                                                                        <>
                                                                            {subVolumesPorVolume[v.idVolume] && subVolumesPorVolume[v.idVolume].length > 0 ? (
                                                                                subVolumesPorVolume[v.idVolume].map((subVolume) => (
                                                                                    <li key={subVolume.id.idSubVolume} className='li-listagem-produto-subvolume' id="grid-lista"
                                                                                        onContextMenu={(e) => handleRightClickSubVolume(
                                                                                            e, subVolume.id.idVolume, subVolume.id.idSubVolume, subVolume.descricao, subVolume.quantidade
                                                                                        )}>
                                                                                        <div>{subVolume.descricao}</div>
                                                                                        <div>{subVolume.quantidade}</div>
                                                                                    </li>
                                                                                ))
                                                                            ) : (
                                                                                <div id="container-nao-existe-subvolume">
                                                                                    <div id="nao-existe-subvolume">
                                                                                        <li>Não há nada para exibir, adicione um subvolume...</li>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </>
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
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>


            {
                overlayVisible && (

                    <div className="overlay">
                        <div className="overlay-content" ref={overlayRef}>
                            <form onSubmit={handleSubmit}>
                                <div className="subcontainer-volume">
                                    <div className="container-input-adicionar-volume">
                                        <Title
                                            classname={'title-adicionar-volume'}
                                            text={'Adicionar um volume:'}
                                            color={'#1780e2'}
                                        />

                                        <div className="input-group-volume">
                                            <div>
                                                <label>Tipo de volume: *</label>
                                                <Autocomplete
                                                    data={getTipoDeVolumeArray()}
                                                    onSelect={handleAutocompleteChangeTipoVolume}
                                                    displayField={'descricao'}
                                                    title={'Digite o tipo de volume...'}
                                                />
                                            </div>
                                            <div>
                                                <label>Quantidade de itens: *</label>
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
                                                <label>Descrição: *</label>
                                                <Input
                                                    type={'text'}
                                                    name={'descricao'}
                                                    placeholder={'Descrição...'}
                                                    value={formDataVolume.descricao}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Peso Líquido: *</label>
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
                                                <label>Peso Bruto: *</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoBruto'}
                                                    min={'0'}
                                                    placeholder={'Peso bruto...'}
                                                    value={formDataVolume.pesoBruto}
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

                                    </div>
                                </div>
                                <div className="buttons-adicionar-volume">
                                    <Button
                                        className={'button-salvar-add-volume'}
                                        text={'SALVAR'}
                                        fontSize={15}
                                        padding={10}
                                        borderRadius={5}
                                        type={"submit"}
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
                            </form>
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
                                                <label>Tipo de volume: *</label>
                                                <Autocomplete
                                                    data={getTipoDeVolumeArray()}
                                                    onSelect={handleAutocompleteChangeTipoVolumeEdicao}
                                                    displayField={'descricao'}
                                                    title={'Pesquise por algum tipo de volume...'}
                                                    value={salvarTipoDeVolumeAtual}
                                                />
                                            </div>
                                            <div>
                                                <label>Quantidade de itens: *</label>
                                                <Input
                                                    type={'number'}
                                                    name={'quantidadeItens'}
                                                    min={'0'}
                                                    placeholder={'Quantidade de itens...'}
                                                    title={'Digite a quantidade de itens dentro do volume...'}
                                                    value={volumeEdicao.quantidadeItens}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Descrição: *</label>
                                                <Input
                                                    type={'text'}
                                                    name={'descricao'}
                                                    placeholder={'Descrição...'}
                                                    title={'Digite a descrição do volume...'}
                                                    value={volumeEdicao.descricao}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Peso Líquido: *</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoLiquido'}
                                                    min={'0'}
                                                    placeholder={'Peso líquido...'}
                                                    title={'Digite o peso líquido do volume...'}
                                                    value={volumeEdicao.pesoLiquido}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Peso Bruto: *</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoBruto'}
                                                    min={'0'}
                                                    placeholder={'Peso bruto...'}
                                                    title={'Digite o peso bruto do volume...'}
                                                    value={volumeEdicao.pesoBruto}
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
                                                    title={'Digite a altura do volume...'}
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
                                                    title={'Digite a largura do volume...'}
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
                                                    title={'Digite o comprimento do volume...'}
                                                    value={volumeEdicao.comprimento}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Observação:</label>
                                                <Input
                                                    type={'text'}
                                                    name={'observacao'}
                                                    placeholder={'Observação...'}
                                                    title={'Digite alguma observação sobre o volume...'}
                                                    value={volumeEdicao.observacao}
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
                contextSubVolumes.visible && (estadoSubVolumeOverlay === 'adicionar' || estadoSubVolumeOverlay === 'editar') && (
                    <div className="overlay">
                        <div className="overlay-content-subvolume" ref={contextSubVolumesRef}>
                            <form onSubmit={handleSubmitSubvolume}>
                                <div className="title-subvolume-lista">
                                    <Title
                                        text={estadoSubVolumeOverlay === 'adicionar' ? 'Adicionar Subvolumes' : 'Editar Subvolume'}
                                        color={'#1780e2'}
                                    />
                                </div>

                                <div className="subcontainer-subvolume">
                                    <div className="container-input-adicionar-subvolume">
                                        <div className="input-group-subvolume">

                                            <div className="container-input-subvolume">
                                                <div id="div-descricao-subvolume">
                                                    <label>Descrição:</label>
                                                    <Input
                                                        type={'text'}
                                                        placeholder={'Digite a descrição...'}
                                                        name={'descricao'}
                                                        title={'Digite uma descrição para o subvolume...'}
                                                        onChange={estadoSubVolumeOverlay === 'adicionar' ? handleChangeSubVolume : handleChangeEdicaoSubVolume}
                                                        value={estadoSubVolumeOverlay === 'adicionar' ? formDataSubVolume.descricao : formDataEditarSubVolume.descricao}
                                                    />


                                                </div>

                                                <div id="div-quantidade-subvolume">
                                                    <label>Quantidade:</label>
                                                    <Input
                                                        placeholder={'Digite a quantidade...'}
                                                        name={'quantidade'}
                                                        title={'Digite a quantidade de itens dentro do subvolume...'}
                                                        type={'number'}
                                                        min={'1'}
                                                        onChange={estadoSubVolumeOverlay === 'adicionar' ? handleChangeSubVolume : handleChangeEdicaoSubVolume}
                                                        value={estadoSubVolumeOverlay === 'adicionar' ? formDataSubVolume.quantidade : formDataEditarSubVolume.quantidade}
                                                    />

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="container-botoes-add-subvolumes">
                                    <Button
                                        className={'button-salvar-add-subvolume'}
                                        text={'SALVAR'}
                                        type={"submit"}
                                        fontSize={15}
                                        padding={10}
                                        borderRadius={5}
                                        onClick={estadoSubVolumeOverlay === 'adicionar' ? handleSalvarSubVolume : handleSalvarEdicaoSubVolume}
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
                            </form>

                            <div id="title-lista-subvolume">
                                <Text
                                    text={'Lista de Subvolumes'}
                                    fontSize={17}
                                />
                                <Icon icon="fa6-solid:box-open" style={{ fontSize: '1.5em' }} />

                            </div>

                            {estadoSubVolumeOverlay === 'adicionar' ? <div></div> :
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ width: '557px' }}>
                                        <Button
                                            className={'button-adicionar-subvolume'}
                                            text={'Adicionar Subvolume'}
                                            title={'Abrir tela de adição de subvolumes...'}
                                            padding={5}
                                            fontSize={10}
                                            borderRadius={2}
                                            onClick={handleSubVolumes}
                                        />
                                    </div>
                                </div>
                            }
                            <div id="listagem-subvolume-ovl">

                                <div className="lista-subvolume-overlay-ovl">
                                    <div className="ul-lista-subvolume-ovl">
                                        <ul>
                                            <li className="header-produto-subvolume-overlay" id="grid-lista">
                                                <div id="lista-1">ID Volume</div>
                                                <div id="lista-1">Descrição</div>
                                                <div id="lista-1">Quantidade</div>
                                            </li>
                                            {subVolumeSelecionado.length > 0 ? (
                                                subVolumeSelecionado.map((subVolume) => (
                                                    <li key={subVolume.id.idSubVolume} className='li-listagem-produto-subvolume-overlay' id="grid-lista"
                                                        onContextMenu={(e) => handleRightClickSubVolume(
                                                            e, subVolume.id.idVolume, subVolume.id.idSubVolume, subVolume.descricao, subVolume.quantidade
                                                        )}>
                                                        <div>{subVolume.id.idVolume}</div>
                                                        <div>{subVolume.descricao}</div>
                                                        <div>{subVolume.quantidade}</div>
                                                    </li>
                                                ))
                                            ) : (
                                                <div id="container-nao-existe-subvolume-ovl">
                                                    <div id="nao-existe-subvolume-ovl">
                                                        <li>Não há nada para exibir, adicione um subvolume...</li>
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
                    <div className='context-menu' style={{
                        top: `${contextMenu.y}px`, left: `${contextMenu.x}px`, width: '190px'
                    }} ref={contextMenuRef}>
                        <div id='container-icon-menu' onClick={handleEdit}>
                            <Icon icon="mdi:edit" id='icone-menu' />
                            <p>Editar</p>
                        </div>
                        <div id='container-icon-menu' onClick={handleSubVolumes} >
                            <Icon icon="ci:list-add" id='icone-menu' />
                            <p>Adicionar Subvolume</p>
                        </div>
                        <div id='container-icon-menu' onClick={gerarQrCode}>
                            <Icon icon="vaadin:qrcode" id='icone-menu' />
                            <p>Gerar QR Code</p>
                        </div>
                        <div id='container-icon-menu-excluir' onClick={handleDelete} >
                            <Icon icon="material-symbols:delete-outline" id='icone-menu' />
                            <p>Excluir</p>
                        </div>
                    </div>
                )}


            {
                contextMenuSubVolume.visible && (
                    <div className='context-menu' style={{
                        top: `${contextMenuSubVolume.y}px`, left: `${contextMenuSubVolume.x}px`, width: '230px'
                    }} ref={contextMenuSubVolumeRef}>
                        <div id='container-icon-menu' onClick={handleEditSubVolume}>
                            <Icon icon="mdi:edit" id='icone-menu' />
                            <p>Editar Subvolume</p>
                        </div>
                        <div id='container-icon-menu' onClick={handleSubVolumes} >
                            <Icon icon="ci:list-add" id='icone-menu' />
                            <p>Adicionar Subvolume</p>
                        </div>
                        <div id='container-icon-menu-excluir' onClick={handleDeleteSubVolume} >
                            <Icon icon="material-symbols:delete-outline" id='icone-menu' />
                            <p>Excluir Subvolume</p>
                        </div>
                    </div>
                )
            }




            {
                contextDelete.visible && (estadoExcluirOverlay === 'volume' || estadoExcluirOverlay === 'subvolume') && (
                    <>
                        <div className="overlay"></div>
                        <div className="context-delete">
                            <div>
                                <Text
                                    text={estadoExcluirOverlay === 'volume' ? 'Tem certeza que deseja excluir o Volume?' : `Tem certeza que deseja excluir o Subvolume '${subVolumesIds.descricao}' ?`}
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
                                    onClick={estadoExcluirOverlay === 'volume' ? handleDeleteConfirm : handleDeleteSubVolumeConfirm}
                                />
                            </div>
                        </div>
                    </>
                )
            }

            {contextLoading.visible ? (
                <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : estadoDaPagina === "Atualizando" ? "Atualizando..." : estadoDaPagina === "Salvando" ? "Salvando..." : "Excluindo..."} />
            ) : (
                <></>
            )}

        </div >
    );
}

export default Volume;