import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { SuccessOverlay } from '../../components/SuccessOverlay';
import styles from './styles.module.css';
import Logo from '../../assets/logo.png'


import { useNavigate, Link } from 'react-router-dom';

const CadastroPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate(); 

  const onSubmit = (data) => {
    console.log('Dados simulados:', data);
    setIsSuccess(true);

    setTimeout(() => {
      navigate('/login'); 
    }, 2500);
  };

  const cargoOptions = [
    { value: 'recepcionista', label: 'Recepcionista' },
    { value: 'dentista', label: 'Dentista' }
  ];

  return (
    <div className={styles.container}>
      
      {isSuccess && (
        <SuccessOverlay
          title="Sucesso!"
          subtitle="Cadastro realizado. Redirecionando..."
        />
      )}

      <div className={styles.card}>
        <div className={styles.header}>
          <img className={styles.logo} src={Logo} alt="Logo Lumina" />
          <h1 className={styles.title}>Cadastro</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="CPF:"
            placeholder="000.000.000-00"
            mask="cpf"
            error={errors.cpf?.message}
            {...register('cpf', { 
              required: 'O CPF é obrigatório',
              validate: (value) => value.replace(/\D/g, '').length === 11 || 'CPF incompleto (11 dígitos)'
            })}
          />

          <Input
            label="Email:"
            type="email"
            placeholder="lumina@email.com"
            error={errors.email?.message}
            {...register('email', { 
              required: 'O e-mail é obrigatório',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'E-mail inválido'
              }
            })}
          />

          <Input
            label="Senha:"
            type="password"
            placeholder="••••••••"
            error={errors.senha?.message}
            {...register('senha', { 
              required: 'A senha é obrigatória',
              minLength: { value: 6, message: 'Mínimo de 6 caracteres' }
            })}
          />

          <Select
            label="Cargo:"
            options={cargoOptions}
            {...register('cargo')}
          />

          <Button className={styles.submit} full type="submit" icon="→">
            Cadastrar
          </Button>
        </form>

        <div className={styles.footerText}>
          Já possui conta? <Link to="/login">Fazer Login</Link>
        </div>
      </div>
    </div>
  );
};

export default CadastroPage;