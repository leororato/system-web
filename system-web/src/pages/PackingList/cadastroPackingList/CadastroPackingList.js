// src/pages/CadastroPackingList/CadastroPackingList.js
import Header from "../../../components/Header/Header";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import Title from "../../../components/Title";
import Button from "../../../components/Button";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";

import './CadastroPackingList.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";

function CadastroPackingList() {

    const navigate = useNavigate();

    const [sucessMessage, setSucessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [bancoResponse, setBancoResponse] = useState("");
    const [agenciaResponse, setAgenciaResponse] = useState("");
    const [contaResponse, setContaResponse] = useState("");
    const [swiftResponse, setSwiftResponse] = useState("");
    const [ibanResponse, setIbanResponse] = useState("");

    const [clientesNomus, setClientesNomus] = useState([]);
    const [formData, setFormData] = useState({
        idImportador: "",
        idConsignatario: "",
        idNotificado: "",
        paisOrigem: "",
        fronteira: "",
        localEmbarque: "",
        localDestino: "",
        termosPagamento: "",
        dadosBancarios: "",
        incoterm: "",
        invoice: "",
        tipoTransporte: "",
        pesoLiquidoTotal: "",
        pesoBrutoTotal: "",
        idioma: ""
    });

    useEffect(() => {
        axios.get('http://localhost:8080/api/clienteNomus')
            .then(response =>

                setClientesNomus(response.data))

            .catch(error => {

                const errorMessage = error.response?.data || "Erro desconhecido ao buscar clientes";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000);
            })

    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangeBanco = (e) => {
        const value = e.target.value;
        setBancoResponse(value);
    };

    const handleChangeAgencia = (e) => {
        const value = e.target.value;
        setAgenciaResponse(value);
    };

    const handleChangeConta = (e) => {
        const value = e.target.value;
        setContaResponse(value);
    };

    const handleChangeSwift = (e) => {
        const value = e.target.value;
        setSwiftResponse(value);
    };

    const handleChangeIban = (e) => {
        const value = e.target.value;
        setIbanResponse(value);
    };

    useEffect(() => {
        setFormData({ ...formData, dadosBancarios: bancoResponse + '$' + agenciaResponse + '$' + contaResponse + '$' + swiftResponse + '$' + ibanResponse })
    }, [bancoResponse, agenciaResponse, contaResponse, swiftResponse, ibanResponse]);

    const handleSelectChangePaisOrigem = (e) => {
        setFormData({ ...formData, paisOrigem: e.target.value });
    };

    const handleSelectChangeIdioma = (e) => {
        setFormData({ ...formData, idioma: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/api/packinglist', formData)
            .then(() => {
                setSucessMessage('PackingList criado com sucesso!');
                navigate('/inicio', { state: { sucessMessage: 'PackingList criado com sucesso!' } });
            })
            .catch(error => {

                const errorMessage = error.response?.data || "Erro desconhecido ao criar PackingList";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000)

            });
    };

    const handleErrorClose = () => {
        setErrorMessage(null);
        setSucessMessage(null);
    }

    const handleCancel = (e) => {
        e.preventDefault();
        navigate(-1);
    }

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={handleErrorClose} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

            <div className="title-container">
                <Title text={"Cadastro de Packing List"} className={"title"} />
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="form-cadastro-pl">
                    <div className="input-group">

                        <div className="form-importador">
                            <label htmlFor="idImportador">Importador:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={(item) => setFormData({ ...formData, idImportador: item.id })}
                                displayField={'nome'}
                                title={'Busque pelo Importador...'}
                            />
                        </div>
                        <div className="form-consignatario">
                            <label htmlFor="idConsignatario">Consignatário:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={(item) => setFormData({ ...formData, idConsignatario: item.id })}
                                displayField={'nome'}
                                title={'Busque pelo Consignatário...'}
                            />
                        </div>
                        <div className="form-notificado">
                            <label htmlFor="idNotificado">Notificado:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={(item) => setFormData({ ...formData, idNotificado: item.id })}
                                displayField={'nome'}
                                title={'Busque pelo Notificado...'}
                            />
                        </div>

                        <div id="select-container">
                            <Select
                                className={"form-pais-origem"}
                                label={"País de origem:"}
                                title={"Selecione o país de origem..."}
                                name="paisOrigem"
                                padding={7}
                                cursor={'pointer'}
                                placeholder={'Selecione'}
                                required
                                options={[{ value: 'Brasil', label: 'Brasil' }]}
                                onChange={handleSelectChangePaisOrigem}
                            /></div>
                        <div>
                            <label>Fronteira:</label>
                            <Input
                                type={"text"}
                                id="input-fronteira"
                                title={"Digite a fronteira..."}
                                placeholder={"Ex: PARANAGUÁ, PR, BRASIL..."}
                                name="fronteira"
                                padding={7}
                                required
                                onChange={handleChange}
                            /></div>
                        <div>
                            <label>Local de Embarque:</label>
                            <Input
                                type={"text"}
                                id="input-local-embarque"
                                title={"Digite o local de embarque dos itens..."}
                                placeholder={"Ex: ARARUNA, PR, BRASIL..."}
                                name="localEmbarque"
                                padding={7}
                                required
                                onChange={handleChange}
                            /></div>
                        <div>
                            <label>Local de Destino:</label>
                            <Input
                                type={"text"}
                                id="input-local-destino"
                                title={"Digite o local de destino dos itens..."}
                                placeholder={"Ex: PUERTO CORTÉS, HONDURAS..."}
                                padding={7}
                                name="localDestino"
                                required
                                onChange={handleChange}
                            /></div>
                        <div>
                            <label>Termos de Pagamento:</label>
                            <Input
                                type={"text"}
                                id="input-termos-pagamento"
                                title={"Digite os termos de pagamento..."}
                                placeholder={"Ex: (5% ADVANCE) + (45% EN ENERO) + (50% EN LA ENTREGA)..."}
                                name="termosPagamento"
                                padding={7}
                                required
                                onChange={handleChange}
                            /></div>


                        <div id="container-total-dados-bancarios">
                            <label>Dados Bancários:</label>
                            <div id="dados-bancarios">
                                <div className="container-dadosbancarios">
                                    <div id="div-dados-bancarios">
                                        <label>Banco:</label>
                                        <Input
                                            type={"text"}
                                            id="input-dados-bancarios"
                                            title={"Digite os dados bancários do cliente..."}
                                            placeholder={"Ex: Banco Bradesco S/A..."}
                                            name="dadosBancarios"
                                            padding={7}
                                            required
                                            onChange={handleChangeBanco}
                                        /></div>
                                    <div id="div-dados-bancarios">
                                        <label>Agência:</label>
                                        <Input
                                            type={"text"}
                                            id="input-dados-bancarios"
                                            title={"Digite os dados bancários do cliente..."}
                                            placeholder={"Ex: 5815-7..."}
                                            name="dadosBancarios"
                                            padding={7}
                                            required
                                            onChange={handleChangeAgencia}
                                        /></div>
                                    <div id="div-dados-bancarios">
                                        <label>Swift:</label>
                                        <Input
                                            type={"text"}
                                            id="input-dados-bancarios"
                                            title={"Digite os dados bancários do cliente..."}
                                            placeholder={"Ex: BBDEBRSPSPO..."}
                                            name="dadosBancarios"
                                            padding={7}
                                            required
                                            onChange={handleChangeSwift}
                                        /></div>
                                    <div id="div-dados-bancarios">
                                        <label>Iban:</label>
                                        <Input
                                            type={"text"}
                                            id="input-dados-bancarios"
                                            title={"Digite os dados bancários do cliente..."}
                                            placeholder={"Ex: BR86 6074 6948 0581 5000 0631 612C1..."}
                                            name="dadosBancarios"
                                            padding={7}
                                            required
                                            onChange={handleChangeIban}
                                        /></div>

                                </div>
                                <div id="conta-container">
                                    <div id="div-dados-bancarios">
                                        <label>Conta:</label>
                                        <Input
                                            type={"text"}
                                            id="input-dados-bancarios"
                                            title={"Digite os dados bancários do cliente..."}
                                            placeholder={"Ex: 63161-2..."}
                                            name="dadosBancarios"
                                            padding={7}
                                            required
                                            onChange={handleChangeConta}
                                        /></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label>Incoterm:</label>
                            <Input
                                type={"text"}
                                id="input-incoterm"
                                title={"Digite o código INCOTERM..."}
                                placeholder={"Ex: FCA - ARARUNA, PR, BRASIL..."}
                                name="incoterm"
                                padding={7}
                                required
                                onChange={handleChange}
                            /></div>
                        <div>
                            <label>Invoice</label>
                            <Input
                                type={"text"}
                                id="input-invoice"
                                title={"Digite o código INVOICE..."}
                                placeholder={"Ex: INV01..."}
                                name="invoice"
                                padding={7}
                                required
                                onChange={handleChange}
                            /></div>
                        <div>
                            <label>Tipo de Transporte</label>
                            <Input
                                type={"text"}
                                id="input-tipo-transporte"
                                title={"Digite o meio de transporte utilizado..."}
                                placeholder={"Ex: MARÍTIMO..."}
                                name="tipoTransporte"
                                padding={7}
                                required
                                onChange={handleChange}
                            /></div>
                        <div>
                            <label>Peso Líquido Total</label>
                            <Input
                                type={"number"}
                                id="input-peso-liquido"
                                title={"Digite o peso LÍQUIDO total..."}
                                placeholder={"Ex: 24366,275..."}
                                name="pesoLiquidoTotal"
                                padding={7}
                                required
                                onChange={handleChange}
                            /></div>
                        <div>
                            <label>Peso Bruto Total</label>
                            <Input
                                type={"number"}
                                id="input-peso-bruto"
                                title={"Digite o peso BRUTO total..."}
                                placeholder={"Ex: 24921,710..."}
                                name="pesoBrutoTotal"
                                padding={7}
                                required
                                onChange={handleChange}
                            /></div>

                        <div className="form-idioma">
                            <Select
                                className={"form-idioma"}
                                label={"Idioma:"}
                                title={"Selecione o idioma..."}
                                name="idioma"
                                padding={7}
                                cursor={'pointer'}
                                placeholder={'Selecione'}
                                required
                                options={[
                                    { value: 'Português', label: 'Português' },
                                    { value: 'Espanhol', label: 'Espanhol' },
                                    { value: 'Inglês', label: 'Inglês' },
                                ]}
                                onChange={handleSelectChangeIdioma}
                            />
                        </div>
                    </div>
                    <div className="botoes-finais">
                        <div className="container-button-save">
                            <Button
                                className={"button-save"}
                                text={"Salvar"}
                                title={"Salvar"}
                                type={"submit"}
                                onClick={handleSubmit}
                            />
                        </div>

                        <div className="container-button-cancel">
                            <Button
                                className={"button-cancel"}
                                text={"Cancelar"}
                                title={"Cancelar"}
                                type={"button"}
                                onClick={handleCancel}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CadastroPackingList;
