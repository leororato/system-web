import { useEffect, useState } from "react";
import api from "../../../axiosConfig";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header/Header";
import { Box, CircularProgress } from "@mui/material";
import Text from "../../../components/Text";
import './ExibirColetas.css';
import { format } from "date-fns";

function ExibirColetas() {

    const [coletas, setColetas] = useState([]);
    const { idPackinglist, idProduto, seq } = useParams();
    const [loading, setLoading] = useState(false);
    // 0 == nenhum --- 1 == packinglist --- 2 == produto
    const [estadoDaPagina, setEstadoDaPagina] = useState(0);


    useEffect(() => {
        const verificarEstadoDaPagina = async () => {
            if (idPackinglist && !idProduto && !seq) {
                setEstadoDaPagina(1);
                const response = await api.get(`/coletas/buscar-coletas-packinglist/${idPackinglist}`);
                setColetas(response.data);
                console.log('Coletas carregadas:', response.data)
                console.log("estado 1")
                return;
            } else if (idPackinglist && idProduto && seq) {
                setEstadoDaPagina(2);
                const response = await api.get(`/coletas/buscar-coletas-produto/${idPackinglist}/${idProduto}/${seq}`);
                setColetas(response.data);
                console.log('Coletas carregadas:', response.data);
                console.log("estado 1")
                return;
            }
        }

        verificarEstadoDaPagina();

    }, [idPackinglist, idProduto, seq]);

    useEffect(() => {


    }, [idPackinglist])

    const formatarData = (dtCriacao) => {
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };

    return (
        <div>
            <Header />

            <div style={{ widh: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop: '40px' }}>
                <h1 style={{ color: '#1780e2' }}>
                    {estadoDaPagina === 1 ? `Coletas do PackingList ${idPackinglist}` : `Coletas do Produto ${idPackinglist} - Seq ${seq}`}
                </h1>
            </div>

            <div className="container-lista-coleta">
                <div className='container-listagem-volume' style={{ marginTop: '100px' }}>
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
                                {coletas && coletas.length > 0 ? (
                                    coletas.map((c) => (
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
        </div>
    )
}

export default ExibirColetas;