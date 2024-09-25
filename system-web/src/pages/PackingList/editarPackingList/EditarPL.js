import Header from "../../../components/Header/Header";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';
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

function EditarPL() {

    // Obtenha o token JWT do cookie
    const token = Cookies.get('jwt');

    // Configure o header da requisição
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

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

    const [guardarNomes, setGuardarNomes] = useState({
        nomeImportador: '',
        nomeConsignatario: '',
        nomeNotificado: ''
    });

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
        fetchPackingList();
    }, [id]);

    const fetchPackingList = async () => {
        setEstadoDaPagina("Carregando");

        try {
            const response = await api.get(`/packinglist/${id}`, config);
            setFormData(response.data);

            setContextLoading({ visible: true });

            let dadosBancarios = response.data.dadosBancarios;
            let dadosBancariosSeparados = dadosBancarios.split('$')

            setBancoResponse(dadosBancariosSeparados[0]);
            setAgenciaResponse(dadosBancariosSeparados[1]);
            setContaResponse(dadosBancariosSeparados[2]);
            setSwiftResponse(dadosBancariosSeparados[3]);
            setIbanResponse(dadosBancariosSeparados[4]);

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
        try {
            const response = await api.get('/clienteNomus', config);
            setClientesNomus(response.data);
            setContextLoading({ visible: true });

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
        try {
            await api.put(`/packinglist/${id}`, formData, config);

            navigate('/inicio', { state: { sucessMessage: `PackingList ${id} atualizado com sucesso!` } }, setTimeout(() => setSucessMessage(null), 5000));
            setContextLoading({ visible: true});

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


    useEffect(() => {
        const fetchClientes = async () => {
            setEstadoDaPagina("Carregando");
    
            try {
                if (formData.idImportador || formData.idConsignatario || formData.idNotificado) {
                    setContextLoading({ visible: true });
    
                    const responses = await Promise.all([
                        formData.idImportador ? api.get(`/clienteNomus/${formData.idImportador}`, config) : Promise.resolve({ data: { nome: '' } }),
                        formData.idConsignatario ? api.get(`/clienteNomus/${formData.idConsignatario}`, config) : Promise.resolve({ data: { nome: '' } }),
                        formData.idNotificado ? api.get(`/clienteNomus/${formData.idNotificado}`, config) : Promise.resolve({ data: { nome: '' } })
                    ]);
    
                    console.log('response:', responses[0].data.nome);

                    setGuardarNomes({
                        nomeImportador: responses[0].data.nome,
                        nomeConsignatario: responses[1].data.nome,
                        nomeNotificado: responses[2].data.nome
                    });
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Erro desconhecido ao buscar nomes dos clientes atuais";
                setErrorMessage(errorMessage);
    
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
            } finally {
                setContextLoading({ visible: false });
            }
        };
    
        fetchClientes();
    
    }, [formData.idImportador, formData.idConsignatario, formData.idNotificado]);
    


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
                                value={guardarNomes.nomeImportador}
                            />
                        </div>

                        <div>
                            <label>Consignatário:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={handleAutocompleteChange('idConsignatario')}
                                displayField={'nome'}
                                value={guardarNomes.nomeConsignatario}
                            />
                        </div>

                        <div>
                            <label>Notificado:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={handleAutocompleteChange('idNotificado')}
                                displayField={'nome'}
                                value={guardarNomes.nomeNotificado}
                            />
                        </div>

                        <div id="select-div">
                            <label>País de Origem:</label>
                            <Select
                                className="form-pais-origem"
                                name="paisOrigem"
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
                            <Input
                                type="text"
                                name="tipoTransporte"
                                placeholder={'Digite o tipo de transporte...'}
                                value={formData.tipoTransporte}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Peso Líquido Total:</label>
                            <Input
                                type="text"
                                name="pesoLiquidoTotal"
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

                    </div>
                    <div className="botoes-finais-edicao">
                        <Button type="submit" className={"button-salvar-edicao"}
                            text={"Salvar"}
                            fontSize={20}
                        />
                        <Button onClick={handleCancel} className={"button-cancelar-edicao"}
                            text={"Cancelar"}
                            fontSize={20}
                        />
                    </div>
                </form>
            </div>

            {contextLoading.visible ? (
                <Loading message={estadoDaPagina == "Carregando" ? "Carregando..." : "Salvando..."} />
            ) : (
                <> </>
            )}


        </div>
    );
}

export default EditarPL;
