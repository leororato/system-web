import React, { useState } from 'react';
import './Autocomplete.css';

function Autocomplete({ data, onSelect, displayField }) {
    const [inputValue, setInputValue] = useState('');
    const [showResults, setShowResults] = useState(false);

    // Função para lidar com mudanças no campo de input
    const handleChange = (e) => {
        setInputValue(e.target.value);
        setShowResults(true);
    };

    // Função para selecionar um item da lista
    const handleSelect = (item) => {
        setInputValue(item.nome || ''); // Definir um valor padrão vazio se item.nome for undefined
        setShowResults(false);
        onSelect(item);
    };

    // Filtrando os dados com base no valor do input
    const filteredData = data.filter(item =>
        (item.nome || '').toLowerCase().includes(inputValue.toLowerCase()) // Verificar se item.nome é undefined
    );

    return (
        <div className="autocomplete-container">
            <input
                type="text"
                className="autocomplete-input"
                value={inputValue}
                onChange={handleChange}
                placeholder="Pesquise..."
            />
            {showResults && filteredData.length > 0 && (
                <div className="autocomplete-results">
                    {filteredData.map(item => (
                        <div
                            key={item.id}
                            className="autocomplete-item"
                            onClick={() => handleSelect(item)}
                        >
                            {item[displayField] || 'Nome não disponível'}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Autocomplete;
