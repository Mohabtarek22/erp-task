// src/pages/Home.jsx
import React from 'react';
import TaskList from '../components/TaskList';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>My To-Do List</h1>
      <TaskList />
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

export default Home;