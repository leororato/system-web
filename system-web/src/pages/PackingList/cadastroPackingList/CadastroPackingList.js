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

function CadastroPackingList() {
    
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState(null);

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
            .then(response => setClientesNomus(response.data))
            .catch(error => console.error('Erro ao buscar clientes:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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
                alert('Packing List criado com sucesso!');
                navigate('/inicio');
            })
            .catch(error => {
                const errorMessage = error.response?.data || "Erro desconhecido ao criar PackingList";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000)

                console.error("Erro ao criar PackingList", error);
            });
    };

    const handleErrorClose = () => {
        setErrorMessage(null);
    }

    const handleCancel = (e) => {
        e.preventDefault();
        navigate(-1);
    }

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={handleErrorClose} />

            <div className="title-container">
                <Title text={"Cadastro de Packing List"} className={"title"} />
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="form-cadastro-pl">
                    <div className="input-group">
                        <div id="select-container">
                        <Select
                            className={"form-pais-origem"}
                            label={"País de origem:"}
                            title={"Selecione o país de origem"}
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
                            title={"Digite a fronteira"}
                            placeholder={"Digite a fronteira..."}
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
                            title={"Digite o local de embarque dos itens"}
                            placeholder={"Digite o local de embarque..."}
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
                            title={"Digite o local de destino dos itens"}
                            placeholder={"Digite o local de destino..."}
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
                            title={"Digite os termos de pagamento"}
                            placeholder={"Digite os termos de pagamento..."}
                            name="termosPagamento"
                            padding={7}
                            required
                            onChange={handleChange}
                        /></div>
                        <div>
                        <label>Dados Bancários:</label>
                        <Input
                            type={"text"}
                            id="input-dados-bancarios"
                            title={"Digite os dados bancários do cliente"}
                            placeholder={"Digite os dados bancários do cliente..."}
                            name="dadosBancarios"
                            padding={7}
                            required
                            onChange={handleChange}
                        /></div>
                        <div>
                        <label>Incoterm:</label>
                        <Input
                            type={"text"}
                            id="input-incoterm"
                            title={"Digite o código INCOTERM"}
                            placeholder={"Digite o código INCOTERM..."}
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
                            title={"Digite o código INVOICE"}
                            placeholder={"Digite o código INVOICE..."}
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
                            title={"Digite o meio de transporte utilizado"}
                            placeholder={"Digite o tipo de meio de transporte utilizado..."}
                            name="tipoTransporte"
                            padding={7}
                            required
                            onChange={handleChange}
                        /></div>
                        <div>
                        <label>Peso Líquido Total</label>
                        <Input
                            type={"text"}
                            id="input-peso-liquido"
                            title={"Digite o peso LÍQUIDO total"}
                            placeholder={"Digite o peso LÍQUIDO total..."}
                            name="pesoLiquidoTotal"
                            padding={7}
                            required
                            onChange={handleChange}
                        /></div>
                        <div>
                        <label>Peso Bruto Total</label>
                        <Input
                            type={"text"}
                            id="input-peso-bruto"
                            title={"Digite o peso BRUTO total"}
                            placeholder={"Digite o peso BRUTO total..."}
                            name="pesoBrutoTotal"
                            padding={7}
                            required
                            onChange={handleChange}
                        /></div>

                        <div className="form-importador">
                            <label htmlFor="idImportador">Importador:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={(item) => setFormData({ ...formData, idImportador: item.id })}
                                displayField={'nome'}
                            />
                        </div>
                        <div className="form-consignatario">
                            <label htmlFor="idConsignatario">Consignatário:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={(item) => setFormData({ ...formData, idConsignatario: item.id })}
                                displayField={'nome'}
                            />
                        </div>
                        <div className="form-notificado">
                            <label htmlFor="idNotificado">Notificado:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={(item) => setFormData({ ...formData, idNotificado: item.id })}
                                displayField={'nome'}
                            />
                        </div>
                        <div className="form-idioma">
                            <Select
                                className={"form-idioma"}
                                label={"Idioma:"}
                                title={"Selecione o idioma"}
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
