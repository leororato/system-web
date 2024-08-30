import { useState } from 'react';
import QRCode from 'react-qr-code';
import QRCodeLink from 'qrcode'
import './QrCodeGenerator.css';
import Button from '../../components/Button';
import Title from '../../components/Title';
import Header from '../../components/Header/Header';
import Input from '../../components/Input';
import { useParams } from 'react-router-dom';


function QrCodeGenerator() {

    const { idVolumeProduto, idPackinglist, idProduto, seq, idVolume } = useParams();

    const [quantidadeEtiquetas, setQuantidadeEtiquetas] = useState('') // valor do input quantidade de qrcode a ser gerado
    const [qrCodeLink, setQrCodeLink] = useState('') // link para download do qrcode gerado
    const [qrCodeLista, setQrCodeLista] = useState([]) // array que guarda os qrcodes
    const valueQrCode = [{

        qrCodeVolumeProduto: '27-1-16-15-48'
    },

    {

        idPackList: 1,

        idCliente: 342,

        nomeCliente: 2,

        idProduto: 3,

        nomeProduto: 3

    },

    {

        idPackList: 1,

        idCliente: 112,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "AGLOMERADOR DE FLOCOS DE ESPUMA",

        TipoVolume: "Plastico Bolha",

        idVolume: 3,

        qtVolume: 1,

        descricaoVolume: "Regulador caixa",

        pesoLiquidoVolume: 50,

        pesoBrutoVolume: 65,

        idSubVolume: null,

        descricaoSubVolume: null

    },

    {

        idPackList: 1,

        idCliente: 576,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "AGLOMERADOR SEM PESAGEM",

        TipoVolume: "Plastico Bolha",

        idVolume: 4,

        qtVolume: 1,

        descricaoVolume: "Esteira",

        pesoLiquidoVolume: 100,

        pesoBrutoVolume: 105,

        idSubVolume: null,

        descricaoSubVolume: null

    }]

    const handleQrcode = (event) => {
        const value = event.target.value;
        setQuantidadeEtiquetas(value);
        gerarQRCodeLista(value);
    };

    const gerarQRCodeLista = (quantidade) => {
        const novosQrCodes = Array.from({ length: quantidade }, (_, index) => ({
            id: index + 1,
            //  value: (index + 1).toString(),
            ...valueQrCode[index % valueQrCode.length],
        }))
        setQrCodeLista(novosQrCodes)
    }

    // const handleGenerateList = () => {
    //     gerarQRCodeLista(parseInt(quantidadeEtiquetas, 10))
    // }

    function handleGenerate(quantidadeEtiquetas_url) {
        QRCodeLink.toDataURL(quantidadeEtiquetas_url, {
            width: 600,
            margin: 3,
        }, function (err, url) {
            setQrCodeLink(url);
        })
    }

    const handlePrint = () => {
        window.print(); 
    }

    return (
        <div className='container-qrcodes'>
            <Header />

            <div>
                    <Title
                        text={'Gerador de QRCode'}
                        color={'black'}
                        fontSize={'30px'}
                    />
            </div>

            <div className='container-gerar-qrcodes'>

                

                <div>
                    <Input
                        value={quantidadeEtiquetas}
                        type='number'
                        min={1}
                        max={valueQrCode.length }
                        placeholder='Quantidade de etiquetas'
                        onChange={handleQrcode}
                    />
                </div>

                <div className='container-botoes-qrcode'>

                    <div id='div-botao-gerar-lista'>
                        <Button
                            onClick={handleGenerate}
                            className='button-generator'
                            text={'Gerar Lista'}
                            color={'white'}
                            fontSize={'15px'}
                            padding={'5px'}
                            borderRadius={'5px'}
                        />
                    </div>

                    <div id='div-botao-imprimir'>
                        <Button
                            onClick={handlePrint}
                            className='button-printer'
                            text={'Imprimir Etiquetas'}
                            color={'white'}
                            fontSize={'15px'}
                            padding={'5px'}
                            borderRadius={'5px'}
                        />
                    </div>

                    <div id='div-botao-baixar'>
                        <Button
                            href={qrCodeLink}
                            className='button-download'
                            download={`qrcode.png`}
                            text={'Baixar QRCode'}
                            fontSize={'15px'}
                            padding={'5px'}
                            borderRadius={'5px'}
                        />
                    </div>
                </div>
            </div>

            <div className='qr-code-lista'>
                {qrCodeLista.map((qrCodeItem, index) => (
                    <div key={index} className='qr-code-item'>
                        <QRCode value={JSON.stringify(valueQrCode[index])} size={100} className='qr-code-img' />
                        <div className='texto-etiqueta'>
                            <p className='nomeProd'>Nome Produto: {qrCodeItem.nomeProduto}</p>
                            <p>ID Packlist: {qrCodeItem.idPackList}</p>
                            <p>ID Cliente: {qrCodeItem.idCliente}</p>
                            <p>ID Volume: {qrCodeItem.idVolume}</p>
                        </div>
                    </div>

                ))}
                <div />
            </div>

        </div>
    );
}

export default QrCodeGenerator;
