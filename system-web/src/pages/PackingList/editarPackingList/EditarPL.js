import Header from "../../../components/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './EditarPL.css';
import Button from "../../../components/Button";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import Select from "../../../components/Select";
import Input from "../../../components/Input";

function EditarPL() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [clientesNomus, setClientesNomus] = useState([]);
    const [formData, setFormData] = useState({
        paisOrigem: '',
        fronteira: '',
        localEmbarque: '',
        localDestino: '',
        termosPagamento: '',
        dadosBancarios: '',
        incoterm: '',
        invoice: '',
        tipoTransporte: '',
        pesoLiquidoTotal: '',
        pesoBrutoTotal: '',
        idioma: '',
        idImportador: '',
        idConsignatario: '',
        idNotificado: ''
    });

    useEffect(() => {
        const fetchPackingList = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/packinglist/${id}`);
                setFormData(response.data);
            } catch (error) {
                console.error("Erro ao buscar Packing List", error);
            }
        };

        fetchPackingList();
    }, [id]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/clienteNomus')
            .then(response => setClientesNomus(response.data))
            .catch(error => console.error('Erro ao buscar clientes:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAutocompleteChange = (field) => (item) => {
        setFormData(prevData => ({
            ...prevData,
            [field]: item.id
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/packinglist/${id}`, formData);
            alert("Packing List Atualizado!");
            navigate("/inicio");
        } catch (error) {
            console.error("Erro ao atualizar o Packing List", error);
            alert("Erro ao atualizar o Packing List");
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    return (
        <div>
            <Header />
            <div className="body-editar">
                <form onSubmit={handleSubmit} className="form-editar-pl">
                    <div className="input-group">
                        <label>País de Origem:</label>
                        <Select
                            className="form-pais-origem"
                            name="paisOrigem"
                            options={[{ value: 'Brasil', label: 'Brasil' }]}
                            value={formData.paisOrigem}
                            onChange={e => setFormData({ ...formData, paisOrigem: e.target.value })}
                        />

                        <label>Fronteira:</label>
                        <Input
                            type="text"
                            name="fronteira"
                            value={formData.fronteira}
                            onChange={handleChange}
                        />
                        <label>Local de Embarque:</label>
                        <Input
                            type="text"
                            name="localEmbarque"
                            value={formData.localEmbarque}
                            onChange={handleChange}
                        />
                        <label>Local de Destino:</label>
                        <Input
                            type="text"
                            name="localDestino"
                            value={formData.localDestino}
                            onChange={handleChange}
                        />
                        <label>Termos de Pagamento:</label>
                        <Input
                            type="text"
                            name="termosPagamento"
                            value={formData.termosPagamento}
                            onChange={handleChange}
                        />
                        <label>Dados Bancários:</label>
                        <Input
                            type="text"
                            name="dadosBancarios"
                            value={formData.dadosBancarios}
                            onChange={handleChange}
                        />
                        <label>Incoterm:</label>
                        <Input
                            type="text"
                            name="incoterm"
                            value={formData.incoterm}
                            onChange={handleChange}
                        />
                        <label>Invoice:</label>
                        <Input
                            type="text"
                            name="invoice"
                            value={formData.invoice}
                            onChange={handleChange}
                        />
                        <label>Tipo de Transporte:</label>
                        <Input
                            type="text"
                            name="tipoTransporte"
                            value={formData.tipoTransporte}
                            onChange={handleChange}
                        />
                        <label>Peso Líquido Total:</label>
                        <Input
                            type="text"
                            name="pesoLiquidoTotal"
                            value={formData.pesoLiquidoTotal}
                            onChange={handleChange}
                        />
                        <label>Peso Bruto Total:</label>
                        <Input
                            type="text"
                            name="pesoBrutoTotal"
                            value={formData.pesoBrutoTotal}
                            onChange={handleChange}
                        />
                        <label>Idioma:</label>
                        <Select
                            className="form-idioma"
                            name="idioma"
                            options={[
                                { value: 'Portugues', label: 'Português' },
                                { value: 'Espanhol', label: 'Espanhol' },
                                { value: 'Ingles', label: 'Inglês' }
                            ]}
                            value={formData.idioma}
                            onChange={e => setFormData({ ...formData, idioma: e.target.value })}
                        />

                        <label>Importador</label>
                        <Autocomplete
                            data={clientesNomus}
                            onSelect={handleAutocompleteChange('idImportador')}
                        />
                        
                        <label>Consignatário:</label>
                        <Autocomplete
                            data={clientesNomus}
                            onSelect={handleAutocompleteChange('idConsignatario')}
                        />
                        
                        <label>Notificado:</label>
                        <Autocomplete
                            data={clientesNomus}
                            onSelect={handleAutocompleteChange('idNotificado')}
                        />
                    </div>
                    <div className="buttons-editar-pl">
                        <Button
                            className="button-save"
                            text="Salvar"
                            type="submit"
                        />
                        <Button
                            className="button-cancel"
                            text="Cancelar"
                            onClick={handleCancel}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarPL;
