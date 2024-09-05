import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import QRCode from 'react-qr-code';
import axios from 'axios';
import './ExibirQRCodes.css';
import Text from '../../components/Text';
import ErrorNotification from '../../components/ErrorNotification/ErrorNotification';
import SucessNotification from '../../components/SucessNotification/SucessNotification';
import Title from '../../components/Title';
import Button from '../../components/Button';

const ExibirQRCodes = () => {
    const { idVolumeProduto, idPackinglist, idProduto, seq, idVolume } = useParams();

    const [modoDaPagina, setModoDaPagina] = useState(0);

    const [errorMessage, setErrorMessage] = useState('');
    const [sucessMessage, setSucessMessage] = useState('');

    //---------------------------- QR CODES UNICO VOLUME ----------------------------//
    const [infoQrCodeUnico, setInfoQrCodeUnico] = useState('');
    const [volumeProdutoUnicoData, setVolumeProdutoUnicoData] = useState('');

    const [informacoesQrCodeUnico, setInofrmacoesQrCodeUnico] = useState({
        descricaoProduto: '',
        invoice: '',
        consignatario: '',
        volume: '',
        quantidadeItens: ''
    });

    //---------------------------- ^QR CODES UNICO VOLUME^ ----------------------------//


    //---------------------------- GERAR TODOS OS QRCODES DA PACKINGLIST ----------------------------//
    const [todosVolumesDaPackinglist, setTodosVolumesDaPackinglist] = useState([]);

    //---------------------------- ^FIM GERAR TODOS OS QRCODES DA PACKINGLIST^ ----------------------------//


    //---------------------------- QR CODES PRODUTOS ----------------------------//
    const [infoQrCodes, setInfoQrCodes] = useState([]);
    const [pesquisaNosVolumes, setPesquisaNosVolumes] = useState([]);

    const [nomeProduto, setNomeProduto] = useState('');
    const [invoice, setInvoice] = useState('');
    const [consignatario, setConsignatario] = useState('');
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
                await axios.get(`http://localhost:8080/api/volume-produto/qrcode-packinglist/${idPackinglist}`)
                    .then(response => {
                        setTodosVolumesDaPackinglist(response.data);
                        console.log('response: ', response.data)
                    })
            }

            fetchTodosOsQrCodesDeUmaPackinglist();
        }
    }, [idPackinglist, modoDaPagina])


    // --------------------------- ^FIM DO GERAR QRCODES DA PACKINGLIST^ ----------------------------//




    //---------------------------- QR CODES GERADO DE CADA PRODUTO ----------------------------//

    useEffect(() => {


        // buscar todos os qrcodes quando o usuario gera os qrcodes pelo produto
        const buscarTodosOsQRCodesDeUmProduto = async () => {
            try {
                if (modoDaPagina === 1) {
                    const response = await axios.get(`http://localhost:8080/api/volume-produto/${idPackinglist}/${idProduto}/${seq}`);
                    const qrCodesData = response.data || [];
                    setInfoQrCodes(qrCodesData);
                } else return
            } catch (error) {
                console.error('Erro ao buscar QR Codes:', error);
                setInfoQrCodes([]);
            }
        };

        const buscarInformacoesDeTodosOsVolumesDeUmProduto = async () => {
            try {
                if (modoDaPagina === 1) {
                    const response = await axios.get(`http://localhost:8080/api/volume/produto/${idPackinglist}/${idProduto}/${seq}`);
                    const volumesData = response.data || [];
                    setPesquisaNosVolumes(volumesData);
                } else return
            } catch (error) {
                const errorMessage = error.response?.data || "Erro desconhecido ao carregar informações do QRCode";
                setErrorMessage(errorMessage);
                setTimeout(() => setErrorMessage(null), 5000);
            }
        }

        buscarTodosOsQRCodesDeUmProduto();
        buscarInformacoesDeTodosOsVolumesDeUmProduto();

    }, [idPackinglist, idProduto, seq, modoDaPagina]);



    useEffect(() => {

        const buscarInvoiceDaPackinglistDoProdutoSelecionado = async () => {
            try {
                if (modoDaPagina === 1) {

                    await axios.get(`http://localhost:8080/api/packinglist/${idPackinglist}`)
                        .then(response => {
                            setInvoice(response.data.invoice);
                            const idConsignatario = response.data.idConsignatario;
                            axios.get(`http://localhost:8080/api/clienteNomus/${idConsignatario}`)
                                .then(response => {
                                    setConsignatario(response.data.nome);
                                });
                        })
                        .catch((error) => {
                            console.error('erro:', error)
                        })
                }
            } catch (error) {
                console.error('Erro ao buscar nome do Invoice', error);
            }
        }

        const buscarNomeDoProdutoSelecionado = async () => {

            try {
                if (modoDaPagina === 1) {

                    const response = await axios.get(`http://localhost:8080/api/pl-produto/${idPackinglist}/${idProduto}/${seq}`);
                    setNomeProduto(response.data.descricaoProduto)
                } else return
            }
            catch (error) {
                console.error('Erro ao buscar nome do Produto:', error);
            }
        }

        buscarInvoiceDaPackinglistDoProdutoSelecionado();
        buscarNomeDoProdutoSelecionado();

    }, [idPackinglist, idProduto, seq, modoDaPagina]);

    //---------------------------- ^FIM QR CODES GERADO DE CADA PRODUTO^ ----------------------------//




    //---------------------------- QR CODE GERADO DE CADA VOLUME ----------------------------//

    // BUSCAR OS DADOS DO QRCODE DO VOLUME SELECIONADO

    useEffect(() => {

        if (modoDaPagina === 2) {
            const fetchQrCodeDeUmVolume = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/volume-produto/qrcode-unico/${idVolume}`);
                    const item = response.data[0];

                    setVolumeProdutoUnicoData(prevState => {
                        const newState = {
                            item: item,
                        };
                        return newState;
                    });

                    setInfoQrCodeUnico(item.qrCodeVolumeProduto);
                }
                catch (error) {
                    const errorMessage = error.response?.data || "Erro desconhecido ao ir para a página 'Gerar QR Code'";
                    setErrorMessage(errorMessage);
                    setTimeout(() => setErrorMessage(null), 5000);
                }
            }


            fetchQrCodeDeUmVolume();
        } else return
    }, [idVolume, modoDaPagina])


    useEffect(() => {
        if (modoDaPagina === 2 && volumeProdutoUnicoData.item) {
            const { idPackinglist, idProduto, seq } = volumeProdutoUnicoData.item.id;

            const fetchDescricaoProduto = async () => {
                await axios.get(`http://localhost:8080/api/pl-produto/${idPackinglist}/${idProduto}/${seq}`)
                    .then(response => {
                        let respostaAtalho = response.data;
                        setInofrmacoesQrCodeUnico(prevState => ({
                            ...prevState,
                            descricaoProduto: respostaAtalho.descricaoProduto
                        }));
                    })
                    .catch(error => {
                        const errorMessage = error.response?.data || "Erro desconhecido ao procurar pela descrição do produto no QRCode";
                        setErrorMessage(errorMessage);
                        setTimeout(() => setErrorMessage(null), 5000);
                    });
            };
            const fetchInvoiceEConsignatarioDoVolume = async () => {

                await axios.get(`http://localhost:8080/api/packinglist/${idPackinglist}`)
                    .then(response => {
                        let respostaAtalho = response.data;
                        let idConsignatario = respostaAtalho.idConsignatario;
                        setInofrmacoesQrCodeUnico(prevState => ({
                            ...prevState,
                            invoice: respostaAtalho.invoice,
                        }))

                        axios.get(`http://localhost:8080/api/clienteNomus/${idConsignatario}`)
                            .then(response => {
                                let respostaAtalho = response.data;
                                setInofrmacoesQrCodeUnico(prevState => ({
                                    ...prevState,
                                    consignatario: respostaAtalho.nome
                                }))
                            })

                    })
                    .catch(error => {
                        const errorMessage = error.response?.data || "Erro desconhecido ao buscar Invoice do QRCode";
                        setErrorMessage(errorMessage);
                        setTimeout(() => setErrorMessage(null), 5000);
                    })
            }

            const fetchVolumeDescricaoEQuantidadeDeItens = async () => {

                await axios.get(`http://localhost:8080/api/volume/${idVolume}`)
                    .then(response => {
                        let respostaAtalho = response.data;
                        setInofrmacoesQrCodeUnico(prevState => ({
                            ...prevState,
                            volume: respostaAtalho.descricao,
                            quantidadeItens: respostaAtalho.quantidadeItens
                        }))
                    })
                    .catch(error => {
                        const errorMessage = error.response?.data || "Erro desconhecido ao buscar a descrição do volume no QRCode";
                        setErrorMessage(errorMessage);
                        setTimeout(() => setErrorMessage(null), 5000);
                    })
            }

            fetchDescricaoProduto();
            fetchInvoiceEConsignatarioDoVolume();
            fetchVolumeDescricaoEQuantidadeDeItens();
        } else return

    }, [idVolume, modoDaPagina, volumeProdutoUnicoData])


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

                <div id='texto-qrcode'>
                    <Text
                        text={modoDaPagina === 1 ? `Está é a lista dos QRCodes de todos os Volumes do Produto: ${nomeProduto}` : `Este é o QRCode do Volume '${informacoesQrCodeUnico?.volume}' `}
                    />

                    <Button 
                    className={'botao-imprimir-qrcode'}
                    text={'Imprimir'}
                    onClick={handlePrint}
                    />
                </div>

                {/* SE FOR GERADO TODOS OS QRCODES DE UM PRODUTO */}
                {modoDaPagina === 1 && (
                    <div className='qr-code-lista'>
                        {infoQrCodes.length > 0 ? (
                            infoQrCodes.map((item, index) => (
                                <div key={index} className='qr-code-item'>
                                    <QRCode value={item.qrCodeVolumeProduto} size={100} className='qr-code-img' />
                                    <div className='texto-etiqueta'>
                                        <p><strong>Descrição: {nomeProduto} </strong></p>
                                        <p><strong>Invoice: {invoice} </strong></p>
                                        <p><strong>Cliente: {consignatario} </strong></p>
                                        <p><strong>Volume: {pesquisaNosVolumes[index]?.descricao}</strong></p>
                                        <p><strong>Quantidade Itens: {pesquisaNosVolumes[index]?.quantidadeItens}</strong></p>
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
                        <div className='qr-code-item'>
                            <QRCode value={infoQrCodeUnico} size={100} className='qr-code-img' />
                            <div className='texto-etiqueta'>
                                <p><strong>Descrição: {informacoesQrCodeUnico?.descricaoProduto} </strong></p>
                                <p><strong>Invoice: {informacoesQrCodeUnico?.invoice} </strong></p>
                                <p><strong>Cliente: {informacoesQrCodeUnico?.consignatario} </strong></p>
                                <p><strong>Volume: {informacoesQrCodeUnico?.volume}</strong></p>
                                <p><strong>Quantidade Itens: {informacoesQrCodeUnico?.quantidadeItens}</strong></p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SE FOR GERADO TODOS OS QRCODES DE UM PRODUTO */}
                {modoDaPagina === 3 && (
                    <div className='qr-code-lista'>
                        {todosVolumesDaPackinglist.length > 0 ? (
                            todosVolumesDaPackinglist.map((item, index) => (
                                <div key={index} className='qr-code-item'>
                                    <QRCode value={item.qrCodeVolumeProduto} size={100} className='qr-code-img' />
                                    <div className='texto-etiqueta'>
                                        <p><strong>Descrição: {nomeProduto} </strong></p>
                                        <p><strong>Invoice: {invoice} </strong></p>
                                        <p><strong>Cliente: {consignatario} </strong></p>
                                        <p><strong>Volume: {[index]?.descricao}</strong></p>
                                        <p><strong>Quantidade Itens: {pesquisaNosVolumes[index]?.quantidadeItens}</strong></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum QR Code encontrado. Provavelmente não há volumes criados para este produto ainda...</p>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ExibirQRCodes;
