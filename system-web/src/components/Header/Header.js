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
import Cookies from 'js-cookie';
import api from "../../axiosConfig";
import Loading from "../Loading/Loading";

const Header = () => {

  // Obtenha o token JWT do cookie
  const token = Cookies.get('jwt');
  const [nomeUsuario, setNomeUsuario] = useState('');

  // Configure o header da requisição
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const navigate = useNavigate();

  const location = useLocation();
  const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [estadoDaPagina, setEstadoDaPagina] = useState("Salvando");
  const [contextLoading, setContextLoading] = useState({ visible: false });

  const [contextVolume, setContextVolume] = useState({
    visible: false, x: 0, y: 0
  });

  const [contextHeaderMenu, setContextHeaderMenu] = useState(false);
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

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setContextHeaderMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFuncaoTipoVolume = (e) => {
    setContextVolume({ visible: true, x: e.pageX, y: e.pageY });
    setContextHeaderMenu(false);
  }

  useEffect(() => {
    const storedUserName = localStorage.getItem('nomeUsuario');
    if (storedUserName) {
      setNomeUsuario(storedUserName);
    }

  }, []);

  const handleCreateTipoDeVolume = async (e) => {
    e.preventDefault();
    setEstadoDaPagina("Salvando");
    setContextLoading({ visible: true });

    try {
      const response = await api.post(`/tipo-de-volume`, tipoDeVolume, config);

      setSucessMessage(`Tipo de Volume '${response.data.descricao}' criado com sucesso`);

      setContextVolume({ visible: false });

    } catch (error) {
      const errorMessage = error.response?.data || "Erro desconhecido ao criar o Tipo de Volume";
      setErrorMessage(errorMessage);

      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);

    } finally {
      setContextLoading({ visible: false });
    }
  }

  const handleCloseContextVolume = () => {
    setContextVolume({ visible: false });
    setTipoDeVolume({ descricao: '' });
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
            color={'#ccc'}
            fontSize={'15px'}
          />
          <Link to="/minha-conta">
            <Icon icon="mdi:account-box" id="icon-conta" />
          </Link>
        </div>

        <div id="container-logo-header">
          <img src={logo} id="logo-header" />
        </div>
      </div>


      {contextHeaderMenu && (
        <div className="container-header-menu" ref={menuRef}>
          <div id="tipo-de-volume-header">
            <Text text={'Cadastrar Tipo de Volume'} onClick={handleFuncaoTipoVolume} />
          </div>

          <div id="criar-packinglist-header">
            <Text text={'Criar Novo PackingList'} onClick={() => navigate('/cadastrar-packing-list')} />
          </div>

          <div id="encontrar-clientes-header">
            <Text text={'Encontrar Clientes'} onClick={() => navigate('/clientes')} />
          </div>
        </div>
      )}


      {contextVolume.visible && (
        <>
          <div className='overlay'></div>
          <div className='context-volume'>
            <div className="container-icone-fechar"><Icon icon="ep:close-bold" id="icone-fechar-criacao-tipo-volume" onClick={handleCloseContextVolume} /></div>
            <div className='container-text-input'>
              <div className='container-text-cv'>
                <Text
                  text={'Criar tipo de volume:'}
                  fontSize={15}
                />
              </div>
              <div className='container-input-criar-volume'>
                <Input
                  className={"input-tipo-volume"}
                  placeholder={'Ex: Pallet...'}
                  padding={7}
                  onChange={(e) => setTipoDeVolume({ descricao: e.target.value })}
                />
              </div>
            </div>

            <div className='buttons-create'>
              <Button
                className={'button-cancelar-volume'}
                text={'CANCELAR'}
                fontSize={15}
                onClick={() => setContextVolume({ visible: false })}
              />
              <Button
                className={'button-criar-volume'}
                text={'CRIAR'}
                fontSize={15}
                onClick={handleCreateTipoDeVolume}
              />
            </div>
          </div>
        </>
      )}

      {contextLoading.visible ? (
        <Loading message={estadoDaPagina === "Salvando" ? "Salvando..." : "Carregando..."} />
      ) : (
        <></>
      )}

    </div>
  );
};

export default Header;  