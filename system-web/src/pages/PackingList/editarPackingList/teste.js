
import Header from "../../../components/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import './EditarPL.css';
import Button from "../../../components/Button";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";

function EditarPL() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [clienteNomus, setClientesNomus] = useState([]);
    const [packingList, setPackingList] = useState(null);
    const [formData, setFormData] = useState({
        idImportador: '',
        idConsignatario: '',
        idNotificado: '',
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
        idioma: ''
    });

    useEffect(() => {
        const fetchPackingList = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/packinglist/${id}`);
                setPackingList(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Erro ao buscar Packing List", error);
            }
        };

        fetchPackingList();
    }, [id]);

    // Especifico do Autocomplete IMPORTADOR CONSIG E NOTIF...
    useEffect(() => {
        axios.get('http://localhost:8080/api/clienteNomus')
            .then(response => setClientesNomus(response.data))
            .catch(error => console.error('Erro ao buscar clientes:', error));
    }, []);

    if (!packingList) {
        return <div>Carregando...</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
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


    return (
        <div>
            <Header />
            <div className="body-editar">
            <form onSubmit={handleSubmit} className="form-editar-pl">
                <div className='container-edicao-pl'>
                    <ul id="ul-edicao">
                        <li className="header-edicao" style={{ backgroundColor: "#1780e2" }}>
                            <div id="header-left">Campo</div>
                            <div id="header-higth">Valor</div>
                        </li>
                       
                        <li id="ed">
                            <label htmlFor="paisOrigem" id="lb">País Origem</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="paisOrigem"
                                name="paisOrigem"
                                value={formData.paisOrigem || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="Importador" id="lb">Importador</label>
                            <Autocomplete 
                            data={clienteNomus}
                            onSelect={(item) => setFormData({ ...formData, idImportador: item.id})}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="Consignatario" id="lb">Consignatário</label>
                            <Autocomplete 
                            data={clienteNomus}
                            onSelect={(item) => setFormData({...formData, idConsignatario: item.id })}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="Notificado" id="lb">Notificado</label>
                            <Autocomplete 
                            data={clienteNomus}
                            onSelect={(item) => setFormData({...formData, idNotificado: item.id })}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="fronteira" id="lb">Fronteira</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="fronteira"
                                name="fronteira"
                                value={formData.fronteira || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="localEmbarque" id="lb">Local Embarque</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="localEmbarque"
                                name="localEmbarque"
                                value={formData.localEmbarque || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="localDestino" id="lb">Local Destino</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="localDestino"
                                name="localDestino"
                                value={formData.localDestino || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="termosPagamento" id="lb">Termos Pagamento</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="termosPagamento"
                                name="termosPagamento"
                                value={formData.termosPagamento || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="dadosBancarios" id="lb">Dados Bancários</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="dadosBancarios"
                                name="dadosBancarios"
                                value={formData.dadosBancarios || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="incoterm" id="lb">Incoterm</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="incoterm"
                                name="incoterm"
                                value={formData.incoterm || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="invoice" id="lb">Invoice</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="invoice"
                                name="invoice"
                                value={formData.invoice || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="tipoTransporte" id="lb">Tipo Transporte</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="tipoTransporte"
                                name="tipoTransporte"
                                value={formData.tipoTransporte || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="pesoLiquidoTotal" id="lb">Peso Líquido Total</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="pesoLiquidoTotal"
                                name="pesoLiquidoTotal"
                                value={formData.pesoLiquidoTotal || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="pesoBrutoTotal" id="lb">Peso Bruto Total</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="pesoBrutoTotal"
                                name="pesoBrutoTotal"
                                value={formData.pesoBrutoTotal || ''}
                                onChange={handleChange}
                            />
                        </li>
                        <li id="ed">
                            <label htmlFor="idioma" id="lb">Idioma</label>
                            <input
                                className="input-edicao"
                                type="text"
                                id="idioma"
                                name="idioma"
                                value={formData.idioma || ''}
                                onChange={handleChange}
                            />
                        </li>
                    </ul>
                <div className="buttons-editar-pl">
                <Button 
                className={"button-salvar-pl"}
                text={"Salvar"}
                />
                <Button 
                className={"button-cancelar-pl"}
                text={"Cancelar"}
                />
                </div>
                </div>
            </form>
            </div>
        </div>
    );
}

export default EditarPL;
