import React, { useState, useEffect, useMemo } from 'react';
import './Clientes.css';
import Input from '../../../components/Input';
import Header from '../../../components/Header/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorNotification from '../../../components/ErrorNotification/ErrorNotification';
import SucessNotification from '../../../components/SucessNotification/SucessNotification';
import api from '../../../axiosConfig';
import Cookies from 'js-cookie';

function Clientes() {

    const navigate = useNavigate();

    const userRole = Cookies.get('nivelAcesso');

    // Variáveis de notificações
    const location = useLocation();
    const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Variáveis dos inputs de busca
    const [buscaId, setBuscaId] = useState('');
    const [buscaNome, setBuscaNome] = useState('');
    const [buscaEmail, setBuscaEmail] = useState('');
    const [buscaTelefone, setBuscaTelefone] = useState('');
    const [buscaEndereco, setBuscaEndereco] = useState('');
    const [buscaSigla, setBuscaSigla] = useState('');
    const [buscaCodId, setBuscaCodId] = useState('');

    // Variáveis do cliente
    const [clientes, setClientes] = useState([]);
    const [clientesApp, setClientesApp] = useState([]);
    const [pesquisa, setPesquisa] = useState(false);

    // Consolidar dados dos clientes com informações de clienteApp
    const clientesConsolidados = useMemo(() => {
        return clientes.map(cliente => {
            const clienteApp = clientesApp.find(appCliente => appCliente.id === cliente.id) || {};
            return {
                ...cliente,
                sigla_codigo_identificacao: clienteApp.sigla_codigo_identificacao || '',
                codigo_identificacao: clienteApp.codigo_identificacao || ''
            };
        });
    }, [clientes, clientesApp]);

    // Filtrando os clientes consolidados
    const clientesFiltrados = useMemo(() => {
        return clientesConsolidados.filter(cliente =>
            (!buscaId || cliente.id?.toString().includes(buscaId)) &&
            (!buscaNome || cliente.nome?.toLowerCase().includes(buscaNome.toLowerCase())) &&
            (!buscaEmail || cliente.email?.toLowerCase().includes(buscaEmail.toLowerCase())) &&
            (!buscaTelefone || cliente.telefoneFax?.toLowerCase().includes(buscaTelefone.toLowerCase())) &&
            (!buscaEndereco || cliente.endereco?.toLowerCase().includes(buscaEndereco.toLowerCase())) &&
            (!buscaSigla || cliente.sigla_codigo_identificacao?.toLowerCase().includes(buscaSigla.toLowerCase())) &&
            (!buscaCodId || cliente.codigo_identificacao?.toLowerCase().includes(buscaCodId.toLowerCase()))
        );
    }, [clientesConsolidados, buscaId, buscaNome, buscaEmail, buscaTelefone, buscaEndereco, buscaSigla, buscaCodId]);

    // Ações para serem executadas quando o usuário clicar em cima de algum cliente após busca
    const handleClickCliente = (event, cliente) => {
        if ((userRole === "A" || userRole === "G")) {
            event.preventDefault();
            navigate(`/editar-cliente/${cliente.id}`);
        }
    };

    // Atualiza a visibilidade da pesquisa com base nos valores dos campos de busca
    useEffect(() => {
        const hasSearchTerm = [buscaId, buscaNome, buscaEmail, buscaTelefone, buscaEndereco, buscaSigla, buscaCodId].some(term => term.trim() !== '');
        setPesquisa(hasSearchTerm);
    }, [buscaId, buscaNome, buscaEmail, buscaTelefone, buscaEndereco, buscaSigla, buscaCodId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Buscando todos os clientes do banco Nomus
                const clientesResponse = await api.get('/clienteNomus');
                setClientes(clientesResponse.data);

                // Buscando todos os clientes do banco App
                const clientesAppResponse = await api.get('/clienteApp');
                setClientesApp(clientesAppResponse.data);

            } catch (error) {
                const errorMessage = error.response?.data || "Erro desconhecido ao buscar clientes";
                setErrorMessage(errorMessage);

            }
        };

        fetchData();
    }, []); // Fim do useEffect

    return (
        <div>
            <Header />
            <ErrorNotification message={errorMessage} onClose={() => setSucessMessage(null)} />
            {sucessMessage && <SucessNotification message={sucessMessage} onClose={() => setSucessMessage(null)} />}
            
            <div className="clientes-container">
                <div className='sub-container-clientes'>
                    <div className='clientes-input-container'>
                        <Input
                            type={'number'}
                            placeholder={'Buscar por ID'}
                            value={buscaId}
                            onChange={(ev) => setBuscaId(ev.target.value)}
                        />
                    </div>

                    <div className="clientes-input-container">
                        <Input
                            type={'text'}
                            placeholder={'Buscar por nome'}
                            value={buscaNome}
                            onChange={(ev) => setBuscaNome(ev.target.value)}
                        />
                    </div>

                    <div className="clientes-input-container">
                        <Input
                            type={'text'}
                            placeholder={'Buscar por email'}
                            value={buscaEmail}
                            onChange={(ev) => setBuscaEmail(ev.target.value)}
                        />
                    </div>

                    <div className="clientes-input-container">
                        <Input
                            type={'tel'}
                            placeholder={'Buscar por telefone'}
                            value={buscaTelefone}
                            onChange={(ev) => setBuscaTelefone(ev.target.value)}
                        />
                    </div>

                    <div className="clientes-input-container">
                        <Input
                            type={'text'}
                            placeholder={'Buscar por endereço'}
                            value={buscaEndereco}
                            onChange={(ev) => setBuscaEndereco(ev.target.value)}
                        />
                    </div>

                    <div className='clientes-input-container'>
                        <Input
                            type={'text'}
                            placeholder={'Sigla Código Identificação'}
                            value={buscaSigla}
                            onChange={(ev) => setBuscaSigla(ev.target.value)}
                        />
                    </div>

                    <div className='clientes-input-container'>
                        <Input
                            type={'text'}
                            placeholder={'Código Identificação'}
                            value={buscaCodId}
                            onChange={(ev) => setBuscaCodId(ev.target.value)}
                        />
                    </div>
                </div>

                <div className="clientes-list-container">
                    {pesquisa ? (
                        clientesFiltrados.length > 0 ? (
                            <div className='container-listagem-cliente'>
                                <div className='subcontainer-listagem-cliente'>
                                    <ul>
                                        <li className="header-cliente">
                                            <div>ID</div>
                                            <div>Nome</div>
                                            <div>Email</div>
                                            <div>Endereço</div>
                                            <div>Telefone</div>
                                            <div>Sigla IDF</div>
                                            <div>Código IDF</div>
                                        </li>
                                        {clientesFiltrados.map((c) => (
                                            
                                            <li className="li-listagem-cliente" title='Clique para editar o cliente...' 
                                            
                                            key={c.id} onClick={(event) =>
                                                handleClickCliente(event, c)} 
                                                                >
                                                <div id='id'>{c.id}</div>
                                                <div>{c.nome}</div>
                                                <div>{c.email}</div>
                                                <div>{c.endereco}</div>
                                                <div>{c.telefoneFax}</div>
                                                <div>{c.sigla_codigo_identificacao}</div>
                                                <div>{c.codigo_identificacao}</div>
                                                
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="clientes-no-results">Nenhum cliente encontrado</div>
                        )
                    ) : (
                        <div className="clientes-no-results">Pesquise algum cliente nos campos acima...</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Clientes;
