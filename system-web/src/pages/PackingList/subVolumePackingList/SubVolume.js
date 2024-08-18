import { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function SubVolume() {
    const { id, idProduto, seq } = useParams(); // Recebe os parâmetros da URL
    const [subVolume, setSubVolume] = useState(null);

    useEffect(() => {
        const fetchSubVolume = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/pl-produto/${id}/${idProduto}/${seq}`);
                setSubVolume(response.data);
            } catch (error) {
                console.error("Erro ao carregar o sub-volume: ", error);
            }
        };

        fetchSubVolume();
    }, [id, idProduto, seq]);

    return (
        <div>
            <Header />
            <div className="ul-lista-produtos">
                <ul>
                    <li id="header-lista-prod">
                        <div>Id PackingList</div>
                        <div>Id do Produto</div>
                        <div>Seq</div>
                        <div>Descrição</div>
                        <div>Ordem de Produção</div>
                    </li>
                    
                    {subVolume && (
                        <li>
                            <div>{subVolume.idPackingList}</div>
                            <div>{subVolume.id.idProduto}</div>
                            <div>{subVolume.id.seq}</div>
                            <div>{subVolume.descricaoProduto}</div>
                            <div>{subVolume.ordemProducao}</div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default SubVolume;
