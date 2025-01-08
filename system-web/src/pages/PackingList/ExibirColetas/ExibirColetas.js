import { useEffect, useState } from "react";
import api from "../../../axiosConfig";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header/Header";
import { Box, CircularProgress } from "@mui/material";
import Text from "../../../components/Text";

function ExibirColetas() {

    const [coletas, setColetas] = useState([]);
    const { idPackinglist } = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchListaColetas = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/coletas/buscar-coletas-packinglist/${idPackinglist}`);
                setColetas(response.data);
                console.log('Coletas carregadas:', response.data);
            } catch (error) {
                console.error('Erro ao carregar coletas:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchListaColetas();
    }, [idPackinglist])

    return (
        <div>
            <Header />


            <div className='container-listagem-volume'>
                <ul>
                    <li className="header-volume">
                        
                        <div id="list-vol">ID Coleta</div>
                        <div id="list-vol">Usuário</div>
                        <div id="list-vol">Data Hora Coleta</div>
                        <div id="list-vol">Nome Telefone</div>
                        <div id="list-vol">Data Hora Exportação</div>
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
                                    <li key={c.idColeta} className='li-listagem-volume'>
                                        <div id="container-list-vol">

                                            <div id='list-vol-divs' className={'list-vol-divs'}>
                                                <div id="list-vol">{c.idColeta}</div>
                                                <div id="list-vol">{c.idUsuario}</div>
                                                <div id="list-vol">{c.dataHoraColeta}</div>
                                                <div id="list-vol">{c.nomeTelefone}</div>
                                                <div id="list-vol">{c.coleta_finalizada}</div>
                                            </div>
                                        </div>
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
    )
}

export default ExibirColetas;