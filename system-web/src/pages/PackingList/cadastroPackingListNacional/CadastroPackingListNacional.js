import { useEffect, useState } from "react";
import Autocomplete from "../../../components/Autocomplete/Autocomplete";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading/Loading";
import Select from "../../../components/Select";
import { useNavigate } from "react-router-dom";
import api from "../../../axiosConfig";
import Cookies from 'js-cookie';
import Header from "../../../components/Header/Header";
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import Title from "../../../components/Title";



function CadastroPackingListNacional() {
    const navigate = useNavigate();

    const [sucessMessage, setSucessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [contextLoading, setContextLoading] = useState({ visible: false });
    const [estadoDaPagina, setEstadoDaPagina] = useState('');

    const [clientesNomus, setClientesNomus] = useState([]);

    const userId = Cookies.get('userId');
    const usuario = { id: userId };
    const [formData, setFormData] = useState({
        idImportador: null,
        tipoTransporte: null,
        idioma: null
    });



    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoDaPagina('Salvando');
        setContextLoading({ visible: true });

        const packingListRequest = {
            packingList: formData,
            usuario: usuario
        }

        try {
            await api.post('/packinglist/pl-nacional', packingListRequest);
            setSucessMessage('PackingList criado com sucesso!');

            navigate('/inicio', { state: { sucessMessage: 'Packinglist criado com sucesso!' } });
            
        } catch (error) {
            console.log("Dados enviados no submit:", packingListRequest);
            const errorMessage = error.response?.data || "Erro desconhecido ao criar Packinglist";
            setErrorMessage(errorMessage);
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
            console.log("formdata> ", formData)
        } finally {
            setContextLoading({ visible: false });
        }
    };


    useEffect(() => {
        const fetchClienteNomus = async () => {
            setEstadoDaPagina('Carregando');
            setContextLoading({ visible: true });

            try {
                const response = await api.get('/clienteNomus');
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
        console.log("usuario id: ", userId)
    }, []);


    const handleSelectChangeTipoTransporte = (e) => {
        setFormData({ ...formData, tipoTransporte: e.target.value });
    };

    const handleSelectChangeIdioma = (e) => {
        setFormData({ ...formData, idioma: e.target.value });
    };

    const handleCancel = (e) => {
        e.preventDefault();
        navigate(-1);
    }

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => { setErrorMessage(null) }} />
            <SucessNotification message={sucessMessage} onClose={() => { setSucessMessage(null) }} />

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Title text={"Cadastro Packinglist Nacional"} />
            </div>
            <div className="form-container">
                <form onSubmit={handleSubmit} className="form-cadastro-pl">
                    <div className="input-group">

                        <div className="form-importador">
                            <label htmlFor="idImportador">Cliente:</label>
                            <Autocomplete
                                data={clientesNomus}
                                onSelect={(item) => {
                                    setFormData({ ...formData, idImportador: item.id });
                                }}
                                displayField={'nome'}
                                title={'Busque pelo Importador...'}
                            />
                        </div>

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
                            />
                            </div>

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
                                    { value: 'Português', label: 'Português' },
                                ]}
                                onChange={handleSelectChangeIdioma}
                            />
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
    )
}

export default CadastroPackingListNacional;