import { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dentistaEdicaoSchema, ESPECIALIDADES, STATUS_OPTIONS } from '../../schemas/dentistaEdicaoSchema';
import { FormInput } from '../PatientRegistration/FormInput/FormInput';
import { FormSelect } from '../PatientRegistration/FormSelect/FormSelect';
import { Button } from '../Button';
import styles from './styles.module.css';

const IconeFechar = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const formatarTelefone = (tel) => {
  if (!tel) return '';
  const nums = tel.replace(/\D/g, '');
  if (nums.length === 11) {
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
  }
  if (nums.length === 10) {
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6, 10)}`;
  }
  return tel;
};

const valoresIniciaisDe = (dentista) => {
  if (!dentista) {
    return {
      nomeCompleto: '',
      email: '',
      telefone: '',
      especialidades: [],
      status: 'Ativo',
    };
  }
  return {
    nomeCompleto: dentista.nome ?? '',
    email: dentista.email ?? '',
    telefone: formatarTelefone(dentista.telefone ?? ''),
    especialidades: dentista.especialidades ? [dentista.especialidades] : (dentista.especialidade ? [dentista.especialidade] : []),
    status: dentista.status ?? 'Ativo',
  };
};

export function ModalEditarDentista({ dentista, onCancelar, onSalvar }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dentistaEdicaoSchema),
    defaultValues: valoresIniciaisDe(dentista),
    mode: 'onTouched',
  });

  const fecharRef = useRef(null);

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
      id: dentista.id,
      nome: dados.nomeCompleto.trim(),
      email: dados.email.trim(),
      telefone: dados.telefone.replace(/\D/g, ''),
      especialidades: dados.especialidades,
      status: dados.status,
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
        aria-labelledby="titulo-editar-dentista"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className={styles.topo}>
          <h2 id="titulo-editar-dentista" className={styles.titulo}>
            Editar Perfil do Dentista
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
                    placeholder="Nome do dentista"
                    error={errors.nomeCompleto?.message}
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
                    label="E-mail profissional"
                    placeholder="email@exemplo.com"
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
                    label="Telefone / WhatsApp"
                    placeholder="(11) 90000-0000"
                    mask="(00) 00000-0000"
                    error={errors.telefone?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className={styles.bloco}>
            <h3 className={styles.blocoTitulo}>Dados profissionais</h3>
            <div className={styles.grade}>
              <Controller
                name="especialidades"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    {...field}
                    label="Especialidades"
                    options={ESPECIALIDADES}
                    placeholder="Selecione uma ou mais"
                    error={errors.especialidades?.message}
                    multiple
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    {...field}
                    label="Status"
                    options={STATUS_OPTIONS}
                    placeholder="Selecione"
                    error={errors.status?.message}
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

export default ModalEditarDentista;