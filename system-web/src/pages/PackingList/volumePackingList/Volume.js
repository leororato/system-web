import { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import './Volume.css';
import axios from "axios";
import Button from "../../../components/Button";
import Title from "../../../components/Title";
import Text from "../../../components/Text";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import Input from "../../../components/Input";

function Volume() {
    const { id, idProduto, seq } = useParams();
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    const [volumes, setVolumes] = useState([]);

    const [filteredVolumes, setFilteredVolumes] = useState([]);
    const [buscarTipoDeVolume, setBuscarTipoDeVolume] = useState([]);

    const [botaoAdicionarVolume, setBotaoAdicionarVolume] = useState({ visible: true });
    const [contextAdicionarVolume, setContextAdicionarVolume] = useState({ visible: false });

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
    })




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
    }, [id, idProduto, seq]);


    useEffect(() => {
        const fetchTipoDeVolume = async () => {
            try {

                const response = await axios.get(`http://localhost:8080/api/tipo-de-volume/${volumes.idTipoVolumeId}`);

            } catch ( error ) {

                console.error("Erro ao buscar tipo de volume: ", error);
            
            }
        }

        fetchTipoDeVolume();
    }, [])



    const handleAddVolume = () => {
        setContextAdicionarVolume({ visible: true });
        setBotaoAdicionarVolume({ visible: false });
    }

    const handleCancelAddVolume = () => {
        setContextAdicionarVolume({ visible: false });
        setBotaoAdicionarVolume({ visible: true });
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDataVolume(prevData => ({
            ...prevData,
            [name]: value
        }));
    }


    return (
        <div className="volume-container">
            <Header />

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
                    {botaoAdicionarVolume.visible && (
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
                    )}

                    {contextAdicionarVolume.visible && (
                        <div className="container-adicionar-volume">
                            <Title
                                classname={'title-adicionar-volume'}
                                text={'Adicionar um volume:'}
                            />
                            <div className="subcontainer-volume">
                                <div className="container-input-adicionar-volume">

                                    <div className="grid-volume-1">
                                    <div id="div-tipo-de-volume">
                                        <Text
                                            text={'Tipo de Volume:'}
                                        />
                                        <Input />
                                    </div>

                                    <div id="div-quantidade-itens">
                                        <Text
                                            text={'Quantidade de Itens:'}
                                        />
                                        <Input
                                            type={'number'}
                                            placeholder={'Quantidade de itens...'}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div id="div-descricao">
                                        <Text
                                            text={'Descrição:'}
                                        />
                                        <Input
                                            type={'text'}
                                            placeholder={'Descrição...'}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div id="div-altura">
                                        <Text
                                            text={'Altura:'}
                                        />
                                        <Input
                                            type={'text'}
                                            placeholder={'Altura...'}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div id="div-largura">
                                        <Text
                                            text={'Largura:'}
                                        />
                                        <Input
                                            type={'text'}
                                            placeholder={'Largura...'}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    </div>

                                    <div className="grid-volume-2">
                                    <div id="div-comprimento">
                                        <Text
                                            text={'Comprimento:'}
                                        />
                                        <Input
                                            type={'text'}
                                            placeholder={'Comprimento...'}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div id="div-peso-liquido">
                                        <Text
                                            text={'Peso Líquido:'}
                                        />
                                        <Input
                                            type={'number'}
                                            placeholder={'Peso líquido...'}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div id="div-peso-bruto">
                                        <Text
                                            text={'Peso Bruto:'}
                                        />
                                        <Input
                                            type={'number'}
                                            placeholder={'Peso bruto...'}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div id="div-observacao">
                                        <Text
                                            text={'Observação:'}
                                        />
                                        <Input
                                            type={'text'}
                                            placeholder={'Observação...'}
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
                                    <li key={v.idVolume}>
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
                    </div>

                </div>
            </div>







        </div>


    )
}
export default Volume;
