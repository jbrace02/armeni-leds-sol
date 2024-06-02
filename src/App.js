import React, { useState } from 'react';
import './index.css';
import logo from './logo.svg';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import Tokenomics from './Components/Tokenomics';
import Buy from './Components/Buy';
import Footer from './Components/Footer';

function App() {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode); // This ensures state is correctly toggled based on the previous state
        document.body.classList.toggle('dark-mode'); // Directly toggle the class without conditional
    };

    return (
        <>
            <Navbar logo={logo} />
            <button 
                onClick={toggleDarkMode} 
                style={{ position: 'fixed', top: '10px', right: '10px' }}
                className="toggle-button" // Added a class for potential CSS styling
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"} // Accessibility label for the button
            >
                {darkMode ? 'Light Mode' : 'Dark Mode'} // Dynamic text based on the state
            </button>
            <Hero logo={logo} />
            Tokenomics />
            <Buy />
            <Footer logo={logo} />
        </>
    );
}

export default App;


