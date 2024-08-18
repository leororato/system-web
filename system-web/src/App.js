import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import QrCodeGenerator from './pages/qrCodeGenerator/QrCodeGenerator';
import Login from './pages/Login/loginPage/Login';
import CadastroItem from './pages/PackingList/cadastroPackingList/CadastroPackingList';
import CadastroTipoVolume from './pages/cadastroTipoVolume/CadastroTipoVolume';
import Clientes from './pages/Clientes/clientesPage/Clientes';
import PackingListProduto from './pages/PackingList/produtoPackingList/PackingListProduto';
import EditarPL from './pages/PackingList/editarPackingList/EditarPL';
import EditarCliente from './pages/Clientes/editarCliente/EditarCliente';
import SubVolume from './pages/PackingList/subVolumePackingList/SubVolume';
import PackingList from './pages/PackingList/ExibirPackingList/PackingList';


function App() {
    
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to="/login" />} />
                <Route path='/login' element={<Login />} />
                <Route path='/inicio' element={<PackingList />}/>
                <Route path='/gerar-qr-code' element={<QrCodeGenerator />} />
                <Route path='/cadastrar-packing-list' element={<CadastroItem />} />
                <Route path='/cadastro-tipo-volume' element={<CadastroTipoVolume />} />
                <Route path='/clientes' element={<Clientes />} />
                <Route path='/editar-packing-list/:id' element={<EditarPL />} />
                <Route path='/packing-list-produto/:id' element={<PackingListProduto />} />
                <Route path='/editar-cliente/:id' element={<EditarCliente />} />
                <Route path='/sub-volume/:id/:idProduto/:seq' element={<SubVolume />} />
            </Routes>
        </Router>
    );
}

export default App;
