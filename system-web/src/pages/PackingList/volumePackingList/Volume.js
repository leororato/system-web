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
import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, CircularProgress } from "@mui/material";
import Cookies from 'js-cookie';
import api from '../../../axiosConfig';
import Loading from "../../../components/Loading/Loading";
import ExcluirItemSegundoFator from "../../../components/ExcluirItemSegundoFator/ExcluirItemSegundoFator";
import ExcluirItem from "../../../components/ExcluirItem/ExcluirItem";



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

    const [inputDeleteSegundoFator, setInputDeleteSegundoFator] = useState("");

    const [contextDeleteSegundoFator, setContextDeleteSegundoFator] = useState({ visible: false, x: 0, y: 0, selectedId: null, selectedSeq: null });

    const [contextDeleteCheckbox, setContextDeleteCheckbox] = useState({ visible: false, x: 0, y: 0 })

    const [contextMenu, setContextMenu] = useState({ visible: false, selectedIdVolume: '' });

    const [contextBotaoExcluirVolumes, setContextBotaoExcluirVolume] = useState(false);

    const [buscaVolume, setBuscaVolume] = useState('');

    const [filteredVolumes, setFilteredVolumes] = useState([]);

    // CARREGA O VALOR O IDVOLUME QUANDO CLICA EM CIMA DE ALGUM ITEM
    const [salvarIdVolume, setSalvarIdVolume] = useState('');

    // CONTAINER QUE POSSUI TODOS OS VOLUMES
    const [volumes, setVolumes] = useState([]);

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

    const [volumesCheckeds, setVolumesCheckeds] = useState([]);
    const [todosVolumesCheckeds, setTodosVolumesCheckeds] = useState(false);
    const [permissaoSegundoFator, setPermissaoSegundoFator] = useState("semPermissao");


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
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao carregar o produto selecionado";
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
            const response = await api.get(`/volume/listar-volumes/${id}/${idProduto}/${seq}`, config);

            if (response.data && Array.isArray(response.data)) {
                setVolumes(response.data);

            } else {
                setVolumes([]);
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao carregar volumes";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

            setVolumes([]);

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
    const handleCancelAddAndEditVolume = () => {
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
            await api.delete(`/volume/${idVolumeSelecionado}`, config);

            setSucessMessage(`Volume ${idVolumeSelecionado} deletado com sucesso!`);

            setContextDelete({ visible: false, x: 0, y: 0, selectedIdVolume: null });

            setTimeout(() => {
                setSucessMessage(null);
            }, 5000);

            fetchVolumes();
            fetchProdutoSelecionado();
        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao deletar Volume...";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
        }

    }

    const handleDeletarVolumesCheckbox = (e) => {
        setContextDeleteCheckbox({
            visible: true,
            x: e.pageX,
            y: e.pageY
        })
    }

    const handleDeleteSegundoFator = (e) => {
        deleteVolumesCheckeds(e);
        setContextDeleteCheckbox({ visible: false });
    }

    const deleteVolumesCheckeds = async (e) => {
        setEstadoDaPagina("Carregando");
        setContextLoading({ visible: true });

        try {
            await api.delete(`/volume/deletar-itens-checkbox/${permissaoSegundoFator}`, {
                data: volumesCheckeds,
                ...config
            });

            setSucessMessage(volumesCheckeds.length > 1 ? `Volumes excluídos com sucesso!` : `Volume excluído com sucesso!`);

            setTimeout(() => {
                setSucessMessage(null);
            }, 5000);

            setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
            await fetchVolumes();
            await fetchProdutoSelecionado();

            setPermissaoSegundoFator("semPermissao");

        } catch (error) {
            if (error.response?.status === 409) {
                setContextDeleteCheckbox({ visible: false });
                setContextDeleteSegundoFator({
                    visible: true,
                    x: e.pageX,
                    y: e.pageY
                });
                const errorMessage = error.response?.data || "Erro desconhecido ao excluir Produto";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
            } else {
                const errorMessage = error.response?.data || "Erro desconhecido ao excluir volumes";
                setErrorMessage(errorMessage);
                setTimeout(() => setErrorMessage(null), 5000);
            }
        } finally {
            setContextLoading({ visible: false });
        }
    }


    const handleDeleteConfirmSegundoFator = async (e) => {
        e.preventDefault();
        setEstadoDaPagina("Excluindo");
        setContextLoading({ visible: true });

        const permissaoParaExcluir = (inputDeleteSegundoFator === "Excluir") ? "comPermissao" : "semPermissao";

        try {
            await api.delete(`/volume/deletar-itens-checkbox/${permissaoParaExcluir}`, {
                data: volumesCheckeds,
                ...config
            });

            setSucessMessage("Produtos excluídos com sucesso!");

            setTimeout(() => {
                setSucessMessage(null);
            }, 5000);

            setPermissaoSegundoFator("semPermissao");
            setContextDelete({ visible: false, x: 0, y: 0, selectedId: null });
            await fetchVolumes();
            await fetchProdutoSelecionado();
            setContextDeleteSegundoFator({ visible: false });

        } catch (error) {

            if (inputDeleteSegundoFator !== "Excluir") {
                const errorMessage = "Confirmação inválida, digite a palavra corretamente";
                setErrorMessage(errorMessage)
            } else {
                const errorMessage = error.response?.data || "Erro desconhecido ao excluir volumes";
                setErrorMessage(errorMessage);
            }
            setTimeout(() => setErrorMessage(null), 5000);
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


    useEffect(() => {
        const filteredVolumes = volumes.filter(p =>
            (p.descricao ? p.descricao.toLowerCase() : '').includes(buscaVolume.toLowerCase())
        );
        setFilteredVolumes(filteredVolumes);
    }, [buscaVolume, volumes]);


    const handleCheckbox = (idVolume) => {
        setVolumesCheckeds(prevState => {
            const isChecked = prevState.includes(idVolume);
            if (isChecked) {
                return prevState.filter(volume => volume !== idVolume);
            } else {
                return [...prevState, idVolume];
            }
        });
    };

    const gerenciarCheckboxTodosVolumes = () => {
        if (!todosVolumesCheckeds) {
            setTodosVolumesCheckeds(true);
        } else {
            setTodosVolumesCheckeds(false);
        }
    }

    useEffect(() => {
        const handleAllCheckBox = () => {

            setVolumesCheckeds([]);

            if (todosVolumesCheckeds) {

                filteredVolumes.forEach(volume => {
                    handleCheckbox(volume.idVolume);
                });

            } else {
                setVolumesCheckeds([]);
            }
        }

        handleAllCheckBox();

    }, [todosVolumesCheckeds]);



    useEffect(() => {

        if (volumesCheckeds.length <= 0) {
            setContextBotaoExcluirVolume(false);
        } else {
            setContextBotaoExcluirVolume(true);
        }
    }, [volumesCheckeds]);


    const handleChangeInputSegundoFator = (e) => {
        setInputDeleteSegundoFator(e.target.value);
    }

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
    const handleCancelAddAndEditSubvolume = () => {
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
    const handleRightClick = async (e, idVolume, idTipoDeVolume, nomeTipoVolume, quantidadeItens, descricao, altura, largura, comprimento, pesoLiquido, pesoBruto, observacao) => {
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
            idTipoVolumeId: idTipoDeVolume,
            nomeTipoVolume: nomeTipoVolume,
            quantidadeItens: quantidadeItens,
            descricao: descricao,
            altura: altura,
            largura: largura,
            comprimento: comprimento,
            pesoLiquido: pesoLiquido,
            pesoBruto: pesoBruto,
            observacao: observacao,
        })

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

                    <div id="container-botao-add-busca-volume" >
                        <div title="Não há volumes selecionados para a exclusão" className={contextBotaoExcluirVolumes ? "container-botao-excluir-volume" : "container-botao-excluir-volume-false"} onClick={contextBotaoExcluirVolumes ? (e) => handleDeletarVolumesCheckbox(e) : null}>
                            <Icon icon="material-symbols:delete-outline" id='icone-menu' />
                            <Button
                                className={"button-excluir-volume"}
                                text={'Excluir'}
                                onClick={contextBotaoExcluirVolumes ? (e) => handleDeletarVolumesCheckbox(e) : null}
                            />
                        </div>
                        <div id="subcontainer-botao-add-busca-volume">
                            <div className='busca-descricao-input'>
                                <Input
                                    type={'text'}
                                    placeholder={'Descrição'}
                                    title={'Pesquise pela Descrição do volume...'}
                                    value={buscaVolume}
                                    onChange={(e) => setBuscaVolume(e.target.value)}
                                />
                            </div>
                            <div>
                                <Button
                                    className={'button-adicionar-volume'}
                                    text={'Adicionar Volume'}
                                    padding={10}
                                    borderRadius={3}
                                    onClick={handleAddVolume}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='container-listagem-volume'>
                        <ul>
                            <li className="header-volume">
                                <div style={{ width: '40px' }}>
                                    <input type="checkbox" style={{ marginRight: '10px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onChange={gerenciarCheckboxTodosVolumes} />
                                </div>
                                <div id="list-vol">ID Volume</div>
                                <div id="list-vol">Tipo do Volume</div>
                                <div id="list-vol">Quantidade Itens</div>
                                <div id="list-vol">Descrição</div>
                                <div id="list-vol">Altura (cm)</div>
                                <div id="list-vol">Largura (cm)</div>
                                <div id="list-vol">Comprimento (cm)</div>
                                <div id="list-vol">Peso Líquido Unitário</div>
                                <div id="list-vol">Peso Bruto Unitário</div>
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
                                    {filteredVolumes && filteredVolumes.length > 0 ? (
                                        filteredVolumes.map((v) => (
                                            <li key={v.idVolume} className='li-listagem-volume'>
                                                <div id="container-list-vol">

                                                    <div className="checkbox-volumes" style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <input
                                                            style={{ marginRight: '13px', width: '15px', height: '15px' }}
                                                            type="checkbox"
                                                            checked={volumesCheckeds.includes(v.idVolume)}
                                                            onChange={() => handleCheckbox(v.idVolume)}
                                                        />
                                                    </div>


                                                    <div id="list-vol-divs" onContextMenu={(e) => handleRightClick(e, v.idVolume, v.idTipoVolumeId, v.nomeTipoVolume,
                                                        v.quantidadeItens, v.descricao, v.altura, v.largura, v.comprimento, v.pesoLiquido, v.pesoBruto, v.observacao)}>
                                                        <div id="list-vol">{v.idVolume}</div>
                                                        <div id="list-vol">{v.nomeTipoVolume}</div>
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
                                    <div>
                                        <div className="container-icone-fechar"><Icon icon="ep:close-bold" id="icone-fechar-criacao-tipo-volume" onClick={handleCancelAddAndEditVolume} /></div>
                                    </div>
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
                                                <label>Peso Líquido Unitário: *</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoLiquido'}
                                                    min={'0'}
                                                    placeholder={'Peso líquido unitário...'}
                                                    value={formDataVolume.pesoLiquido}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Peso Bruto Unitário: *</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoBruto'}
                                                    min={'0'}
                                                    placeholder={'Peso bruto unitário...'}
                                                    value={formDataVolume.pesoBruto}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label>Altura (cm):</label>
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
                                                <label>Largura (cm):</label>
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
                                                <label>Comprimento (cm):</label>
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
                                        className={'botao-salvar'}
                                        text={'SALVAR'}
                                        fontSize={15}
                                        padding={10}
                                        borderRadius={5}
                                        type={"submit"}
                                        onClick={handleSalvarVolume}
                                    />
                                    <Button
                                        className={'botao-cancelar'}
                                        text={'CANCELAR'}
                                        fontSize={15}
                                        padding={10}
                                        borderRadius={5}
                                        onClick={handleCancelAddAndEditVolume}
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

                            <div>
                                <div className="container-icone-fechar"><Icon icon="ep:close-bold" id="icone-fechar-criacao-tipo-volume" onClick={handleCancelAddAndEditVolume} /></div>
                            </div>
                            <div>
                                <Title
                                    classname={'title-adicionar-volume'}
                                    text={'Editar o volume:'}
                                    color={'#1780e2'}
                                />
                            </div>
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
                                                    value={volumeEdicao.nomeTipoVolume}
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
                                                <label>Peso Líquido Unitário: *</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoLiquido'}
                                                    min={'0'}
                                                    placeholder={'Peso líquido unitário...'}
                                                    title={'Digite o peso líquido de cada unidade do volume...'}
                                                    value={volumeEdicao.pesoLiquido}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Peso Bruto Unitário: *</label>
                                                <Input
                                                    type={'number'}
                                                    name={'pesoBruto'}
                                                    min={'0'}
                                                    placeholder={'Peso bruto unitário...'}
                                                    title={'Digite o peso bruto de cada unidade do volume...'}
                                                    value={volumeEdicao.pesoBruto}
                                                    onChange={handleChangeEdicao}
                                                />
                                            </div>
                                            <div>
                                                <label>Altura (cm):</label>
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
                                                <label>Largura (cm):</label>
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
                                                <label>Comprimento (cm):</label>
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
                                    className={'botao-salvar'}
                                    text={'SALVAR'}
                                    fontSize={15}
                                    padding={10}
                                    borderRadius={5}
                                    onClick={handleAtualizarVolume}
                                />
                                <Button
                                    className={'botao-cancelar'}
                                    text={'CANCELAR'}
                                    fontSize={15}
                                    padding={10}
                                    borderRadius={5}
                                    onClick={handleCancelAddAndEditVolume}
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
                                <div>
                                    <div className="container-icone-fechar"><Icon icon="ep:close-bold" id="icone-fechar-criacao-tipo-volume" onClick={handleCancelAddAndEditSubvolume} /></div>
                                </div>
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
                                        className={'botao-salvar'}
                                        text={'SALVAR'}
                                        type={"submit"}
                                        fontSize={15}
                                        padding={10}
                                        borderRadius={5}
                                        onClick={estadoSubVolumeOverlay === 'adicionar' ? handleSalvarSubVolume : handleSalvarEdicaoSubVolume}
                                    />

                                    <Button
                                        className={'botao-cancelar'}
                                        text={'CANCELAR'}
                                        fontSize={15}
                                        padding={10}
                                        borderRadius={5}
                                        onClick={handleCancelAddAndEditSubvolume}
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
                        <ExcluirItem 
                            descricao={estadoExcluirOverlay === 'volume' ? 'Tem certeza que deseja excluir o Volume?' : `Tem certeza que deseja excluir o Subvolume '${subVolumesIds.descricao}' ?`}
                            onClickBotaoCancelar={() => { setContextDelete({ visible: false }); }}
                            onClickBotaoExcluir={estadoExcluirOverlay === 'volume' ? handleDeleteConfirm : handleDeleteSubVolumeConfirm}
                        />
                    </>
                )
            }


            {contextDeleteCheckbox.visible && (
                <>
                    <ExcluirItem
                        descricao={volumesCheckeds.length > 1 ? 'Tem certeza que deseja excluir esses volumes?' : 'Tem certeza que deseja excluir esse volume?'}
                        onClickBotaoCancelar={() => setContextDeleteCheckbox({ visible: false })}
                        onClickBotaoExcluir={(e) => handleDeleteSegundoFator(e)}
                    />
                </>
            )}


            {contextDeleteSegundoFator.visible && (
                <>
                    <ExcluirItemSegundoFator
                        onSubmit={handleDeleteConfirmSegundoFator}
                        descricao={volumesCheckeds.length > 1 ? 'Existe algum volume com subvolume, caso deseje continuar a exclusão digite a palavra "Excluir" no campo abaixo:' : 'O volume selecionado possui subvolume(s), caso deseje continuar com a exclusão digite "Excluir" no campo abaixo:'}
                        onChange={handleChangeInputSegundoFator}
                        onClickBotaoCancelar={() => { setContextDeleteSegundoFator({ visible: false }); }}
                        onClickBotaoExcluir={handleDeleteConfirmSegundoFator}
                    />
                </>
            )}



            {contextLoading.visible ? (
                <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : estadoDaPagina === "Atualizando" ? "Atualizando..." : estadoDaPagina === "Salvando" ? "Salvando..." : "Excluindo..."} />
            ) : (
                <></>
            )}

        </div >
    );
}

export default Volume;