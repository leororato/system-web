import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import QRCode from 'react-qr-code';
import axios from 'axios';
import './ExibirQRCodes.css';
import Text from '../../components/Text';

const ExibirQRCodes = () => {
    const { idVolumeProduto, idPackinglist, idProduto, seq, idVolume } = useParams();
    const [infoQrCodes, setInfoQrCodes] = useState([]);
    const [qrcodes, setQRCodes] = useState([]);

    const [nomeProduto, setNomeProduto] = useState('');
    const [invoice, setInvoice] = useState('');
    const [consignatario, setConsignatario] = useState('');

    useEffect(() => {

        // buscar todos os qrcodes quando o usuario gera os qrcodes pelo produto
        const buscarTodosOsQRCodesDeUmProduto = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/volume-produto/${idPackinglist}/${idProduto}/${seq}`);
                const qrCodesData = response.data || []; // Corrigido para acessar 'data' no retorno da API
                setInfoQrCodes(qrCodesData);
            } catch (error) {
                console.error('Erro ao buscar QR Codes:', error);
                setInfoQrCodes([]); // Garantir que o estado seja um array vazio em caso de erro
            }
        };

        buscarTodosOsQRCodesDeUmProduto();
    }, [idPackinglist, idProduto, seq]);

    useEffect(() => {

        const buscarInvoiceEClienteDaPackinglistSelecionada = async () => {
            try {
                await axios.get(`http://localhost:8080/api/packinglist/${idPackinglist}`)
                    .then(response => {
                        setInvoice(response.data.invoice);
                        const idConsignatario = response.data.idConsignatario;
                        axios.get(`http://localhost:8080/api/clienteNomus/${idConsignatario}`)
                            .then(response => {
                                setConsignatario(response.data.nome);
                            })
                            .catch((error) => {
                                console.error('erro2: ', error);
                            })
                    })
                    .catch((error) => {
                        console.error('erro:', error)
                    })
            } catch (error) {
                console.error('Erro ao buscar nome do Invoice', error);
            }
        }


        const buscarNomeDoProdutoSelecionado = async () => {

            try {
                const response = await axios.get(`http://localhost:8080/api/pl-produto/${idPackinglist}/${idProduto}/${seq}`);
                setNomeProduto(response.data.descricaoProduto)
            }
            catch (error) {
                console.error('Erro ao buscar nome do Produto:', error);
            }
        }

        buscarInvoiceEClienteDaPackinglistSelecionada();
        buscarNomeDoProdutoSelecionado();

    }, idPackinglist, idProduto, seq);

    return (
        <div>
            <div className='header-qrcode'>
                <Header />
            </div>
            <div className="container-exibir-qrcodes">
                <h1 className="title-qrcodes">Lista de QR Codes para Impressão</h1>

                <div id='texto-qrcode'>
                    <Text
                        text={`Está é a lista dos QRCodes de todos os Volumes do Produto: ${nomeProduto}`}
                    />
                    <Text
                        text={`Para imprimir os QRCodes, basta apertar os botões do seu teclado: 'Ctrl' + 'P'`}
                    />
                </div>

                <div className='qr-code-lista'>
                    {infoQrCodes.length > 0 ? (
                        infoQrCodes.map((item, index) => (
                            <div key={index} className='qr-code-item'>
                                <QRCode value={item.qrCodeVolumeProduto} size={100} className='qr-code-img' />
                                <div className='texto-etiqueta'>
                                    <p><strong>Descrição: {nomeProduto} </strong></p>
                                    <p><strong>Invoice: {invoice} </strong></p>
                                    <p><strong>Cliente: {consignatario} </strong></p>
                                    <p><strong>QR Code:</strong> {item.qrCodeVolumeProduto}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum QR Code encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExibirQRCodes;
