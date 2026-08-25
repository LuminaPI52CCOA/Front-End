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

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cadastro" />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<LuminaDashboard />} />

        <Route element={<Layout />}>
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/pacientes" element={<PatientList />} />
          <Route path="/pacientes/novo" element={<PatientRegistrationPage />} />
          <Route path="/pacientes/:id" element={<PatientProfileOverview />} />
          <Route path="/dentistas" element={<DoctorList />} />
          <Route path="/dentistas/:id" element={<DoctorProfileOverview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
