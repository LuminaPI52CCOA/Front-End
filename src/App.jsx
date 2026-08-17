import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CadastroPage from './pages/Cadastro'; 
import LoginPage from './pages/Login/Login'; 
import PatientRegistrationPage from './pages/PatientRegistrationPage/PatientRegistrationPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Direciona root para cadastro de pacientes */}
        <Route path="/" element={<Navigate to="/pacientes/novo" replace />} />

        {/* rotas da app para cada elemento do front */}
        <Route path="/pacientes/novo" element={<PatientRegistrationPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;