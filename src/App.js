// src/App.js
import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // Change BrowserRouter to HashRouter
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;