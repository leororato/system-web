import { useState } from 'react';
import QRCode from 'react-qr-code';
import QRCodeLink from 'qrcode'
import './QrCodeGenerator.css';
import Button from '../../components/Button';
import Title from '../../components/Title';
import Header from '../../components/Header/Header';
import Input from '../../components/Input';


function QrCodeGenerator() {
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

    },

    {

        idPackList: 1,

        idCliente: 876,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "BATEDOR CF 2700",

        TipoVolume: "Plastico Bolha",

        idVolume: 5,

        qtVolume: 3,

        descricaoVolume: "Balte de tinta",

        pesoLiquidoVolume: 70,

        pesoBrutoVolume: 75,

        idSubVolume: null,

        descricaoSubVolume: null

    },

    {

        idPackList: 1,

        idCliente: 28,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "BATEDOR CF 7000",

        TipoVolume: "Caixa MDF",

        idVolume: 6,

        qtVolume: 1,

        descricaoVolume: "Peças diverças",

        pesoLiquidoVolume: 500,

        pesoBrutoVolume: 550,

        idSubVolume: null,

        descricaoSubVolume: null

    },

    {

        idPackList: 1,

        idCliente: 14,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "LAMINADORA CF 5310",

        TipoVolume: "Caixa MDF",

        idVolume: 6,

        qtVolume: 1,

        descricaoVolume: "Peças diverças",

        pesoLiquidoVolume: null,

        pesoBrutoVolume: null,

        idSubVolume: 1,

        descricaoSubVolume: "motor"

    },

    {

        idPackList: 1,

        idCliente: 66,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "LAMINAFORA HORIZONTAL CNC CF 16011",

        TipoVolume: "Caixa MDF",

        idVolume: 7,

        qtVolume: 1,

        descricaoVolume: "Peças diverças",

        pesoLiquidoVolume: null,

        pesoBrutoVolume: null,

        idSubVolume: 2,

        descricaoSubVolume: "valvula"

    },

    {

        idPackList: 1,

        idCliente: 344,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "MISTURADOR DE PET",

        TipoVolume: "Caixa MDF",

        idVolume: 8,

        qtVolume: 1,

        descricaoVolume: "Peças diverças",

        pesoLiquidoVolume: null,

        pesoBrutoVolume: null,

        idSubVolume: 3,

        descricaoSubVolume: "contator"

    },

    {

        idPackList: 1,

        idCliente: 786,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "PERFILADOR DE MANTAS CF 1400",

        TipoVolume: "Caixa MDF",

        idVolume: 9,

        qtVolume: 1,

        descricaoVolume: "Peças diverças",

        pesoLiquidoVolume: null,

        pesoBrutoVolume: null,

        idSubVolume: 4,

        descricaoSubVolume: "atuador"

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


            <div className='container-gerar-qrcodes'>

                <div>
                    <Title
                        text={'Gerador de QRCode'}
                        color={'black'}
                        fontSize={'30px'}
                    />
                </div>

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
