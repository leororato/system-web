// src/pages/CadastroPackingList/CadastroPackingList.js
import Header from "../../../components/Header/Header";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import Title from "../../../components/Title";
import Button from "../../../components/Button";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";

import './CadastroPackingList.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import Cookies from 'js-cookie';
import api from '../../../axiosConfig';
import Loading from "../../../components/Loading/Loading";
import axios from "axios";

function CadastroPackingList() {

    // Obtenha o token JWT do cookie
    const token = Cookies.get('jwt');

    // Configure o header da requisição
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const navigate = useNavigate();

    const [sucessMessage, setSucessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [contextLoading, setContextLoading] = useState({ visible: false });
    const [estadoDaPagina, setEstadoDaPagina] = useState('');

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
        const fetchClienteNomus = async () => {
            setEstadoDaPagina('Carregando');
            setContextLoading({ visible: true });

            try {
                const response = await api.get('/clienteNomus', config);
                setClientesNomus(response.data);

            } catch (error) {
                const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar clientes";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000);
            } finally {
                setContextLoading({ visible: false })
            }
        }

        fetchClienteNomus();

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

    const handleSelectChangeTipoTransporte = (e) => {
        setFormData({ ...formData, tipoTransporte: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoDaPagina('Salvando');
        setContextLoading({ visible: true });

        try {
            const response = await api.post('/packinglist', formData, config);
            setSucessMessage('PackingList criado com sucesso!');

            navigate('/inicio', { state: { sucessMessage: 'Packinglist criado com sucesso!' } });

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao criar Packinglist";
            setErrorMessage(errorMessage);
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
        }
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
                <Title text={"Cadastro de Packinglist"} className={"title"} />
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
                                options={[{ value: 'Brasil', label: 'Brasil' }]}
                                onChange={handleSelectChangePaisOrigem}
                            /></div>
                        <div>
                            <label>Fronteira ou Porto de Expedição:</label>
                            <Input
                                type={"text"}
                                id="input-fronteira"
                                title={"Digite a fronteira..."}
                                placeholder={"Ex: PARANAGUÁ, PR, BRASIL..."}
                                name="fronteira"
                                padding={7}
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
                                onChange={handleChange}
                            /></div>
                        <div>
                            <Select
                                className={"form-tipo-transporte"}
                                label={"Tipo de transporte"}
                                title={"Selecione o tipo de transporte..."}
                                name="tipoTransporte"
                                padding={7}
                                cursor={'pointer'}
                                placeholder={'Selecione'}
                                options={[
                                    { value: 'Terrestre', label: 'Terrestre' },
                                    { value: 'Marítimo', label: 'Marítimo' },
                                    { value: 'Aéreo', label: 'Aéreo' }
                                ]}
                                onChange={handleSelectChangeTipoTransporte}
                            /></div>
                        <div className="form-idioma">
                            <Select
                                className={"form-idioma"}
                                label={"Idioma"}
                                title={"Selecione o idioma..."}
                                name="idioma"
                                padding={7}
                                cursor={'pointer'}
                                placeholder={'Selecione'}
                                required
                                options={[
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
                                className={"botao-salvar"}
                                text={"Salvar"}
                                title={"Salvar"}
                                type={"submit"}
                                onClick={handleSubmit}
                            />
                        </div>

                        <div className="container-button-cancel">
                            <Button
                                className={"botao-cancelar"}
                                text={"Cancelar"}
                                title={"Cancelar"}
                                type={"button"}
                                onClick={handleCancel}
                            />
                        </div>
                    </div>
                </form>
            </div>

            {contextLoading.visible ? (
                <div className="loading">
                    <Loading message={estadoDaPagina === 'Salvando' ? 'Salvando...' : 'Carregando...'} />
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}

export default CadastroPackingList;
