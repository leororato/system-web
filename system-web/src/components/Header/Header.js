import { Link, useLocation, useNavigate } from "react-router-dom";
import './Header.css';
import React, { useState, useRef, useEffect } from "react";
import { Icon } from '@iconify/react';
import Logo from "../../assets/logo.png"
import Text from "../Text";
import axios from "axios";
import Input from "../Input";
import Button from "../Button";
import ErrorNotification from "../ErrorNotification/ErrorNotification";
import SucessNotification from "../SucessNotification/SucessNotification";
import logo from '../../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [sucessMessage, setSucessMessage] = useState(location.state?.sucessMessage || null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleCreateTipoDeVolume = (e) => {
    e.preventDefault();

    axios.post(`http://localhost:8080/api/tipo-de-volume`, tipoDeVolume)
      .then((response) => {

        setSucessMessage(`Tipo de Volume '${response.data.descricao}' criado com sucesso`);

        setTimeout(() => {
          navigate(0);
        }, 3000);

      })
      .catch(error => {
        const errorMessage = error.response?.data || "Erro desconhecido ao criar o Tipo de Volume";
        setErrorMessage(errorMessage);

        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);

        console.error("Erro ao criar o Tipo de Volume: ", error)
      });
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
        <Link to="/login">
          <Icon icon="mdi:account-box" id="icon-conta" />
        </Link>
      </div>

            <div id="container-logo-header">
        <img src={logo} id="logo-header"/>
      </div>
      </div>


      {contextHeaderMenu && (
        <div className="container-header-menu" ref={menuRef}>
          <div id="tipo-de-volume-header">
            <Text text={'Cadastrar Tipo de Volume'} onClick={handleFuncaoTipoVolume}/>
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
            <div className='container-text-input'>
              <div className='container-text-cv'>
                <Text
                  text={'Criar tipo de volume:'}
                  fontSize={15}
                /></div>
              <div className='container-input-criar-volume'>
                <Input
                  className={"input-tipo-volume"}
                  placeholder={'Ex: Pallet...'}
                  padding={7}
                  title={'Digite o tipo de volume...'}
                  onChange={(e) => setTipoDeVolume({ descricao: e.target.value })}
                /></div>
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
    </div>
  );
};

export default Header;  