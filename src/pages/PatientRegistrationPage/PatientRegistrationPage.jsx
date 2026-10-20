import { useNavigate } from 'react-router-dom';
import { PatientRegistration } from '../../components/PatientRegistration';

const PatientRegistrationPage = () => {
  const navigate = useNavigate();

  const handleSuccess = (data) => {
    navigate('/novo-agendamento', { state: { novoPaciente: data.nomeCompleto } });
  };

  return <PatientRegistration onSuccess={handleSuccess} />;
};

export default PatientRegistrationPage; 
