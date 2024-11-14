import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import QRCode from 'react-qr-code';
import './ExibirQRCodes.css';
import Text from '../../components/Text';
import ErrorNotification from '../../components/ErrorNotification/ErrorNotification';
import SucessNotification from '../../components/SucessNotification/SucessNotification';
import Title from '../../components/Title';
import Button from '../../components/Button';
import api from '../../axiosConfig';
import logo from '../../assets/logo.png';
import Loading from '../../components/Loading/Loading';

const ExibirQRCodes = () => {

    const { idVolumeProduto, idPackinglist, idProduto, seq, idVolume } = useParams();

    const [modoDaPagina, setModoDaPagina] = useState(0);

    const [errorMessage, setErrorMessage] = useState('');
    const [sucessMessage, setSucessMessage] = useState('');

    const [estadoDaPagina, setEstadoDaPagina] = useState("Carregando");
    const [contextLoading, setContextLoading] = useState({ visible: false });

    //---------------------------- QR CODES UNICO VOLUME ----------------------------//

    const [qrCodeDeUmVolume, setQrCodeDeUmVolume] = useState([]);

    //---------------------------- ^QR CODES UNICO VOLUME^ ----------------------------//


    //---------------------------- GERAR TODOS OS QRCODES DA PACKINGLIST ----------------------------//
    const [todosQrCodesDaPackinglist, setTodosQrCodesDaPackinglist] = useState([]);

    //---------------------------- ^FIM GERAR TODOS OS QRCODES DA PACKINGLIST^ ----------------------------//


    //---------------------------- QR CODES PRODUTOS ----------------------------//
    const [todosQrCodesDoProduto, setTodosQrCodesDoProduto] = useState([]);

    //---------------------------- ^FIM QR CODES PRODUTOS^ ----------------------------//


    // --------------------------- TRATAMENTO DA PÁGINA ----------------------------//
    useEffect(() => {


        if (idPackinglist && idProduto && seq && !idVolume && !idVolumeProduto) {
            // MODO 1 -> GERAR QR CODE A PARTIR DO PROTUDO
            setModoDaPagina(1);
            return;
        } else if (idVolume && !idVolumeProduto && !idPackinglist && !idProduto && !seq) {
            // MODO 2 -> GERAR QR CODE APENAS DO VOLUME SELECIONADO
            setModoDaPagina(2);
            return;
        } else if (idPackinglist && !idVolumeProduto && !idProduto && !seq && !idVolume) {
            // MODO 3 -> GERAR QR CODES DOS PRODUTOS DO VOLUME SELECIONADO
            setModoDaPagina(3);
            return;
        }

    }, [idVolumeProduto, idPackinglist, idProduto, seq, idVolume])
    // --------------------------- ^FIM DO TRATAMENTO DA PÁGINA^ ----------------------------//


    //---------------------------- GERAR TODOS OS QRCODES DA PACKINGLIST ----------------------------//

    useEffect(() => {
        if (modoDaPagina === 3) {
            const fetchTodosOsQrCodesDeUmaPackinglist = async () => {
                setEstadoDaPagina("Carregando");
                setContextLoading({ visible: true });


                try {
                    const response = await api.get(`/busca-qrcode/todos-packinglist/${idPackinglist}`)
                    setTodosQrCodesDaPackinglist(response.data);

                } catch (error) {
                    const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar os QRCodes da packinglist";
                    setErrorMessage(errorMessage)
                    setTodosQrCodesDaPackinglist([]);

                } finally {
                    setContextLoading({ visible: false })
                }
            }
            fetchTodosOsQrCodesDeUmaPackinglist();
        }
    }, [idPackinglist, modoDaPagina])


    // --------------------------- ^FIM DO GERAR QRCODES DA PACKINGLIST^ ----------------------------//




    //---------------------------- QR CODES GERADO DE CADA PRODUTO ----------------------------//

    useEffect(() => {
        // buscar todos os qrcodes quando o usuario gera os qrcodes pelo produto
        const buscarTodosOsQRCodesDeUmProduto = async () => {
            setEstadoDaPagina("Carregando");
            setContextLoading({ visible: true });

            try {
                if (modoDaPagina === 1) {
                    const response = await api.get(`/busca-qrcode/todos-por-produto/${idPackinglist}/${idProduto}/${seq}`);
                    setTodosQrCodesDoProduto(response.data);

                } else return;

            } catch (error) {
                const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar os QRCodes do produto";
                setErrorMessage(errorMessage);
                setTodosQrCodesDoProduto([]);

            } finally {
                setContextLoading({ visible: false });
            }
        };


        buscarTodosOsQRCodesDeUmProduto();

    }, [idPackinglist, idProduto, seq, modoDaPagina]);


    //---------------------------- ^FIM QR CODES GERADO DE CADA PRODUTO^ ----------------------------//



    //---------------------------- QR CODE GERADO DE CADA VOLUME ----------------------------//

    // BUSCAR OS DADOS DO QRCODE DO VOLUME SELECIONADO

    useEffect(() => {

        if (modoDaPagina === 2) {
            const fetchQrCodeDeUmVolume = async () => {
                setEstadoDaPagina("Carregando");
                setContextLoading({ visible: true });

                try {
                    const response = await api.get(`/busca-qrcode/por-volume/${idVolume}`);
                    setQrCodeDeUmVolume(response.data);

                }
                catch (error) {
                    const errorMessage = error.response?.data?.message || "Erro desconhecido ao ir para a página 'Gerar QR Code'";
                    setErrorMessage(errorMessage);

                    setQrCodeDeUmVolume([]);

                } finally {
                    setContextLoading({ visible: false });
                }
            }


            fetchQrCodeDeUmVolume();
        } else return
    }, [idVolume, modoDaPagina])



    //---------------------------- ^FIM QR CODE GERADO DE CADA VOLUME^ ----------------------------//


    const handlePrint = () => {
        window.print();
    }

    return (
        <div className='container-qrcode-div'>

            <div className='header-qrcode'>
                <Header />
                <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} id="message" />
                <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} id="message" />
            </div>

            <div className="container-exibir-qrcodes">

                <Title
                    text={modoDaPagina === 1 || modoDaPagina === 3 ? `Lista de QR Codes para Impressão` : `QRCode Selecionado para Impressão`}
                />

                <div className='info-qrcode'>
                    <div id='texto-qrcode'>
                        <Text
                            text={modoDaPagina === 1 ? `Está é a lista dos QRCodes de todos os volumes do produto` : modoDaPagina === 2 ? `Este é o QRCode de apenas um volume` : 'Está é a lista de todos QRCodes de uma packinglist'}
                        />
                    </div>

                    <div id='div-botao-imprimir-qrcode'>
                        <Button
                            className={'botao-imprimir-qrcode'}
                            text={'Imprimir'}
                            onClick={handlePrint}
                        />
                    </div>
                </div>

                <>


                    {/* SE FOR GERADO TODOS OS QRCODES DE UM PRODUTO */}
                    {modoDaPagina === 1 && (
                        <div className='qr-code-lista'>
                            {todosQrCodesDoProduto && todosQrCodesDoProduto.length > 0 ? (
                                todosQrCodesDoProduto.map((item) => (
                                    <div key={item.identificadorVolumeProduto} className='sub-qr-code-item'>
                                        <div className='qr-code-item'>
                                            <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                            <QRCode value={item.qrCodeVolumeProduto} size={100} className='qr-code-img' />
                                            <p><strong>{item.identificadorVolumeProduto}</strong></p>
                                            </div>
                                            <div className='texto-etiqueta'>
                                                <div id='subdiv-id-qrcode'>
                                                    <div id='id-qr-code'>
                                                        <img src={logo} id='logo-para-etiquetas' alt="logo-etiqueta"></img>
                                                        <p><strong>{item.seqVolume}</strong></p>
                                                    </div>
                                                </div>
                                                <div id='subdiv-texto-etiqueta'>
                                                    <div id="textos-etiqueta-div">
                                                        <p><strong>{item.descricaoProduto} </strong></p>
                                                        <p><strong>Para: {item.nomeCliente} </strong></p>
                                                        <p><strong>Desc: {item.descricaoVolume}</strong></p>
                                                        <p><strong>Qtd: {item.quantidadeItens} {item.quantidadeItens > 1 ? ('itens') : ('item')}</strong></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhum QR Code encontrado. Provavelmente não há volumes criados para este produto ainda...</p>
                            )}
                        </div>
                    )}

                    {/* SE FOR GERADO APENAS O QRCODE DE UM VOLUME */}
                    {modoDaPagina === 2 && (
                        <div className='qr-code-lista'>
                            {qrCodeDeUmVolume.length > 0 ? (
                                qrCodeDeUmVolume.map((item) => (
                                    <div key={item.identificadorVolumeProduto} className='sub-qr-code-item'> {/* Colocando a key aqui */}
                                        <div className='qr-code-item'>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                            <QRCode value={item.qrCodeVolumeProduto} size={100} className='qr-code-img' />
                                            <p><strong>{item.identificadorVolumeProduto}</strong></p>
                                            </div>
                                            <div className='texto-etiqueta'>
                                                <div id='subdiv-id-qrcode'>
                                                    <div id='id-qr-code'>
                                                        <img src={logo} id='logo-para-etiquetas' alt="logo-etiqueta"></img>
                                                        <p><strong>{item.seqVolume}</strong></p>
                                                    </div>
                                                </div>
                                                <div id='subdiv-texto-etiqueta'>
                                                    <div id="textos-etiqueta-div">
                                                        <p><strong>{item.descricaoProduto} </strong></p>
                                                        <p><strong>Para: {item.nomeCliente} </strong></p>
                                                        <p><strong>Desc: {item.descricaoVolume}</strong></p>
                                                        <p><strong>Qtd: {item.quantidadeItens} {item.quantidadeItens > 1 ? ('itens') : ('item')}      </strong></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Houve algum erro ao gerar a etiqueta do volume selecionado...</p>
                            )}
                        </div>
                    )}

                    {/* SE FOR GERADO TODOS OS QRCODES DE UMA PACKINGLIST */}
                    {modoDaPagina === 3 && (
                        <div className='qr-code-lista'>
                            {todosQrCodesDaPackinglist.length > 0 ? (
                                todosQrCodesDaPackinglist.map((item) => (
                                    <div key={item.identificadorVolumeProduto} className='sub-qr-code-item'> {/* Colocando a key aqui */}
                                        <div className='qr-code-item'>
                                        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                            <QRCode value={item.qrCodeVolumeProduto} size={100} className='qr-code-img' />
                                            <p><strong>{item.identificadorVolumeProduto}</strong></p>
                                            </div>
                                            <div className='texto-etiqueta'>
                                                <div id='subdiv-id-qrcode'>
                                                    <div id='id-qr-code'>
                                                        <img src={logo} id='logo-para-etiquetas' alt="logo-etiqueta"></img>
                                                        <p><strong>{item.seqVolume}</strong></p>
                                                    </div>
                                                </div>
                                                <div id='subdiv-texto-etiqueta'>
                                                    <div id="textos-etiqueta-div">
                                                        <p><strong>{item.descricaoProduto} </strong></p>
                                                        <p><strong>Para: {item.nomeCliente} </strong></p>
                                                        <p><strong>Desc: {item.descricaoVolume}</strong></p>
                                                        <p><strong>Qtd: {item.quantidadeItens} {item.quantidadeItens > 1 ? ('itens') : ('item')}      </strong></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhum QR Code encontrado. Provavelmente não há volumes criados para este packinglist ainda...</p>
                            )}
                        </div>
                    )}

                </>
            </div>


            {contextLoading.visible ? (
                <div className="loading">
                    <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : "Carregando..."} />
                </div>
            ) : (
                <div></div>
            )}


        </div>
    );
};

export default ExibirQRCodes;
