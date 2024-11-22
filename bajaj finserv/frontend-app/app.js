import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSubmit = async () => {
        try {
            const jsonInput = JSON.parse(input);
            const res = await axios.post('https://testbfhl.herokuapp.com/bfhl', jsonInput);
            setResponse(res.data);
            setError(null);
        } catch (err) {
            setError('Invalid JSON or Server Error');
            setResponse(null);
        }
    };

    const handleSelection = (e) => {
        const { value, checked } = e.target;
        if (checked) setSelectedOptions([...selectedOptions, value]);
        else setSelectedOptions(selectedOptions.filter((opt) => opt !== value));
    };

    const renderResponse = () => {
        if (!response) return null;

        const filteredResponse = {};
        if (selectedOptions.includes('Alphabets')) filteredResponse.alphabets = response.alphabets;
        if (selectedOptions.includes('Numbers')) filteredResponse.numbers = response.numbers;
        if (selectedOptions.includes('HighestLowercaseAlphabet'))
            filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;

        return <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>;
    };

    return (
        <div>
            <h1>Frontend for BFHL</h1>
            <textarea
                placeholder="Enter JSON input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {response && (
                <div>
                    <h3>Filter Response:</h3>
                    <label>
                        <input type="checkbox" value="Alphabets" onChange={handleSelection} /> Alphabets
                    </label>
                    <label>
                        <input type="checkbox" value="Numbers" onChange={handleSelection} /> Numbers
                    </label>
                    <label>
                        <input type="checkbox" value="HighestLowercaseAlphabet" onChange={handleSelection} /> Highest Lowercase Alphabet
                    </label>
                    {renderResponse()}
                </div>
            )}
        </div>
    );
};

export default App;
