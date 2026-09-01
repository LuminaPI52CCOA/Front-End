import { useFormContext, Controller } from 'react-hook-form';
import { FormInput } from '../FormInput/FormInput';
import { FormSelect } from '../FormSelect/FormSelect';
import styles from './LegalGuardianForm.module.css';

const grauParentescoOptions = [
  'Pai / Mãe',
  'Cônjuge',
  'Avô / Avó',
  'Tio / Tia',
  'Tutor Legal',
  'Outro',
];

export const LegalGuardianForm = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={styles.formContainer}>

      <h2 className={styles.title}>Responsável Legal</h2>

      <div className={styles.formGrid}>
        {/* Nome completo */}
        <Controller
          name="nomeResponsavel"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Nome completo"
              placeholder="Nome Completo"
              error={errors.nomeResponsavel?.message}
            />
          )}
        />

        {/* CPF */}
        <Controller
          name="cpfResponsavel"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="CPF"
              placeholder="000.000.000-00"
              mask="000.000.000-00"
              error={errors.cpfResponsavel?.message}
            />
          )}
        />

        {/* RG */}
        <Controller
          name="rgResponsavel"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="RG"
              placeholder="00.000.000-0"
              mask="00.000.000-0"
              error={errors.rgResponsavel?.message}
            />
          )}
        />

        {/* Grau de parentesco */}
        <Controller
          name="grauParentesco"
          control={control}
          render={({ field }) => (
            <FormSelect
              {...field}
              label="Grau de parentesco"
              placeholder="Escolha"
              options={grauParentescoOptions}
              error={errors.grauParentesco?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
