import { useEffect, useState } from "react";
import api from "../../../axiosConfig";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header/Header";
import { Box, CircularProgress } from "@mui/material";
import Text from "../../../components/Text";
import './ExibirColetas.css';
import { format } from "date-fns";
import Loading from "../../../components/Loading/Loading";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import Input from "../../../components/Input";

function ExibirColetas() {

    const [contextLoading, setContextLoading] = useState({ visible: false });
    const [errorMessage, setErrorMessage] = useState(null);
    const [estadoDoLoading, setEstadoDoLoading] = useState("Carregando");

    const [coletas, setColetas] = useState([]);
    const [filteredColetas, setFilteredColetas] = useState([]);
    const { idPackinglist, idProduto, seq } = useParams();
    const [loading, setLoading] = useState(false);
    // 0 == nenhum --- 1 == packinglist --- 2 == produto
    const [estadoDaPagina, setEstadoDaPagina] = useState(0);
    const [nomeTitulo, setNomeTitulo] = useState("Não encontrado");
    const [nomeCliente, setNomeCliente] = useState("Não encontrado");

    const [buscaDescricao, setBuscaDescricao] = useState("");

    useEffect(() => {
        const verificarEstadoDaPagina = async () => {
            try {
                setEstadoDoLoading("Carregando")
                setContextLoading({ visible: true });

                if (idPackinglist && !idProduto && !seq) {
                    setEstadoDaPagina(1);
                    const response = await api.get(`/coletas/buscar-coletas-packinglist/${idPackinglist}`);
                    setColetas(response.data);

                    const responseBuscaNomeImportador = await api.get(`/packinglist/buscar-nome-importador/${idPackinglist}`)
                    setNomeCliente(responseBuscaNomeImportador.data);

                    console.log('Coletas carregadas:', response.data)
                    console.log("estado 1")
                    return;
                } else if (idPackinglist && idProduto && seq) {
                    setEstadoDaPagina(2);
                    const response = await api.get(`/coletas/buscar-coletas-produto/${idPackinglist}/${idProduto}/${seq}`);
                    setColetas(response.data);

                    const responseNomeProduto = await api.get(`/pl-produto/buscar-nome-produto/${idPackinglist}/${idProduto}/${seq}`);
                    setNomeTitulo(responseNomeProduto.data);

                    const responseBuscaNomeImportador = await api.get(`/packinglist/buscar-nome-importador/${idPackinglist}`)
                    setNomeCliente(responseBuscaNomeImportador.data);

                    console.log('Coletas carregadas:', response.data);
                    console.log("estado 1")
                    return;
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Erro desconhecido ao carregar coletas";
                setErrorMessage(errorMessage);
            } finally {
                setContextLoading({ visible: false });
            }
        }

        verificarEstadoDaPagina();

    }, [idPackinglist, idProduto, seq]);

    useEffect(() => {


    }, [idPackinglist])

    const formatarData = (dtCriacao) => {
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };

    useEffect(() => {
        const filterColetas = coletas.filter(c =>
            (c.descricao ? c.descricao.toLowerCase() : '').includes(buscaDescricao.toLowerCase())
        );
        setFilteredColetas(filterColetas);
    }, [buscaDescricao, coletas]);

    return (
        <div>

            <Header />
            <ErrorNotification message={errorMessage} onClose={() => setErrorMessage(null)} id="message" />

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div className="div-info-coletas">
                    <h1 style={{ color: '#1780e2' }}>
                        {estadoDaPagina === 1
                            ? <>Coletas do packinglist: N° {idPackinglist} <br /> Cliente: {nomeCliente}</>
                            : <>Coletas do Produto {nomeTitulo} <br /> Cliente: {nomeCliente}`</>
                        }
                        <><br />Total de Coletas: {coletas.length}</>
                    </h1>
                </div>
            </div>


            <div className="container-lista-coleta" style={{ marginTop: '-50px' }}>
                <div className='container-listagem-volume' style={{ marginTop: '100px' }}>
                    <div style={{ marginBottom: '20px'}}>
                        <div className='busca-invoice-input'>
                            <Input
                                type={'text'}
                                placeholder={'Descrição'}
                                title={'Pesquise pela descrição...'}
                                value={buscaDescricao}
                                onChange={(e) => setBuscaDescricao(e.target.value)}
                            />
                        </div>
                    </div>
                    <ul>
                        <li className="header-volume">
                            <div id="list-coletas">ID Coleta</div>
                            <div id="list-coletas">Descrição</div>
                            <div id="list-coletas">Usuário</div>
                            <div id="list-coletas">Data Hora Coleta</div>
                            <div id="list-coletas">Nome Telefone</div>
                            <div id="list-coletas">Data Hora Importação</div>
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
                                {filteredColetas && filteredColetas.length > 0 ? (
                                    filteredColetas.map((c) => (
                                        <li key={c.idColeta} className='li-listagem-coletas'>
                                            <div id="container-list-coletas">

                                                <div id='list-vol-divs' className={'list-vol-divs'} style={{ padding: 0 }}>
                                                    <div id="list-vol">{c.idColeta}</div>
                                                    <div id="list-vol">{c.descricao}</div>
                                                    <div id="list-vol">{c.nome}</div>
                                                    <div id="list-vol">{formatarData(c.dataHoraColeta)}</div>
                                                    <div id="list-vol">{c.nomeTelefone}</div>
                                                    <div id="list-vol" style={{ borderRight: 'none' }}>{formatarData(c.dataHoraImportacao)}</div>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <div id="nao-existe-volume">
                                        <li>Não há nada para exibir, realize a primeira coleta...</li>
                                    </div>
                                )}
                            </>
                        )}
                    </ul>
                </div>

            </div>

            {contextLoading.visible ? (
                <Loading message={estadoDoLoading === "Carregando" ? "Carregando..." : estadoDoLoading === "Atualizando" ? "Atualizando..." : estadoDoLoading === "Salvando" ? "Salvando..." : "Excluindo..."} />
            ) : (
                <></>
            )}
        </div>
    )
}

export default ExibirColetas;