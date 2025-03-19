// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div style={styles.container}>
      <h1>About This App</h1>
      <p>This is a simple To-Do List app built with React.</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
};

export default About;