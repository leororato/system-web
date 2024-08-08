import { Link, useNavigate } from "react-router-dom";
import './Header.css';
import React from "react";
import { Icon } from '@iconify/react';

const Header = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div className='header-container'>
      <div className="header-inicio">

        <div className="container-voltar" onClick={handleGoBack} title="Voltar">
          <Icon icon="icon-park-solid:back" id="icon-voltar"/>
          <p>Voltar</p>
        </div>

        <div className="container-home">
          <Link to="/inicio" title="Tela inicial">
            <Icon icon="majesticons:home" id="icon-home" />
            Inicio
          </Link>
        </div>
      </div>

      <div className="header-conta" title="Configurações da conta">
        <Link to="/login">
          <Icon icon="mdi:account-box" id="icon-conta"/>
          Minha Conta
        </Link>
      </div>
    </div>
  );
}

export default Header;
