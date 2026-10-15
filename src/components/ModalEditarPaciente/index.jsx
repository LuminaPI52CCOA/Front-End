import { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculateAge } from '../PatientRegistration/patientSchema';
import { pacienteEdicaoSchema } from '../../schemas/pacienteEdicaoSchema';
import { FormInput } from '../PatientRegistration/FormInput/FormInput';
import { Button } from '../Button';
import styles from './styles.module.css';

const IconeFechar = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const valoresIniciaisDe = (paciente) => ({
  nomeCompleto: paciente.nome ?? '',
  dataNascimento: paciente.dataNascimento ?? '',
  cep: paciente.contato?.endereco?.cep ?? '',
  enderecoTexto: paciente.contato?.endereco?.texto ?? '',
  email: paciente.contato?.email ?? '',
  telefone: paciente.contato?.telefone ?? '',
  indicadoPor: paciente.contato?.indicadoPor ?? '',
});

export function ModalEditarPaciente({ paciente, onCancelar, onSalvar }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pacienteEdicaoSchema),
    defaultValues: valoresIniciaisDe(paciente),
    mode: 'onTouched',
  });

  const fecharRef = useRef(null);
  const dataNascimento = watch('dataNascimento');
  const idade = dataNascimento ? calculateAge(dataNascimento) : null;

  useEffect(() => {
    fecharRef.current?.focus();

    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') onCancelar();
    };

    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [onCancelar]);

  const enviar = (dados) => {
    onSalvar({
      nome: dados.nomeCompleto.trim(),
      idade: calculateAge(dados.dataNascimento),
      dataNascimento: dados.dataNascimento,
      enderecoTexto: dados.enderecoTexto?.trim() ?? '',
      cep: dados.cep,
      email: dados.email.trim(),
      telefone: dados.telefone.replace(/\D/g, ''),
      indicadoPor: dados.indicadoPor?.trim() ?? '',
    });
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCancelar();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-editar-paciente"
      >
        <header className={styles.topo}>
          <h2 id="titulo-editar-paciente" className={styles.titulo}>
            Editar Perfil
          </h2>
          <button
            ref={fecharRef}
            type="button"
            className={styles.botaoFechar}
            onClick={onCancelar}
            aria-label="Fechar edição de perfil"
          >
            <IconeFechar />
          </button>
        </header>

        <form onSubmit={handleSubmit(enviar)} noValidate>
          <div className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Dados pessoais</h3>
            <div className={styles.grade}>
              <Controller
                name="nomeCompleto"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="Nome completo"
                    placeholder="Nome do paciente"
                    error={errors.nomeCompleto?.message}
                  />
                )}
              />

              <Controller
                name="dataNascimento"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="Data de nascimento"
                    placeholder="dd/mm/aaaa"
                    mask="00/00/0000"
                    error={errors.dataNascimento?.message}
                  />
                )}
              />

              {idade !== null && idade >= 0 && idade < 120 && (
                <p className={styles.idadeAtual} role="status">
                  Idade atual: {idade} anos
                </p>
              )}
            </div>
          </div>

          <div className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Endereço</h3>
            <div className={styles.grade}>
              <Controller
                name="cep"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="CEP"
                    placeholder="00000-000"
                    mask="00000-000"
                    error={errors.cep?.message}
                  />
                )}
              />

              <Controller
                name="enderecoTexto"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="Endereço"
                    placeholder="Rua, número, bairro, complemento"
                    error={errors.enderecoTexto?.message}
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    type="email"
                    label="Email"
                    placeholder="email@gmail.com"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                name="telefone"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="Número de telefone"
                    placeholder="(11)90000-0000"
                    mask="(00)00000-0000"
                    error={errors.telefone?.message}
                  />
                )}
              />

              <Controller
                name="indicadoPor"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="Indicado por"
                    placeholder="Nome"
                    error={errors.indicadoPor?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className={styles.acoes}>
            <Button variant="outline" type="button" onClick={onCancelar}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditarPaciente;
