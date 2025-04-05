// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [data, setData] = useState('Loading...');

    useEffect(() => {
        // Fetch data from the Express backend
        fetch('http://localhost:3001/api/data')
            .then((res) => res.json())
            .then((json) => setData(json.data))
            .catch((err) => {
                console.error('Error fetching data:', err);
                setData('Error fetching data');
            });
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>React Frontend</h1>
            <p>{data}</p>
        </div>
    );
}

export default App;
