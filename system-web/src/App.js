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
import CadastroPackingListNacional from './pages/PackingList/cadastroPackingListNacional/CadastroPackingListNacional';
import EditarPackingListNacional from './pages/PackingList/EditarPackingListNacional/EditarPackingListNacional';



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
                <Route path={ userRole === 'A' || 'G' ? '/cadastrar-packing-list' : '/unauthorized'} element={<CadastroItem />} />
                <Route path={ userRole === 'A' || 'G' ? '/cadastrar-packing-list-nacional' : '/unauthorized'} element={<CadastroPackingListNacional />} />
                <Route path='/clientes' element={<Clientes />} />
                <Route path={ userRole === 'A' || 'G' ? '/editar-packing-list/:id' : '/unauthorized'}element={<EditarPL />} />
                <Route path={ userRole === 'A' || 'G' ? '/editar-packing-list-nacional/:id' : '/unauthorized'}element={<EditarPackingListNacional />} />
                <Route path='/packing-list-produto/:id' element={<PackingListProduto />} />
                <Route path={ userRole === 'A' || 'G' ? '/editar-cliente/:id' : '/unauthorized'} element={<EditarCliente />} />
                <Route path='/volumes/:id/:idProduto/:seq' element={<Volume />} />
                <Route path={ userRole === 'A' || 'G' ? '/cadastrar-usuario' : '/cadastrar-usuario'} element={<CadastrarUsuario /> } />
            </Routes>
        </Router>
    );
}

export default App;
