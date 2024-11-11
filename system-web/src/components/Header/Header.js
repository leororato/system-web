import { Link, useLocation, useNavigate } from "react-router-dom";
import './Header.css';
import React, { useState, useRef, useEffect } from "react";
import { Icon } from '@iconify/react';
import Text from "../Text";
import Input from "../Input";
import Button from "../Button";
import ErrorNotification from "../ErrorNotification/ErrorNotification";
import SucessNotification from "../SucessNotification/SucessNotification";
import logo from '../../assets/logo.png';
import api from "../../axiosConfig";
import Loading from "../Loading/Loading";
import Cookies from 'js-cookie';
import ExcluirItem from "../ExcluirItem/ExcluirItem";

const Header = () => {

  const [nomeUsuario, setNomeUsuario] = useState('');
  const userRole = Cookies.get('nivelAcesso');
  const id = Cookies.get('userId');
  const usuario = { id: id };


  const navigate = useNavigate();
  const containerRef = useRef(null);

  const location = useLocation();
  const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [estadoDaPagina, setEstadoDaPagina] = useState("Salvando");
  const [estadoDoCadastro, setEstadoDoCadastro] = useState("Cadastro");
  const [contextLoading, setContextLoading] = useState({ visible: false });

  const [contextVolume, setContextVolume] = useState({
    visible: false, x: 0, y: 0
  });

  const [contextHeaderMenu, setContextHeaderMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [contextDelete, setContextDelete] = useState({ visible: false, selectedId: null });
  const [salvarTipoSelected, setSalvarTipoSelected] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [formDataEdicaoTipoVolume, setFormDataEdicaoTipoVolume] = useState({ idTipoVolume: null, descricao: null })
  const [listaTiposDeVolume, setListaTiposDeVolume] = useState([]);
  const [tipoDeVolume, setTipoDeVolume] = useState({
    descricao: ''
  });

  const menuRef = useRef(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleMenu = () => {
    setContextHeaderMenu(!contextHeaderMenu);
  };

  useEffect(() => {
    const storedUserName = Cookies.get('nomeUsuario');
    if (storedUserName) {
      setNomeUsuario(storedUserName);
    }
  }, []);

  const handleFuncaoTipoVolume = (e) => {
    setContextVolume({ visible: true, x: e.pageX, y: e.pageY });
    setContextHeaderMenu(false);
    fetchTiposDeVolume();
  }

  const fetchTiposDeVolume = async () => {
    setEstadoDaPagina("Carregando");
    setContextLoading({ visible: true });

    try {
      const response = await api.get(`/tipo-de-volume/listar-todos`);
      setListaTiposDeVolume(response.data);

    } catch (error) {
      const errorMessage = error.response?.data || "Erro desconhecido ao buscar tipos de volume";
      setErrorMessage(errorMessage);

    } finally {
      setContextLoading({ visible: false });
    }
  }

  const handleCreateTipoDeVolume = async (e) => {
    e.preventDefault();
    setEstadoDaPagina("Salvando");
    setContextLoading({ visible: true });

    const tipoVolume = {
      tipoDeVolume: tipoDeVolume,
      usuario: usuario
    }

    try {
      const response = await api.post(`/tipo-de-volume`, tipoVolume);

      setSucessMessage(`Tipo de Volume '${response.data.descricao}' criado com sucesso`);
      fetchTiposDeVolume();

      setTipoDeVolume({ descricao: null });

    } catch (error) {
      const errorMessage = error.response?.data || "Erro desconhecido ao criar o Tipo de Volume";
      setErrorMessage(errorMessage);

    } finally {
      setContextLoading({ visible: false });
    }
  }

  // parte da aba arrastavel
  const handleCloseContextVolume = () => {
    setContextVolume({ visible: false });
    setTipoDeVolume({ descricao: '' });
  }

  const handleMouseDown = (event) => {
    const container = containerRef.current;
    let shiftX = event.clientX - container.getBoundingClientRect().left;
    let shiftY = event.clientY - container.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      container.style.left = pageX - shiftX + 'px';
      container.style.top = pageY - shiftY + 'px';
    };

    const onMouseMove = (event) => {
      moveAt(event.pageX, event.pageY);
    };

    document.addEventListener('mousemove', onMouseMove);

    document.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
    };
  };

  // edicao

  const atualizarTipoDeVolume = async () => {
    setEstadoDaPagina("Atualizando");
    setContextLoading({ visible: true });

    const tipoVolumeRequest = {
      tipoDeVolume: formDataEdicaoTipoVolume,
      usuario: usuario
    }

    try {
      await api.put(`/tipo-de-volume/atualizar-tipo-volume/${formDataEdicaoTipoVolume.idTipoVolume}`, tipoVolumeRequest);

      setSucessMessage(`Tipo de Volume atualizado com sucesso`);
      setFormDataEdicaoTipoVolume({ idTipoVolume: null, descricao: null });

      setSalvarTipoSelected(null);
      await fetchTiposDeVolume();

    } catch (error) {
      const errorMessage = error.response?.data || "Erro desconhecido ao atualizar o tipo de volume";
      setErrorMessage(errorMessage);

      setFormDataEdicaoTipoVolume({ idTipoVolume: null, descricao: null });
      setEstadoDoCadastro("Cadastro");

    } finally {
      setContextLoading({ visible: false });
    }
  }

  const handleExcluirTipoVolume = async () => {
    setEstadoDaPagina("Excluindo");
    setContextLoading({ visible: true });

    try {
      await api.put(`/tipo-de-volume/excluir-tipo-volume/${salvarTipoSelected.idTipoVolume}`, usuario);
      setEstadoDaPagina("Cadastro");

      setSucessMessage("O tipo de volume foi deletado com sucesso");
      setSalvarTipoSelected(null);

      await fetchTiposDeVolume();
      setContextDelete({ visible: false });

      setEstadoDoCadastro("Cadastro");
      setFormDataEdicaoTipoVolume({ idTipoVolume: null, descricao: null });

    } catch (error) {
      const errorMessage = error.response?.data || "Erro desconhecido ao excluir o tipo de volume";
      setErrorMessage(errorMessage);

      setEstadoDaPagina("Cadastro");
      setFormDataEdicaoTipoVolume({ idTipoVolume: null, descricao: null });

    } finally {
      setContextLoading({ visible: false });
    }
  }

  const handleRightClick = (e, idTipoVolume, descricao) => {
    e.preventDefault();
    setContextMenu({
      visible: true, x: e.pageX, y: e.pageY
    })
    setSalvarTipoSelected({ idTipoVolume: idTipoVolume, descricao: descricao })
    setFormDataEdicaoTipoVolume({ idTipoVolume: idTipoVolume, descricao: descricao });
    setSelectedItemId(idTipoVolume);
  }

  const handleEditarTipoDeVolume = () => {
    setEstadoDoCadastro("Editar");
  }

  const handleExcluirTipoDeVolume = (e) => {
    setContextDelete({ visible: true, x: e.pageX, y: e.pageY });
  }

  const handleChangeFormDataTipoVolume = (e) => {
    setFormDataEdicaoTipoVolume({
      ...formDataEdicaoTipoVolume,
      descricao: e.target.value
    });
  }

  const handleClickOutside = (e) => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      selectedId: null,
      selectedSeq: null,
      selectedDesc: null
    });
    
    setSelectedItemId(null);
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCancelarVolume = () => {
    navigate(0);
  }

  return (
    <div className='header-container'>
      <ErrorNotification message={errorMessage} onClose={() => setErrorMessage(null)} />
      {sucessMessage && <SucessNotification message={sucessMessage} onClose={() => setSucessMessage(null)} />}
      <div className="header-inicio">
        <div className="container-menu" title="Abrir menu" onClick={toggleMenu}>
          <Icon icon="dashicons:menu-alt3" id="icon-menu" />
        </div>

        <div className="container-voltar" onClick={handleGoBack} title="Voltar">
          <Icon icon="icon-park-solid:back" id="icon-voltar" />
        </div>

        <div className="container-home">
          <Link to="/inicio" title="Tela inicial">
            <Icon icon="iconamoon:home-fill" id="icon-home" />
          </Link>
        </div>
      </div>

      <div className="header-final">
        <div className="header-conta" title="Configurações da conta">
          <Text
            text={nomeUsuario}
            color={'rgb(231 227 227)'}
            fontSize={'15px'}
          />
          <Link to="/minha-conta">
            <Icon icon="mdi:account-box" id="icon-conta" />
          </Link>
        </div>

        <div id="container-logo-header">
          <img src={logo} id="logo-header" alt="Logo da empresa" />
        </div>
      </div>


      {contextHeaderMenu && (
        <div className="container-header-menu" ref={menuRef}>

          {(userRole === "A" || userRole === "G") && (
            <div id="tipo-de-volume-header">
              <Text text={'Cadastrar tipo de volume'} onClick={handleFuncaoTipoVolume} />
            </div>
          )}

          {(userRole === "A" || userRole === "G") && (
            <div id="criar-packinglist-header">
              <Text text={'Criar packingList exportação'} onClick={() => navigate('/cadastrar-packing-list')} />
            </div>
          )}

          {(userRole === "A" || userRole === "G") && (
            <div id="criar-packinglist-header">
              <Text text={'Criar packingList nacional'} onClick={() => navigate('/cadastrar-packing-list-nacional')} />
            </div>
          )}

          <div id="encontrar-clientes-header">
            <Text text={'Encontrar clientes'} onClick={() => navigate('/clientes')} />
          </div>

          {userRole === "A" && (
            <div id="criar-nova-conta-header">
              <Text text={'Cadastrar usuário'} onClick={() => navigate('/cadastrar-usuario')} />
            </div>
          )}
        </div>
      )}

      {/* CRIAR TIPO DE VOLUME INICIO */}
      {contextVolume.visible && !contextDelete.visible && (
        <>
          <div className="overlay"></div>
          <div className='container-tipo-volume'>
            {/* Seção de criação do tipo de volume */}
            <div className='context-volume'>
              <div className="container-icone-fechar">
                <Icon icon="ep:close-bold" id="icone-fechar-criacao-tipo-volume" onClick={handleCloseContextVolume} />
              </div>
              <div className='container-text-input'>
                <div className='container-text-cv'>
                  <Text text={estadoDoCadastro === "Cadastro" ? 'Criar tipo de volume:' : 'Editar tipo de volume'} fontSize={15} />
                </div>
                <div className='container-input-criar-volume'>
                  <Input
                    className={"input-tipo-volume"}
                    placeholder={'Ex: Pallet...'}
                    padding={7}
                    name={'descricao'}
                    value={estadoDoCadastro === "Cadastro" ? tipoDeVolume.descricao || "" : formDataEdicaoTipoVolume.descricao || ""}
                    onChange={estadoDoCadastro === "Cadastro" ? (e) => setTipoDeVolume({ descricao: e.target.value }) : (e) => handleChangeFormDataTipoVolume(e)}
                  />
                </div>
              </div>

              <div className='buttons-create'>
                <Button className={'botao-cancelar'} text={'Cancelar'} fontSize={15} onClick={handleCancelarVolume} />
                {estadoDoCadastro === "Cadastro" ? (
                  <Button className={'botao-salvar'} text={'Criar'} fontSize={15} onClick={handleCreateTipoDeVolume} />

                ) : (
                  <Button className={'botao-salvar'} text={'Salvar'} fontSize={15} onClick={atualizarTipoDeVolume} />

                )}
              </div>
            </div>

            {/* Lista de tipos de volumes */}
            <div className='container-lista-tipos-volume' ref={containerRef} onMouseDown={handleMouseDown}>
              <div className="subcontainer-lista-tipos-volume">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                  <Text
                    text={"Tipos de volumes"}
                  />
                </div>

                <ul className="ul-listagem-tipos-volume">
                  <li className="header-lista-tipos-volume">
                    <div>ID</div>
                    <div>Descrição</div>
                  </li>
                  {listaTiposDeVolume && (
                    listaTiposDeVolume.map((user) => (
                      <li key={user.idTipoVolume} onContextMenu={(e) => handleRightClick(e, user.idTipoVolume, user.descricao)}
                        className={`li-listagem-tipo-volume ${selectedItemId === user.idTipoVolume ? 'li-listagem-tipo-volume-com-cor' : 'li-listagem-tipo-volume-sem-cor'}`}>
                        <div>{user.idTipoVolume}</div>
                        <div>{user.descricao}</div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* FIM CRIAR TIPO DE VOLUME */}

      {contextMenu.visible && (
        <div className='context-menu' style={{
          top: `${contextMenu.y}px`, left: `${contextMenu.x}px`
        }}>
          <div id='container-icon-menu' onClick={handleEditarTipoDeVolume}>
            <Icon icon="mdi:edit" id='icone-menu' />
            <p>Editar</p>
          </div>
          <div id='container-icon-menu-excluir' onClick={(e) => handleExcluirTipoDeVolume(e)}>
            <Icon icon="material-symbols:delete-outline" id='icone-menu' />
            <p>Excluir</p>
          </div>
        </div>
      )}

      {contextDelete.visible && (
        <>
          <div style={{ position: 'fixed' }}></div>
          <ExcluirItem
            descricao={'Tem certeza que deseja excluir o tipo de volume?'}
            onClickBotaoCancelar={() => { setContextDelete({ visible: false }); }}
            onClickBotaoExcluir={handleExcluirTipoVolume}
          />
        </>
      )}

      {
        contextLoading.visible ? (
          <Loading message={estadoDaPagina === "Salvando" ? "Salvando..." : "Carregando..."} />
        ) : (
          <></>
        )
      }

    </div >
  );
};

export default Header;  