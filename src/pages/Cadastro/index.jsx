import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import * as S from './styles';
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
    { value: 'dentista', label: 'Dentista' },
    { value: 'admin', label: 'Administrador' }
  ];

  return (
    <S.Container>
      
      {isSuccess && (
        <S.Overlay>
          <S.SuccessBox>
            <S.AnimatedCheck viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" />
              <path d="M30 50 L45 65 L70 35" />
            </S.AnimatedCheck>
            <S.SuccessTitle>Sucesso!</S.SuccessTitle>
            <S.SuccessSubtitle>Cadastro realizado. Redirecionando...</S.SuccessSubtitle>
          </S.SuccessBox>
        </S.Overlay>
      )}

      <S.Card>
        <S.Header>
          <S.Logo src={Logo} alt="Logo Lumina" />
          <S.Title>Cadastro</S.Title>
        </S.Header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="CPF:"
            placeholder="000.000.000-00"
            mask="cpf"
            error={errors.cpf?.message}
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

          <Button type="submit" icon="→">
            Cadastrar
          </Button>
        </form>

        <S.FooterText>
          Já possui conta? <Link to="/login">Fazer Login</Link>
        </S.FooterText>
      </S.Card>
    </S.Container>
  );
};

export default CadastroPage;