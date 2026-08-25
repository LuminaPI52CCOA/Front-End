import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { FormInput } from '../FormInput/FormInput';
import styles from './AddressContactForm.module.css';

export const AddressContactForm = () => {
  const { control, formState: { errors } } = useFormContext();

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Endereço</h2>

      <div className={styles.formGrid}>
        {/* CEP */}
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

        {/* Rua */}
        <Controller
          name="rua"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Rua"
              placeholder="Nome da Rua"
              error={errors.rua?.message}
            />
          )}
        />

        {/* Bairro */}
        <Controller
          name="bairro"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Bairro"
              placeholder="Nome do Bairro"
              error={errors.bairro?.message}
            />
          )}
        />

        {/* Número */}
        <Controller
          name="numero"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Número"
              placeholder="67"
              error={errors.numero?.message}
            />
          )}
        />

        {/* Complemento */}
        <Controller
          name="complemento"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Complemento"
              placeholder="Complemento"
              error={errors.complemento?.message}
            />
          )}
        />

        {/* Email */}
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

        {/* Número de telefone */}
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

        {/* Indicado por */}
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
  );
};
