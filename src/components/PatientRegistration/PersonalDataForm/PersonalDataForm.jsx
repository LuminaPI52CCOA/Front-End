import { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormInput } from '../FormInput/FormInput';
import { FormSelect } from '../FormSelect/FormSelect';
import { getEstadosCivis, DEFAULT_ESTADO_CIVIL_OPTIONS } from '../../../services/patientService';
import styles from './PersonalDataForm.module.css';

const convenioOptions = [
  'Particular',
  'Unimed',
  'Amil',
  'SulAmérica',
  'Bradesco Saúde',
  'Outros',
];

const sexoOptions = [
  'Masculino',
  'Feminino',
  'Outro',
  'Preferir não informar',
];

export const PersonalDataForm = () => {
  const { control, formState: { errors } } = useFormContext();
  const [estadoCivilOptions, setEstadoCivilOptions] = useState(DEFAULT_ESTADO_CIVIL_OPTIONS);

  useEffect(() => {
    let isMounted = true;
    getEstadosCivis().then((options) => {
      if (isMounted && options && options.length > 0) {
        setEstadoCivilOptions(options);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Dados Pessoais</h2>
      
      <div className={styles.formGrid}>
        {/* Nome Completo */}
        <Controller
          name="nomeCompleto"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Nome Completo"
              placeholder="Ex: João Silva"
              error={errors.nomeCompleto?.message}
            />
          )}
        />

        {/* Estado Civil */}
        <Controller
          name="estadoCivil"
          control={control}
          render={({ field }) => (
            <FormSelect
              {...field}
              label="Estado Civil"
              placeholder="Escolha"
              options={estadoCivilOptions}
              error={errors.estadoCivil?.message}
            />
          )}
        />

        {/* CPF */}
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

        {/* RG */}
        <Controller
          name="rg"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="RG"
              placeholder="00.000.000-0"
              mask="00.000.000-0"
              error={errors.rg?.message}
            />
          )}
        />

        {/* Data de Nascimento */}
        <Controller
          name="dataNascimento"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Data de Nascimento"
              placeholder="dd/mm/aaaa"
              mask="00/00/0000"
              error={errors.dataNascimento?.message}
            />
          )}
        />

        {/* Naturalidade */}
        <Controller
          name="naturalidade"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Naturalidade"
              placeholder="Cidade de nascimento"
              error={errors.naturalidade?.message}
            />
          )}
        />

        {/* Nacionalidade */}
        <Controller
          name="nacionalidade"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Nacionalidade"
              placeholder="Brasil"
              error={errors.nacionalidade?.message}
            />
          )}
        />

        {/* Convênio */}
        <Controller
          name="convenio"
          control={control}
          render={({ field }) => (
            <FormSelect
              {...field}
              label="Convênio"
              placeholder="Escolha"
              options={convenioOptions}
              error={errors.convenio?.message}
            />
          )}
        />

        {/* Sexo (spans 1 column) */}
        <div className={styles.halfWidth}>
          <Controller
            name="sexo"
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                label="Sexo"
                placeholder="Escolha"
                options={sexoOptions}
                error={errors.sexo?.message}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
