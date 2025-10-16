import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default App;