import Header from "../../../components/Header/Header";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './EditarPL.css';
import Button from "../../../components/Button";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import Title from "../../../components/Title";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import api from '../../../axiosConfig';
import Loading from "../../../components/Loading/Loading";
import Cookies from 'js-cookie';

function EditarPL() {

    const navigate = useNavigate();

    const { id } = useParams();

    const location = useLocation();
    const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [contextLoading, setContextLoading] = useState({ visible: true });
    const [estadoDaPagina, setEstadoDaPagina] = useState("Carregando");

    const [bancoResponse, setBancoResponse] = useState("");
    const [agenciaResponse, setAgenciaResponse] = useState("");
    const [contaResponse, setContaResponse] = useState("");
    const [swiftResponse, setSwiftResponse] = useState("");
    const [ibanResponse, setIbanResponse] = useState("");

    const [clientesNomus, setClientesNomus] = useState([]);

    const userId = Cookies.get('userId');
    const usuario = { id: userId }
    const [formData, setFormData] = useState({});


    useEffect(() => {
        fetchPackingList();
    }, [id]);

    const fetchPackingList = async () => {
        setEstadoDaPagina("Carregando");

        try {
            const response = await api.get(`/packinglist/listar-packinglist-edicao/${id}`);
            setFormData(response.data);
            console.log('resp>', response.data)
            setFormData(formData => ({
                ...formData,
                registro_alterado_por: userId
            }));

            setContextLoading({ visible: true });
            let dadosBancarios = response.data.dadosBancarios;
            if (dadosBancarios != null) {

                let dadosBancariosSeparados = dadosBancarios.split('$')

                setBancoResponse(dadosBancariosSeparados[0]);
                setAgenciaResponse(dadosBancariosSeparados[1]);
                setContaResponse(dadosBancariosSeparados[2]);
                setSwiftResponse(dadosBancariosSeparados[3]);
                setIbanResponse(dadosBancariosSeparados[4]);
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar PackingList";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

        } finally {
            setContextLoading({ visible: false });
        }
    };


    useEffect(() => {
        fetchClienteNomus();
    }, []);

    const fetchClienteNomus = async () => {
        setEstadoDaPagina("Carregando");
        setContextLoading({ visible: true });

        try {
            const response = await api.get(`/clienteNomus`);
            setClientesNomus(response.data);

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar cliente Nomus";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        } finally {
            setContextLoading({ visible: false });
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoDaPagina("Salvando...")
        setContextLoading({ visible: true });

        const packingListRequest = {
            packingList: formData,
            usuario: usuario
        }

        try {
            await api.put(`/packinglist/${id}`, packingListRequest);

            navigate('/inicio', { state: { sucessMessage: `PackingList ${id} atualizado com sucesso!` } }, setTimeout(() => setSucessMessage(null), 5000));

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao tentar atualizar a PackingList!";
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
    }

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


    const handleCancel = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={handleErrorClose} />
            <SucessNotification message={sucessMessage} onClose={() => setSucessMessage(null)} />
            <div className="body-editar">
                <form onSubmit={handleSubmit} className="form-editar-pl">
                    <div className="input-group">

                        <div>
                            <Title
                                text={`Editar PackingList ${id}`}
                                color={'#1780e2'}
                            />
                        </div>

                        <div>
                            <label>Importador:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={handleAutocompleteChange('idImportador')}
                                displayField={'nome'}
                                value={formData.nomeClienteImportador}
                            />
                        </div>

                        <div>
                            <label>Consignatário:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={handleAutocompleteChange('idConsignatario')}
                                displayField={'nome'}
                                value={formData.nomeClienteConsignatario}
                            />
                        </div>

                        <div>
                            <label>Notificado:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={handleAutocompleteChange('idNotificado')}
                                displayField={'nome'}
                                value={formData.nomeClienteNotificado}
                            />
                        </div>
                        <div id="select-div">
                            <label>País de Origem:</label>
                            <Select
                                className="form-pais-origem"
                                name="paisOrigem"
                                placeholder={"Selecione"}
                                options={[{ value: 'Brasil', label: 'Brasil' }]}
                                value={formData.paisOrigem}
                                onChange={e => setFormData({ ...formData, paisOrigem: e.target.value })}
                            />
                        </div>

                        <div>
                            <label>Fronteira:</label>
                            <Input
                                id="input-group-2"
                                type="text"
                                name="fronteira"
                                placeholder={'Digite a fronteira...'}
                                value={formData.fronteira}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Local de Embarque:</label>
                            <Input
                                type="text"
                                name="localEmbarque"
                                placeholder={'Digite o local de embarque...'}
                                value={formData.localEmbarque}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Local de Destino:</label>
                            <Input
                                type="text"
                                name="localDestino"
                                placeholder={'Digite o local de destino...'}
                                value={formData.localDestino}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Termos de Pagamento:</label>
                            <Input
                                type="text"
                                name="termosPagamento"
                                placeholder={'Digite os termos de pagamento...'}
                                value={formData.termosPagamento}
                                onChange={handleChange}
                            />
                        </div>

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
                                            value={bancoResponse}
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
                                            value={agenciaResponse}
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
                                            value={swiftResponse}
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
                                            value={ibanResponse}
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
                                            value={contaResponse}
                                            onChange={handleChangeConta}
                                        /></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label>Incoterm:</label>
                            <Input
                                type="text"
                                name="incoterm"
                                placeholder={'Digite o INCOTERM...'}
                                value={formData.incoterm}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Invoice:</label>
                            <Input
                                type="text"
                                name="invoice"
                                placeholder={'Digite o INVOICE...'}
                                value={formData.invoice}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Tipo de Transporte:</label>
                            <Select
                                className="form-idioma"
                                name="tipoTransporte"
                                placeholder={'Selecione'}
                                options={[
                                    { value: 'Terrestre', label: 'Terrestre' },
                                    { value: 'Marítimo', label: 'Marítimo' },
                                    { value: 'Aéreo', label: 'Aéreo' }
                                ]}
                                value={formData.tipoTransporte}
                                onChange={e => setFormData({ ...formData, tipoTransporte: e.target.value })}
                            />
                        </div>

                        <div>
                            <label>Peso Líquido Total:</label>
                            <Input
                                type="text"
                                name="pesoLiquidoTotal"
                                placeholder={'Não é possível editar o peso líquido total...'}
                                title={'Não é possível editar o peso líquido total...'}
                                backgroundColor={"#ccc"}
                                value={formData.pesoLiquidoTotal}
                                readOnly
                            />
                        </div>

                        <div>
                            <label>Peso Bruto Total:</label>
                            <Input
                                type="text"
                                name="pesoBrutoTotal"
                                placeholder={'Não é possível editar o peso bruto total...'}
                                title={'Não é possível editar o peso bruto total...'}
                                backgroundColor={"#ccc"}
                                value={formData.pesoBrutoTotal}
                                readOnly
                            />
                        </div>

                        <div id="select-div">
                            <label>Idioma:</label>
                            <Select
                                className="form-idioma"
                                name="idioma"
                                placeholder={'Selecione'}
                                options={[
                                    { value: 'Espanhol', label: 'Espanhol' },
                                    { value: 'Inglês', label: 'Inglês' },
                                ]}
                                value={formData.idioma}
                                onChange={e => setFormData({ ...formData, idioma: e.target.value })}
                            />
                        </div>

                        <div>
                            <label>Status:</label>
                            <Select
                                className="status-packinglist"
                                name="status"
                                placeholder={'Selecione'}
                                options={[
                                    { value: false, label: 'Em andamento' },
                                    { value: true, label: 'Finalizado' }
                                ]}
                                value={formData.finalizado}
                                onChange={e => setFormData({ ...formData, finalizado: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="botoes-finais-edicao" style={{ marginTop: '20px' }}>
                        <Button type="submit" className={"botao-salvar"}
                            text={"Salvar"}
                        />
                        <Button onClick={handleCancel} className={"botao-cancelar"}
                            text={"Cancelar"}
                        />
                    </div>
                </form>
            </div>

            {contextLoading.visible ? (
                <Loading message={estadoDaPagina === "Carregando" ? "Carregando..." : "Salvando..."} />
            ) : (
                <> </>
            )}


        </div>
    );
}

export default EditarPL;
