import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async () => {
    try {
      const jsonInput = JSON.parse(input);
      const res = await fetch('https://testbfhl.herokuapp.com/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonInput),
      });
      const data = await res.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON or Server Error');
      setResponse(null);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedFilters([...selectedFilters, value]);
    } else {
      setSelectedFilters(selectedFilters.filter((filter) => filter !== value));
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const filteredResponse = {};
    if (selectedFilters.includes('Alphabets')) filteredResponse.alphabets = response.alphabets;
    if (selectedFilters.includes('Numbers')) filteredResponse.numbers = response.numbers;
    if (selectedFilters.includes('HighestLowercaseAlphabet'))
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;

    return <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>;
  };

  return (
    <div className="App">
      <h1>Frontend for BFHL</h1>
      <textarea
        placeholder="Enter JSON input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      {error && <p className="error">{error}</p>}
      {response && (
        <>
          <div>
            <h3>Response:</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
          <div className="filters">
            <h3>Filter Response:</h3>
            <label>
              <input type="checkbox" value="Alphabets" onChange={handleCheckboxChange} /> Alphabets
            </label>
            <label>
              <input type="checkbox" value="Numbers" onChange={handleCheckboxChange} /> Numbers
            </label>
            <label>
              <input type="checkbox" value="HighestLowercaseAlphabet" onChange={handleCheckboxChange} />
              Highest Lowercase Alphabet
            </label>
          </div>
          <div>{renderFilteredResponse()}</div>
        </>
      )}
    </div>
  );
}

export default App;
