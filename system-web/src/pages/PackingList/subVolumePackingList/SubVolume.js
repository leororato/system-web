import { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


function SubVolume() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subVolumes, setSubVolumes] = useState({});
    const [produtoSelecionado, setProdutoSelecionado] = useState([]);

    // buscar o produto selecionado
    useEffect(() => {
        const fetchProdutos = () => {
            try {
                const response = axios.get(`http://localhost:8080/api/pl-produto/${id}`)
                setProdutoSelecionado(response.data);
            } catch ( error ) {
                console.error("Erro ao carregar o produto selecionado: ", error);
            }
        }

        fetchProdutos();
    }, [id])


    return (
        <div>
            <Header />

            <div>

                <div>
                    <ul>
                        <li className="header">
                            <div>ID Volume</div>
                            <div>ID Sub Volume</div>
                            <div>Quantidade</div>
                            <div>Descrição</div>

                        </li>
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default SubVolume;