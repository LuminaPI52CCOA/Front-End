import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { SuccessOverlay } from '../../components/SuccessOverlay';
import { userService } from '../../services/userService';
import styles from './styles.module.css';
import Logo from '../../assets/logo.png';

const CadastroPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  const cargoSelecionado = watch('cargo');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErro('');

    const cleanCpf = data.cpf.replace(/\D/g, '');
    const isDentista = data.cargo === 'dentista' || data.cargo === 2 || data.cargo === '2';
    const fkPerfil = isDentista ? 2 : 3;
    const croFinal = (data.cro && data.cro.trim())
      ? data.cro.trim()
      : (isDentista ? 'SP-CD-00000' : 'N/A');
    const nomeFinal = (data.nome && data.nome.trim())
      ? data.nome.trim()
      : (data.email ? data.email.split('@')[0] : 'Usuário Lumina');

    try {
      await userService.cadastrar(
        nomeFinal,
        cleanCpf,
        data.email,
        data.senha,
        croFinal,
        fkPerfil,
        true
      );
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      setErro(error.message || 'Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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

        {erro && (
          <div className={styles.erroMensagem} role="alert">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            id="nome"
            label="Nome Completo:"
            placeholder="Seu nome completo"
            disabled={isLoading}
            error={errors.nome?.message}
            {...register('nome')}
          />

          <Input
            id="cpf"
            label="CPF:"
            placeholder="000.000.000-00"
            mask="cpf"
            disabled={isLoading}
            error={errors.cpf?.message}
            {...register('cpf', { 
              required: 'O CPF é obrigatório',
              validate: (value) => value.replace(/\D/g, '').length === 11 || 'CPF incompleto (11 dígitos)'
            })}
          />

          <Input
            id="email"
            label="Email:"
            type="email"
            placeholder="lumina@email.com"
            disabled={isLoading}
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
            id="senha"
            label="Senha:"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            error={errors.senha?.message}
            {...register('senha', { 
              required: 'A senha é obrigatória',
              minLength: { value: 6, message: 'Mínimo de 6 caracteres' }
            })}
          />

          {cargoSelecionado === 'dentista' && (
            <Input
              id="cro"
              label="CRO:"
              placeholder="SP-CD-12345"
              disabled={isLoading}
              error={errors.cro?.message}
              {...register('cro', {
                required: cargoSelecionado === 'dentista' ? 'O CRO é obrigatório' : false
              })}
            />
          )}

          <Select
            id="cargo"
            label="Cargo:"
            options={cargoOptions}
            disabled={isLoading}
            {...register('cargo')}
          />

          <Button className={styles.submit} full type="submit" icon="→" disabled={isLoading}>
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