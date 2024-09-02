import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QrCodeGenerator from './pages/qrCodeGenerator/ExibirQRCodes';
import Login from './pages/Login/loginPage/Login';
import CadastroItem from './pages/PackingList/cadastroPackingList/CadastroPackingList';
import Clientes from './pages/Clientes/clientesPage/Clientes';
import PackingListProduto from './pages/PackingList/produtoPackingList/PackingListProduto';
import EditarPL from './pages/PackingList/editarPackingList/EditarPL';
import EditarCliente from './pages/Clientes/editarCliente/EditarCliente';
import PackingList from './pages/PackingList/ExibirPackingList/PackingList';
import Volume from './pages/PackingList/volumePackingList/Volume';
import Conta from './pages/Login/Conta/Conta';
import ExibirQRCodes from './pages/qrCodeGenerator/ExibirQRCodes';


function App() {
    
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to="/login" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/inicio' element={<PackingList />} />
                <Route path='/minha-conta' element={<Conta />} />
                <Route path="/exibir-qrcodes/:idPackinglist/:idProduto/:seq/:idVolume?" element={<ExibirQRCodes />} />
                <Route path='/cadastrar-packing-list' element={<CadastroItem />} />
                <Route path='/clientes' element={<Clientes />} />
                <Route path='/editar-packing-list/:id' element={<EditarPL />} />
                <Route path='/packing-list-produto/:id' element={<PackingListProduto />} />
                <Route path='/editar-cliente/:id' element={<EditarCliente />} />
                <Route path='/volumes/:id/:idProduto/:seq' element={<Volume />} />
            </Routes>
        </Router>
    );
}

export default App;
