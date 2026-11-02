import { lazy } from 'react';

const carregadores = {
  login: () => import('../pages/Login/Login'),
  cadastro: () => import('../pages/Cadastro'),
  confirmarConsulta: () => import('../pages/ConfirmarConsulta'),
  agenda: () => import('../pages/Agenda'),
  novoAgendamento: () => import('../pages/NovoAgendamento'),
  pacientes: () => import('../components/PatientList'),
  novoPaciente: () => import('../pages/PatientRegistrationPage/PatientRegistrationPage'),
  perfilPaciente: () => import('../components/PatientProfileOverview'),
  dentistas: () => import('../pages/Dentistas'),
  perfilDentista: () => import('../components/DoctorProfileOverview'),
  dashboard: () => import('../pages/Dashboard/Dashboard'),
};

export const LoginPage = lazy(carregadores.login);
export const CadastroPage = lazy(carregadores.cadastro);
export const ConfirmarConsultaPage = lazy(carregadores.confirmarConsulta);
export const AgendaPage = lazy(carregadores.agenda);
export const NovoAgendamentoPage = lazy(carregadores.novoAgendamento);
export const PatientList = lazy(carregadores.pacientes);
export const PatientRegistrationPage = lazy(carregadores.novoPaciente);
export const PatientProfileOverview = lazy(carregadores.perfilPaciente);
export const DentistasPage = lazy(carregadores.dentistas);
export const DoctorProfileOverview = lazy(carregadores.perfilDentista);
export const LuminaDashboard = lazy(carregadores.dashboard);

/**
 * Pré-carrega, em segundo plano, os chunks das rotas autenticadas mais usadas.
 * Chamado após o login bem-sucedido para evitar o spinner na primeira navegação.
 * Falhas são ignoradas: o React.lazy tentará novamente na navegação real.
 */
export function prefetchRotasAutenticadas() {
  [carregadores.dashboard, carregadores.agenda].forEach((carregar) => {
    carregar().catch(() => {});
  });
}
