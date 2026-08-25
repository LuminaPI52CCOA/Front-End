import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CadastroPage from './pages/Cadastro';
import LoginPage from './pages/Login/Login';
import AgendaPage from './pages/Agenda';
import NovoAgendamentoPage from './pages/NovoAgendamento';
import { ConsultasProvider } from './context/ConsultasContexto';
import PatientList from './components/PatientList';
import PatientProfileOverview from './components/PatientProfileOverview';
import DoctorList from './components/DoctorList';
import DoctorProfileOverview from './components/DoctorProfileOverview';
import PatientRegistrationPage from './pages/PatientRegistrationPage/PatientRegistrationPage';


import './App.css';

function App() {
  return (
    <ConsultasProvider>
      <BrowserRouter>
        <Routes>
          {/* se entrar na root (localhost:5173/) vai pro cadastro */}
          <Route path="/" element={<Navigate to="/cadastro" />} />

          {/* rotas da app para cada elemento do front */}
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/novo-agendamento" element={<NovoAgendamentoPage />} />
          <Route path="/" element={<Navigate to="/cadastro" />} />
          <Route path="/pacientes" element={<PatientList />} />
          <Route path="/dashboard" element={<Navigate to="/pacientes" replace />} />
          <Route path="/pacientes/:id" element={<PatientProfileOverview />} />
          <Route path="/dentistas" element={<DoctorList />} />
          <Route path="/dentistas/:id" element={<DoctorProfileOverview />} />
            <Route path="/pacientes/novo" element={<PatientRegistrationPage />} />
        </Routes>
      </BrowserRouter>
    </ConsultasProvider>
  );
}

export default App;
