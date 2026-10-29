import { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { novoDentistaSchema } from '../../schemas/novoDentistaSchema';
import { ESPECIALIDADES } from '../../data/agenda';
import { FormInput } from '../PatientRegistration/FormInput/FormInput';
import { FormSelect } from '../PatientRegistration/FormSelect/FormSelect';
import { Button } from '../Button';
import styles from './styles.module.css';

export function ModalNovoDentista({ onCancelar, onSalvar }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(novoDentistaSchema),
    defaultValues: {
      nome: '',
      email: '',
      cpf: '',
      cro: '',
      especialidade: '',
    },
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
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      cpf: dados.cpf.replace(/\D/g, ''),
      cro: dados.cro.trim(),
      especialidade: dados.especialidade,
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
        aria-labelledby="titulo-novo-dentista"
      >
        <header className={styles.topo}>
          <h2 id="titulo-novo-dentista" className={styles.titulo}>
            Novo Dentista
          </h2>
          <button
            ref={fecharRef}
            type="button"
            className={styles.botaoFechar}
            onClick={onCancelar}
            aria-label="Fechar cadastro de dentista"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit(enviar)} noValidate>
          <div className={styles.grade}>
            <div className={styles.campoFull}>
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <FormInput
                    {...field}
                    label="Nome completo"
                    placeholder="Nome do dentista"
                    error={errors.nome?.message}
                    autoFocus
                  />
                )}
              />
            </div>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="email"
                  label="E-mail"
                  placeholder="email@exemplo.com"
                  error={errors.email?.message}
                />
              )}
            />

            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="CPF"
                  placeholder="000.000.000-00"
                  mask="000.000.000-00"
                  error={errors.cpf?.message}
                />
              )}
            />

            <Controller
              name="especialidade"
              control={control}
              render={({ field }) => (
                <FormSelect
                  {...field}
                  label="Especialidade"
                  options={ESPECIALIDADES}
                  placeholder="Selecione"
                  error={errors.especialidade?.message}
                />
              )}
            />

            <Controller
              name="cro"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="CRO"
                  placeholder="CRO SP-000000"
                  error={errors.cro?.message}
                />
              )}
            />
          </div>

          <div className={styles.acoes}>
            <Button variant="outline" type="button" onClick={onCancelar}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar Dentista
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalNovoDentista;
