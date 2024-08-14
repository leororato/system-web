import { useNavigate, useParams } from "react-router-dom";
import Title from "../../../components/Title";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import Header from "../../../components/Header/Header";
import { useEffect, useState } from "react";
import './EditarCliente.css'
import axios from "axios";

function EditarCliente() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [clienteExiste, setClienteExiste] = useState();
    const [containerNomus, setContainerNomus] = useState([]);
    const [formData, setFormData] = useState({
        id: id,
        sigla_codigo_identificacao: '',
        codigo_identificacao: ''
    })


    useEffect(() => {
        const fetchContainers = async () => {
            // Buscando o cliente no banco Nomus e salvando todas as informações dele no ContainerNomus
            axios.get(`http://localhost:8080/api/clienteNomus/${id}`)
            .then(response => {
                setContainerNomus(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar os containers Nomus(requisição nomus por id)', error);
            });

            // Buscando o cliente no banco App e salvando todas as informações dele no ContainerApp
            axios.get(`http://localhost:8080/api/clienteApp/${id}`)
            .then(response => {
                // Verifica que o cliente já existe no banco App e vai para o PUT
                setClienteExiste(true);

                setFormData({
                    id: id,
                    sigla_codigo_identificacao: response.data.sigla_codigo_identificacao || '',
                    codigo_identificacao: response.data.codigo_identificacao || ''
                })
            })
            .catch(error => {
                console.error('Erro ao buscar os containers App(requisição app por id)', error);
                // Verifica que o cliente não existe no banco App e vai para o POST
                setClienteExiste(false);
            });
        }
        fetchContainers();
    }, [id]); // Fim do useEffect

    // Guardando as alterações/o que foi digitado no input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    } // Fim do handleChange

    // Função para cancelar a edição, atualizando a página e retornando os valores dos itens
    const handleCancel = async (event) => {
        event.preventDefault();
        navigate(-1);
    }

    const validateForm = () => {
        for (const key in formData) {
            if (formData[key] === "") {
                alert(`Por favor, preencha o campo: ${key}`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
        if (clienteExiste === true){
        // Se o cliente já existe no banco App é realizado um PUT
        try {
            await axios.put(`http://localhost:8080/api/clienteApp/${id}`, formData);
            alert('Cliente Atualizado!');
            navigate(0);
        } catch ( error ) {
            console.error('Erro ao atualizar o Cliente', error);
            alert('Erro ao atualizar cliente!');
        }
        
        } // Fim do IF
        else {
            // Se o cliente não existe no banco App é realizado um POST
            try {
                await axios.post(`http://localhost:8080/api/clienteApp`, formData);
                alert('Cliente Criado com Sucesso!');
                navigate(0);
            } catch ( error ) {
                console.error('Erro ao Criar o Cliente!', error);
                alert('Erro ao Criar o Cliente!');
            }
        } // Fim do Else

    } // Fim do handleSubmit

    return (
        <div>
            <Header />

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
                                    value={id}
                                />
                            </div>
                            <div>
                                <label htmlFor="nome">Nome:</label>
                                <Input
                                    type="text"
                                    id="none-edit"
                                    title="Nome"
                                    placeholder={"Nome"}
                                    backgroundColor={'#ccc'}
                                    name="nome"
                                    padding={7}
                                    value={containerNomus.nome}
                                />
                            </div>
                            <div>
                                <label htmlFor="endereco">Endereço:</label>
                                <Input
                                    type="text"
                                    id="none-edit"
                                    title="Endereço do cliente"
                                    placeholder="Endereço"
                                    backgroundColor={'#ccc'}
                                    name="endereco"
                                    padding={7}
                                    value={containerNomus.endereco}
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email:</label>
                                <Input
                                    type="email"
                                    id="none-edit"
                                    title="Email do cliente"
                                    placeholder="Email"
                                    backgroundColor={'#ccc'}
                                    name="email"
                                    padding={7}
                                    readOnly
                                    value={containerNomus.email}
                                />
                            </div>
                            <div>
                                <label htmlFor="telefoneFax">Telefone/Fax:</label>
                                <Input
                                    type="tel"
                                    id="none-edit"
                                    title="Telefone/Fax do cliente"
                                    placeholder="Telefone/Fax"
                                    backgroundColor={'#ccc'}
                                    name="telefoneFax"
                                    padding={7}
                                    readOnly= 'readOnly'
                                    value={containerNomus.telefoneFax}
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
                                    value={formData.sigla_codigo_identificacao || ''}
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
                                    value={formData.codigo_identificacao || ''}
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
