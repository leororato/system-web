import { useEffect, useState, useRef } from "react";
import Header from "../../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import './Volume.css';
import axios from "axios";
import Button from "../../../components/Button";
import Title from "../../../components/Title";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import Input from "../../../components/Input";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";

function Volume() {

    const { id, idProduto, seq } = useParams();

    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    const contextMenuRef = useRef(null);

    const [errorMessage, setErrorMessage] = useState(null);
    const [sucessMessage, setSucessMessage] = useState(null);

    const [contextMenu, setContextMenu] = useState({ visible: false, selectedIdVolume: '' });
    const [salvarIdVolume, setSalvarIdVolume] = useState('');
    const [salvarTipoDeVolumeAtual, setSalvarTipoDeVolumeAtual] = useState('');

    const [contextEditar, setContextEditar] = useState({ visible: false });
    const contextEditarRef = useRef(null);

    const [overlayVisible, setOverlayVisible] = useState(false);
    const overlayRef = useRef(null);

    const [atualizarEstado, setAtualizarEstado] = useState(0);
    const [atualizarEstadoEdicao, setAtualizarEstadoEdicao] = useState(0);

    const [volumes, setVolumes] = useState([]);
    const [volumeEdicao, setVolumeEdicao] = useState([]);
    const [tiposDeVolume, setTiposDeVolume] = useState([]);

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
                const response = await axios.get(`http://localhost:8080/api/volume`);
                setVolumes(response.data);
            } catch (error) {
                console.error("Erro ao carregar os volumes: ", error);
            }
        }

        fetchProdutoSelecionado();
        fetchVolumes();
    }, [id, idProduto, seq, atualizarEstado]);

    useEffect(() => {
        const fetchTipoDeVolume = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tipo-de-volume`);
                setTiposDeVolume(response.data);
            } catch (error) {
                console.error("Erro ao buscar tipo de volume: ", error);
            }
        }
        fetchTipoDeVolume();
    }, []);

    useEffect(() => {
        const fetchProdutoEdicao = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/volume/${salvarIdVolume})}`);
                setVolumeEdicao(response.data);
                console.log(volumeEdicao);
            } catch (error) {
                console.error('Erro: ', error);
            }
        }

        const fetchTipoDeVolume = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/tipo-de-volume/${volumeEdicao.idTipoVolumeId}`)
                setSalvarTipoDeVolumeAtual(response.data.descricao);
            } catch (error) {
                console.error("Erro ao buscar tipo de volume: ", error);
            }
        }

        fetchProdutoEdicao();
        fetchTipoDeVolume();

    }, [atualizarEstadoEdicao])

    const handleSalvarVolume = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8080/api/volume`, formDataVolume)
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

                setOverlayVisible(false);
                setSucessMessage('Volume adicionado com sucesso!');
                setTimeout(() => setSucessMessage(null), 5000);
                setAtualizarEstado(atualizarEstado + 1);
            })
            .catch(error => {
                const errorMessage = error.response?.data || "Erro desconhecido ao adicionar Volume";
                setErrorMessage(errorMessage);
                setTimeout(() => setErrorMessage(null), 5000);
                console.error('Erro ao adicionar o volume: ', error);
            });
    }

    const handleAtualizarVolume = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8080/api/volume`, formDataVolume)
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

                setContextEditar({ visible: false });
                setSucessMessage('Volume atualizado com sucesso!');
                setTimeout(() => setSucessMessage(null), 5000);
                setAtualizarEstado(atualizarEstado + 1);
            })
            .catch(error => {
                const errorMessage = error.response?.data || "Erro desconhecido ao atualizar Volume";
                setErrorMessage(errorMessage);
                setTimeout(() => setErrorMessage(null), 5000);
                console.error('Erro ao atualizar o volume: ', error);
            });
    }

    useEffect(() => {
        if (overlayVisible || contextMenu.visible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [overlayVisible, contextMenu.visible]);


    const closeMessages = () => {
        setErrorMessage(null);
        setSucessMessage(null);
    }

    const handleAddVolume = () => {
        setOverlayVisible(true);
    }

    const handleCancelAddVolume = () => {
        setOverlayVisible(false);
        setContextEditar({ visible: false })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataVolume(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleAutocompleteChangeTipoVolume = (item) => {
        setFormDataVolume(prevData => ({
            ...prevData,
            idTipoVolumeId: item.idTipoVolume
        }));
    };

    const handleClickOutside = (event) => {
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
            setOverlayVisible(false);
        }

        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
            setContextMenu({ visible: false, selectedIdVolume: '' });
        }
    }


    const handleRightClick = (e, idVolume) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            selectedIdVolume: idVolume
        });

        setSalvarIdVolume(`${idVolume}`);
    }

    useEffect(() => {
        console.log('ID do volume salvo:', salvarIdVolume);
        console.log('volume edicao:', volumeEdicao);
    }, [salvarIdVolume, volumeEdicao]);
    

    const handleEdit = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedIdVolume: null
        });
        setContextEditar({ visible: true })
        setAtualizarEstadoEdicao(atualizarEstadoEdicao + 1);
    }

    const handleDelete = () => {
        setContextMenu({
            visible: false,
            x: 0,
            y: 0,
            selectedIdVolume: null
        })
    }

    return (
        <div className="volume-container">
            <Header />
            <SucessNotification message={sucessMessage} onClose={closeMessages} id="message" />
            <ErrorNotification message={errorMessage} onClose={closeMessages} id="message" />
            <div>
                <div className='container-listagem-produto-volume'>
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


            <div className="volume-container-volume">
                <div className="lista-volume">
                    <div className="container-button-adicionar-volume">
                        <Button
                            className={'button-adicionar-volume'}
                            text={'Adicionar Volume'}
                            padding={10}
                            fontSize={15}
                            borderRadius={5}
                            onClick={handleAddVolume}
                        />
                    </div>
                    {overlayVisible && (
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
                                                <div id="div-tipo-de-volume">
                                                    <label>Tipo de volume:</label>
                                                    <Autocomplete
                                                        data={tiposDeVolume}
                                                        onSelect={handleAutocompleteChangeTipoVolume}
                                                        displayField={'descricao'}
                                                    />
                                                </div>
                                                <div id="div-quantidade-itens">
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
                                                <div id="div-descricao">
                                                    <label>Descrição:</label>
                                                    <Input
                                                        type={'text'}
                                                        name={'descricao'}
                                                        placeholder={'Descrição...'}
                                                        value={formDataVolume.descricao}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div id="div-altura">
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
                                                <div id="div-largura">
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
                                                <div id="div-peso-liquido">
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
                                                <div id="div-peso-bruto">
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
                    )}
                    <div className="ul-lista-volume">
                        <ul>
                            <li id="header-lista-volume">
                                <div>ID Volume</div>
                                <div>Tipo do Volume</div>
                                <div>Quantidade de Itens</div>
                                <div>Descrição</div>
                                <div>Altura</div>
                                <div>Largura</div>
                                <div>Comprimento</div>
                                <div>Peso Líquido</div>
                                <div>Peso Bruto</div>
                                <div>Observação</div>
                            </li>
                            {volumes.length > 0 ? (
                                volumes.map((v) => (
                                    <li key={v.idVolume} onContextMenu={(e) => handleRightClick(e, v.idVolume)} className="li-listagem-volume">
                                        <div>{v.idVolume}</div>
                                        <div>{v.idTipoVolumeId}</div>
                                        <div>{v.quantidadeItens}</div>
                                        <div>{v.descricao}</div>
                                        <div>{v.altura}</div>
                                        <div>{v.largura}</div>
                                        <div>{v.comprimento}</div>
                                        <div>{v.pesoLiquido}</div>
                                        <div>{v.pesoBruto}</div>
                                        <div>{v.observacao}</div>
                                    </li>
                                ))
                            ) : (
                                <li>Nenhum volume encontrado...</li>
                            )}
                        </ul>

                        {contextMenu.visible && (
                            <div
                                className="context-menu"
                                style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                            >
                                <button onClick={handleEdit}>Editar</button>
                                <button onClick={handleDelete}>Excluir</button>
                            </div>
                        )}

                        {contextEditar.visible && (
                        <div className="overlay">
                            <div className="overlay-content" ref={overlayRef}>
                                <Title
                                    classname={'title-adicionar-volume'}
                                    text={'Editar o volume:'}
                                    color={'#1780e2'}
                                />
                                <div className="subcontainer-volume">
                                    <div className="container-input-adicionar-volume">
                                        <form>
                                            <div className="input-group-volume">
                                                <div id="div-tipo-de-volume">
                                                    <label>Tipo de volume: Atual: {salvarTipoDeVolumeAtual}</label>
                                                    <Autocomplete
                                                        data={tiposDeVolume}
                                                        onSelect={handleAutocompleteChangeTipoVolume}
                                                        displayField={'descricao'}
                                                        
                                                    />
                                                </div>
                                                <div id="div-quantidade-itens">
                                                    <label>Quantidade de itens:</label>
                                                    <Input
                                                        type={'number'}
                                                        name={'quantidadeItens'}
                                                        min={'0'}
                                                        placeholder={'Quantidade de itens...'}
                                                        value={volumeEdicao.quantidadeItens}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div id="div-descricao">
                                                    <label>Descrição:</label>
                                                    <Input
                                                        type={'text'}
                                                        name={'descricao'}
                                                        placeholder={'Descrição...'}
                                                        value={volumeEdicao.descricao}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div id="div-altura">
                                                    <label>Altura:</label>
                                                    <Input
                                                        type={'number'}
                                                        name={'altura'}
                                                        min={'0'}
                                                        placeholder={'Altura...'}
                                                        value={volumeEdicao.altura}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div id="div-largura">
                                                    <label>Largura:</label>
                                                    <Input
                                                        type={'number'}
                                                        name={'largura'}
                                                        min={'0'}
                                                        placeholder={'Largura...'}
                                                        value={volumeEdicao.largura}
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
                                                        value={volumeEdicao.comprimento || ''}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div id="div-peso-liquido">
                                                    <label>Peso Líquido:</label>
                                                    <Input
                                                        type={'number'}
                                                        name={'pesoLiquido'}
                                                        min={'0'}
                                                        placeholder={'Peso líquido...'}
                                                        value={volumeEdicao.pesoLiquido}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div id="div-peso-bruto">
                                                    <label>Peso Bruto:</label>
                                                    <Input
                                                        type={'number'}
                                                        name={'pesoBruto'}
                                                        min={'0'}
                                                        placeholder={'Peso bruto...'}
                                                        value={volumeEdicao.pesoBruto}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div id="div-observacao">
                                                    <label>Observação:</label>
                                                    <Input
                                                        type={'text'}
                                                        name={'observacao'}
                                                        placeholder={'Observação...'}
                                                        value={volumeEdicao.observacao || ''}
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
                    )}



                    </div>


                </div>
            </div>
        </div>
    );
}

export default Volume;