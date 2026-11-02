import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import Layout from './components/Layout';
import RouteFallback from './components/RouteFallback';
import ChunkErrorBoundary from './components/ChunkErrorBoundary';
import {
  LoginPage,
  CadastroPage,
  ConfirmarConsultaPage,
  AgendaPage,
  NovoAgendamentoPage,
  PatientList,
  PatientRegistrationPage,
  PatientProfileOverview,
  DentistasPage,
  DoctorProfileOverview,
  LuminaDashboard,
} from './routes/paginasLazy';
import { ConsultasProvider } from './context/ConsultasContexto';
import { BloqueiosProvider } from './context/BloqueiosContexto';

import './App.css';

function App() {
  return (
    <ConsultasProvider>
      <BloqueiosProvider>
        <BrowserRouter>
          <ChunkErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/cadastro" element={<CadastroPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/*" element={<Navigate to="/dashboard" replace />} />
                <Route path="/confirmar-consulta" element={<ConfirmarConsultaPage />} />

                <Route element={<Layout />}>
                  <Route path="/agenda" element={<AgendaPage />} />
                  <Route path="/novo-agendamento" element={<NovoAgendamentoPage />} />
                  <Route path="/pacientes" element={<PatientList />} />
                  <Route path="/pacientes/novo" element={<PatientRegistrationPage />} />
                  <Route path="/pacientes/:id" element={<PatientProfileOverview />} />
                  <Route path="/dentistas" element={<DentistasPage />} />
                  <Route path="/dentistas/:id" element={<DoctorProfileOverview />} />
                  <Route path="/dashboard" element={<LuminaDashboard />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </ChunkErrorBoundary>
        </BrowserRouter>
      </BloqueiosProvider>
    </ConsultasProvider>
  );
}

export default App;
