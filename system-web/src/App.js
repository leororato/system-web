import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CadastroItem from './pages/PackingList/cadastroPackingList/CadastroPackingList';
import Clientes from './pages/Clientes/clientesPage/Clientes';
import PackingListProduto from './pages/PackingList/produtoPackingList/PackingListProduto';
import EditarPL from './pages/PackingList/editarPackingList/EditarPL';
import EditarCliente from './pages/Clientes/editarCliente/EditarCliente';
import PackingList from './pages/PackingList/ExibirPackingList/PackingList';
import Volume from './pages/PackingList/volumePackingList/Volume';
import ExibirQRCodes from './pages/qrCodeGenerator/ExibirQRCodes';
import Login from './pages/Usuario/Login/loginPage/Login';
import Conta from './pages/Usuario/Login/conta/Conta';
import CadastrarUsuario from './pages/Usuario/cadastrarUsuario/CadastrarUsuario';
import Cookies from 'js-cookie';



function App() {
    
    const userRole = Cookies.get('nivelAcesso');

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to="/login" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/inicio' element={<PackingList />} />
                <Route path='/minha-conta' element={<Conta />} />
                <Route path="/exibir-qrcodes/:idPackinglist/:idProduto/:seq/:idVolume?" element={<ExibirQRCodes />} />
                <Route path="/exibir-qrcode/:idVolume" element={<ExibirQRCodes />} />
                <Route path='/exibir-qrcode-packinglist/:idPackinglist' element={<ExibirQRCodes />} />
                <Route path='/cadastrar-packing-list' element={<CadastroItem />} />
                <Route path='/clientes' element={<Clientes />} />
                <Route path='/editar-packing-list/:id' element={<EditarPL />} />
                <Route path='/packing-list-produto/:id' element={<PackingListProduto />} />
                <Route path='/editar-cliente/:id' element={<EditarCliente />} />
                <Route path='/volumes/:id/:idProduto/:seq' element={<Volume />} />
                <Route path={ userRole === 'A' ? '/cadastrar-usuario' : '/unauthorized'} element={<CadastrarUsuario /> } />
            </Routes>
        </Router>
    );
}

export default App;
