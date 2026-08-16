import CadastroPage from './pages/Cadastro';
import Login from './pages/Login/Login';
import { useState } from 'react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('cadastro');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === 'login' && (
        <Login onNavigate={handleNavigate} />
      )}
      {currentPage === 'cadastro' && (
        <CadastroPage onNavigate={handleNavigate} />
      )}
    </>
  );
}


export default App
