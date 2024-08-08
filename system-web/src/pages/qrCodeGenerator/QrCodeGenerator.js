import { useState } from 'react';
import QRCode from 'react-qr-code';
import QRCodeLink from 'qrcode'
// import './QrCodeGenerator.css';
import Button from '../../components/Button';
import Title from '../../components/Title';
import Header from '../../components/Header/Header';


function QrCodeGenerator() {
    const [quantidadeEtiquetas, setQuantidadeEtiquetas] = useState('') // valor do input quantidade de qrcode a ser gerado
    const [qrCodeLink, setQrCodeLink] = useState('') // link para download do qrcode gerado
    const [qrCodeLista, setQrCodeLista] = useState([]) // array que guarda os qrcodes
    const valueQrCode = [{

        idPackList: 1,

        idCliente: 532,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "BATEDOR CF 17000",

        TipoVolume: "Plastico Bolha",

        idVolume: 1,

        qtVolume: 1,

        descricaoVolume: "Cupula",

        pesoLiquidoVolume: 650,

        pesoBrutoVolume: 700,

        idSubVolume: null,

        descricaoSubVolume: null

    },

    {

        idPackList: 1,

        idCliente: 342,

        nomeCliente: "Ortobom",

        idProduto: "MP000325",

        nomeProduto: "TORNO DE LAMINAR ESPUMAS CF 2002",

        TipoVolume: "Plastico Bolha",

        idVolume: 2,

        qtVolume: 1,

        descricaoVolume: "Balde",

        pesoLiquidoVolume: 550,

        pesoBrutoVolume: 600,

        idSubVolume: null,

        descricaoSubVolume: null

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
        <div className='geral'>
            <Header className='header'/>


            <div className='container'>

            <div className='title'>
                <Title
                    text={'Gerador de QRCode'}
                    color={'black'}
                    fontSize={'30px'}
                />
            </div>

                <div className='input-qrcode'>
                    <input
                        value={quantidadeEtiquetas}
                        type='number'
                        min={1}
                        max={valueQrCode.length}
                        placeholder='Quantidade de etiquetas'
                        onChange={handleQrcode}
                    />
                </div>

                <Button
                    onClick={handleGenerate}
                    className='button-generator'
                    text={'Gerar Lista'}
                    color={'white'}
                    padding={'10px'}
                    fontSize={'23px'}
                    borderRadius={'5px'}
                    width={250}
                />

                <Button
                    onClick={handlePrint}
                    className='button-printer'
                    text={'Imprimir Etiquetas'}
                    color={'white'}
                    padding={'10px'}
                    fontSize={'23px'}
                    borderRadius={'5px'}
                    width={250}
                />
                <div >
                    <Button
                        href={qrCodeLink}
                        className='button-download'
                        download={`qrcode.png`}
                        text={'Baixar QRCode'}
                        padding={'10px'}
                        borderRadius={'5px'}
                        fontSize={'23px'}
                        width={250}
                    />
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
