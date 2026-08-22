
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CadastroPage from './pages/Cadastro'; 
import LoginPage from './pages/Login/Login'; 
import PatientList from './components/PatientList';
import PatientProfileOverview from './components/PatientProfileOverview';


import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* se entrar na root (localhost:5173/) vai pro cadastro */}
        <Route path="/" element={<Navigate to="/cadastro" />} />
        <Route path="/pacientesc" element={<PatientList />} />  
        <Route path="/pacientes/:id" element={<PatientProfileOverview />} />

        {/* rotas da app para cada elemento do front */}
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;