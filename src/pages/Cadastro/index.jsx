import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import Logo from '../../assets/logo.png';
import styles from './styles.module.css';
import { userService } from '../../services/userService';

const CadastroPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErro('');

    try {
      await userService.cadastrar(data.nome, data.cpf, data.email, data.senha, data.cro, data.cargo, true);
      
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      setErro(error.message || 'Erro ao fazer cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const cargoOptions = [
    { value: 1, label: 'Recepcionista' },
    { value: 2, label: 'Dentista' },
    { value: 3, label: 'Administrador' }
  ];

  return (
    <div className={styles.container}>

      {isSuccess && (
        <div className={styles.overlay}>
          <div className={styles.successBox}>
            <svg className={styles.animatedCheck} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" />
              <path d="M30 50 L45 65 L70 35" />
            </svg>
            <h2 className={styles.successTitle}>Sucesso!</h2>
            <p className={styles.successSubtitle}>Cadastro realizado. Redirecionando...</p>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.header}>
          <img className={styles.logo} src={Logo} alt="Logo Lumina" />
          <h1 className={styles.title}>Cadastro</h1>
        </div>

        {erro && (
          <div className={styles.erroMensagem}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nome:"
            placeholder="Seu nome completo"
            error={errors.nome?.message}
            disabled={isLoading}
            {...register('nome', {
              required: 'O nome é obrigatório',
              minLength: { value: 2, message: 'Mínimo de 2 caracteres' }
            })}
          />

          <Input
            label="CPF:"
            placeholder="000.000.000-00"
            mask="cpf"
            error={errors.cpf?.message}
            disabled={isLoading}
            maxLength={14}
            minLength={14}
            {...register('cpf', {
              required: 'O CPF é obrigatório',
              minLength: { value: 14, message: 'CPF incompleto' }
            })}
          />

          <Input
            label="Email:"
            type="email"
            placeholder="lumina@email.com"
            error={errors.email?.message}
            disabled={isLoading}
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
            disabled={isLoading}
            {...register('senha', {
              required: 'A senha é obrigatória',
              minLength: { value: 6, message: 'Mínimo de 6 caracteres' }
            })}
          />

          <Input
            label="CRO:"
            placeholder="SP-CD-12345"
            error={errors.cro?.message}
            disabled={isLoading}
            {...register('cro', {
              required: 'O CRO é obrigatório',
              minLength: { value: 6, message: 'Mínimo de 6 caracteres' }
            })}
          />

          <Select
            label="Cargo:"
            options={cargoOptions}
            disabled={isLoading}
            {...register('cargo', { valueAsNumber: true })}
          />

          <Button type="submit" icon="→" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
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