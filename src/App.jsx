
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AgendaPage from './pages/Agenda';
import CadastroPage from './pages/Cadastro';
import LoginPage from './pages/Login/Login';
import PatientList from './components/PatientList';
import PatientProfileOverview from './components/PatientProfileOverview';
import DoctorList from './components/DoctorList';
import DoctorProfileOverview from './components/DoctorProfileOverview';
import PatientRegistrationPage from './pages/PatientRegistrationPage/PatientRegistrationPage';
import LuminaDashboard from './pages/Dashboard/Dashboard';
import NovoAgendamentoPage from './pages/NovoAgendamento';
import { ConsultasProvider } from './context/ConsultasContexto';

import './App.css';

function App() {
  return (
    <ConsultasProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/cadastro" />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<Layout />}>
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/novo-agendamento" element={<NovoAgendamentoPage />} />
            <Route path="/pacientes" element={<PatientList />} />
            <Route path="/pacientes/novo" element={<PatientRegistrationPage />} />
            <Route path="/pacientes/:id" element={<PatientProfileOverview />} />
            <Route path="/dentistas" element={<DoctorList />} />
            <Route path="/dentistas/:id" element={<DoctorProfileOverview />} />
            <Route path="/dashboard" element={<LuminaDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConsultasProvider>
  );
}

export default App;
