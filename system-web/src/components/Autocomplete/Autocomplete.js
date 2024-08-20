import React, { useState, useRef, useEffect } from 'react';
import './Autocomplete.css';

function Autocomplete({ data, onSelect, displayField, value }) {
    const [inputValue, setInputValue] = useState(value || ''); // Inicialize o estado com o valor passado pela propriedade
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef(null);

    const handleChange = (e) => {
        setInputValue(e.target.value);
        setShowResults(true);
    };

    const handleSelect = (item) => {
        setInputValue(item[displayField] || ''); // Definir o valor do input como o displayField do item
        setShowResults(false);
        onSelect(item); // Passar o item completo para a função onSelect
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setShowResults(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setInputValue(value || ''); // Atualize o estado do inputValue sempre que a propriedade value mudar
    }, [value]);

    const filteredData = data.filter(item =>
        (item[displayField] || '').toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="autocomplete-container" ref={containerRef}>
            <input
                type="text"
                className="autocomplete-input"
                value={inputValue}
                onChange={handleChange}
                placeholder="Pesquise..."
            />
            {showResults && filteredData.length > 0 && (
                <div className="autocomplete-results">
                    {filteredData.map((item, index) => (
                        <div
                            key={index}
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
















// import React, { useState, useRef, useEffect } from 'react';
// import './Autocomplete.css';

// function Autocomplete({ data, onSelect, displayField }) {
//     const [inputValue, setInputValue] = useState('');
//     const [showResults, setShowResults] = useState(false);
//     const containerRef = useRef(null);

//     const handleChange = (e) => {
//         setInputValue(e.target.value);
//         setShowResults(true);
//     };

//     const handleSelect = (item) => {
//         setInputValue(item[displayField] || ''); // Definir o valor do input como o displayField do item
//         setShowResults(false);
//         onSelect(item); // Passar o item completo para a função onSelect
//     };

//     const handleClickOutside = (event) => {
//         if (containerRef.current && !containerRef.current.contains(event.target)) {
//             setShowResults(false);
//         }
//     };

//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const filteredData = data.filter(item =>
//         (item[displayField] || '').toLowerCase().includes(inputValue.toLowerCase())
//     );

//     return (
//         <div className="autocomplete-container" ref={containerRef}>
//             <input
//                 type="text"
//                 className="autocomplete-input"
//                 value={inputValue}
//                 onChange={handleChange}
//                 placeholder="Pesquise..."
//             />
//             {showResults && filteredData.length > 0 && (
//                 <div className="autocomplete-results">
//                     {filteredData.map((item, index) => (
//                         <div
//                             key={index}
//                             className="autocomplete-item"
//                             onClick={() => handleSelect(item)}
//                         >
//                             {item[displayField] || 'Nome não disponível'}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Autocomplete;
