import { useNavigate } from 'react-router-dom';
import { PatientRegistration } from '../../components/PatientRegistration';

const PatientRegistrationPage = () => {
  const navigate = useNavigate();

  // Devolve o paciente com o ID real retornado pelo POST /clientes.
  const handleSuccess = (data, pacienteCriado) => {
    navigate('/novo-agendamento', {
      state: {
        novoPaciente: {
          idCliente: pacienteCriado?.idCliente ?? null,
          nome: pacienteCriado?.nome ?? data.nomeCompleto,
        },
      },
    });
  };

  return <PatientRegistration onSuccess={handleSuccess} />;
};

export default PatientRegistrationPage; 
