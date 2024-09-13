import Header from "../../../components/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import './EditarPL.css';
import Button from "../../../components/Button";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import Title from "../../../components/Title";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";

function EditarPL() {

    const navigate = useNavigate();

    const { id } = useParams();

    const location = useLocation();
    const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);

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
        const fetchPackingList = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/packinglist/${id}`);
                setFormData(response.data);

                let dadosBancarios = response.data.dadosBancarios;
                let dadosBancariosSeparados = dadosBancarios.split('$')
                
                setBancoResponse(dadosBancariosSeparados[0]);
                setAgenciaResponse(dadosBancariosSeparados[1]);
                setContaResponse(dadosBancariosSeparados[2]);
                setSwiftResponse(dadosBancariosSeparados[3]);
                setIbanResponse(dadosBancariosSeparados[4]);
            } catch (error) {

                const errorMessage = error.response?.data || "Erro desconhecido ao buscar PackingList";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);

            }
        };

        fetchPackingList();
    }, [id]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/clienteNomus')
            .then(response =>

                setClientesNomus(response.data))

            .catch(error => {

                const errorMessage = error.response?.data || "Erro desconhecido ao buscar cliente Nomus";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000)

            })

    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:8080/api/packinglist/${id}`, formData);

            navigate('/inicio', { state: { sucessMessage: `PackingList ${id} atualizado com sucesso!` } });

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao tentar atualizar a PackingList!";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);

        }
    };



    useEffect(() => {
        if (formData.idImportador || formData.idConsignatario || formData.idNotificado) {
            Promise.all([
                formData.idImportador ? axios.get(`http://localhost:8080/api/clienteNomus/${formData.idImportador}`) : Promise.resolve({ data: { nome: '' } }),
                formData.idConsignatario ? axios.get(`http://localhost:8080/api/clienteNomus/${formData.idConsignatario}`) : Promise.resolve({ data: { nome: '' } }),
                formData.idNotificado ? axios.get(`http://localhost:8080/api/clienteNomus/${formData.idNotificado}`) : Promise.resolve({ data: { nome: '' } })
            ]).then((responses) => {
                setGuardarNomes({
                    nomeImportador: responses[0].data.nome,
                    nomeConsignatario: responses[1].data.nome,
                    nomeNotificado: responses[2].data.nome
                });
            })
                .catch(error => {

                    const errorMessage = error.response?.data || "Erro desconhecido ao buscar nomes dos clientes atuais";
                    setErrorMessage(errorMessage);

                    setTimeout(() => {
                        setErrorMessage(null);
                    }, 5000);
                });

        }
    }, [formData.idImportador, formData.idConsignatario, formData.idNotificado]);



    const handleErrorClose = () => {
        setErrorMessage(null);
    }


    useEffect(() => {
        if (sucessMessage) {
            const timer = setTimeout(() => {
                setSucessMessage(null);
                // Limpa o estado de navegação para evitar que a mensagem apareça ao recarregar a página
                navigate('/inicio', { replace: true, state: {} });
            }, 5000);

            // Limpar o timeout caso o componente seja desmontado antes dos 5 segundos
            return () => clearTimeout(timer);
        }
    }, [sucessMessage, navigate]);


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
                                placeholder={'Digite o peso LÍQUIDO total...'}
                                value={formData.pesoLiquidoTotal}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Peso Bruto Total:</label>
                            <Input
                                type="text"
                                name="pesoBrutoTotal"
                                placeholder={'Digite o preso BRUTO total...'}
                                value={formData.pesoBrutoTotal}
                                onChange={handleChange}
                            />
                        </div>

                        <div id="select-div">
                            <label>Idioma:</label>
                            <Select
                                className="form-idioma"
                                name="idioma"
                                options={[
                                    { value: 'Português', label: 'Português' },
                                    { value: 'Espanhol', label: 'Espanhol' },
                                    { value: 'Inglês', label: 'Inglês' }
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
        </div>
    );
}

export default EditarPL;
