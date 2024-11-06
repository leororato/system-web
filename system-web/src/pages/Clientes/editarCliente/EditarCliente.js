import { useLocation, useNavigate, useParams } from "react-router-dom";
import Title from "../../../components/Title";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Header from "../../../components/Header/Header";
import { useEffect, useState } from "react";
import './EditarCliente.css'
import ErrorNotification from "../../../components/ErrorNotification/ErrorNotification";
import SucessNotification from "../../../components/SucessNotification/SucessNotification";
import api from '../../../axiosConfig';
import Cookies from 'js-cookie';

function EditarCliente() {

    const navigate = useNavigate();
    const { id } = useParams();

    const location = useLocation();
    const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);

    const userId = Cookies.get('userId');
    const usuario = {
        id: userId
    }
    const [infoCliente, setInfoCliente] = useState({
        cliente: {
            nome: null,
            email: null,
            endereco: null,
            telefoneFax: null,
        },
        clienteApp: {
            sigla_codigo_identificacao: null,
            codigo_identificacao: null
        }
    });
    const [formData, setFormData] = useState({
        id: id,
        sigla_codigo_identificacao: null,
        codigo_identificacao: null
    })

    useEffect(() => {
        const fetchCliente = async () => {

            try {
                const response = await api.get(`/clienteApp/listar-cliente-para-edicao/${id}`);

                setInfoCliente(response.data);
                setFormData({
                    id: id,
                    sigla_codigo_identificacao: response.data.clienteApp.sigla_codigo_identificacao,
                    codigo_identificacao: response.data.clienteApp.codigo_identificacao
                });
                console.log('resp: ', response.data);

            } catch (error) {
                const errorMessage = error.response?.data || "Erro ao buscar os containers Nomus(requisição nomus por id)";
                setErrorMessage(errorMessage);

                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
            }
        }
        fetchCliente();

    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleCancel = async (event) => {
        event.preventDefault();
        navigate(-1);
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const nome = infoCliente.cliente.nome;

        const clienteAppRequest = {
            clienteApp: formData,
            usuario: usuario
        }
        try {
            await api.post(`/clienteApp`, clienteAppRequest);
            navigate('/clientes', { state: { sucessMessage: `O cliente '${nome}' foi atualizado com sucesso!` } });

        } catch (error) {
            const errorMessage = error.response?.data || "Erro desconhecido ao tentar atualizar o Cliente!";
            setErrorMessage(errorMessage);

            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
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

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => setSucessMessage(null)} />
            <SucessNotification message={sucessMessage} onClose={() => setSucessMessage(null)} />

            <div className='editar-encapsulado'>
                <div className="form-container-cliente">
                    <Title text={'Editar Cliente'} color={'#1780e2'} />
                    <form onSubmit={handleSubmit}>
                        <div className="input-grupo">
                            <div>
                                <label htmlFor="id">ID:</label>
                                <Input
                                    type="text"
                                    id="none-edit"
                                    title="ID do cliente"
                                    placeholder="ID"
                                    backgroundColor={'#ccc'}
                                    name="id"
                                    padding={7}
                                    readOnly
                                    defaultValue={id ?? ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="nome">Nome:</label>
                                <Input
                                    type="text"
                                    id="none-edit"
                                    title="Não é possível editar o nome do cliente..."
                                    placeholder={"Nome"}
                                    backgroundColor={'#ccc'}
                                    name="nome"
                                    padding={7}
                                    value={infoCliente.cliente.nome ?? ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="endereco">Endereço:</label>
                                <Input
                                    type="text"
                                    id="none-edit"
                                    title="Não é possível editar o endereço do cliente..."
                                    placeholder="Endereço"
                                    backgroundColor={'#ccc'}
                                    name="endereco"
                                    padding={7}
                                    value={infoCliente.cliente.endereco ?? ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email:</label>
                                <Input
                                    type="email"
                                    id="none-edit"
                                    title="Não é possível editar o email do cliente..."
                                    placeholder="Email"
                                    backgroundColor={'#ccc'}
                                    name="email"
                                    padding={7}
                                    readOnly
                                    value={infoCliente.cliente.email ?? ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="telefoneFax">Telefone/Fax:</label>
                                <Input
                                    type="tel"
                                    id="none-edit"
                                    title="Não é possível editar o telefone/fax do cliente..."
                                    placeholder="Telefone/Fax"
                                    backgroundColor={'#ccc'}
                                    name="telefoneFax"
                                    padding={7}
                                    readOnly='readOnly'
                                    value={infoCliente.cliente.telefoneFax ?? ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="sigla_codigo_identificacao">Sigla/Código de Identificação:</label>
                                <Input
                                    type="text"
                                    id="input-sc-identificacao"
                                    title="Sigla/Código de Identificação"
                                    placeholder="Sigla/Código de Identificação"
                                    name="sigla_codigo_identificacao"
                                    padding={7}
                                    value={formData.sigla_codigo_identificacao ?? ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="codigo_identificacao">Código de Identificação:</label>
                                <Input
                                    type="text"
                                    id="input-cod-identificacao"
                                    title="Código de Identificação"
                                    placeholder="Código de Identificação"
                                    name="codigo_identificacao"
                                    padding={7}
                                    value={formData.codigo_identificacao ?? ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="button-save-edit-cliente">
                            <div>
                                <Button
                                    className={"button-save"}
                                    text={"Salvar"}
                                    title={"Botão Salvar"}
                                    type={"submit"}
                                    padding={8}
                                    width={150}
                                    color="white"
                                    fontSize={20}
                                    borderRadius={5}
                                /></div>

                            <div>
                                <Button
                                    className={"button-cancel"}
                                    text={"Cancelar"}
                                    type={'button'}
                                    padding={8}
                                    width={150}
                                    color="white"
                                    fontSize={20}
                                    borderRadius={5}
                                    onClick={handleCancel}
                                /></div>
                        </div>
                    </form>
                </div>
            </div>



        </div>
    );
}

export default EditarCliente;
