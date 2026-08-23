import React, { useState, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { FormInput } from '../FormInput/FormInput';
import { FormSelect } from '../FormSelect/FormSelect';
import { searchGuardianByCpf } from '../../../services/guardianService';
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
  const { control, setValue, watch, formState: { errors } } = useFormContext();

  const [status, setStatus] = useState('idle'); // 'idle' | 'searching' | 'found' | 'not_found'

  const cpfValue = watch('cpfResponsavel');

  useEffect(() => {
    const cleanCpf = (cpfValue || '').replace(/\D/g, '');

    // Se o CPF tiver 11 dígitos
    if (cleanCpf.length === 11) {
      let isCurrent = true;
      setStatus('searching');

      searchGuardianByCpf(cleanCpf)
        .then((result) => {
          if (!isCurrent) return;

          if (result && result.found && result.data) {
            setValue('nomeResponsavel', result.data.nome || '', { shouldValidate: true });
            setValue('rgResponsavel', result.data.rg || '', { shouldValidate: true });
            setValue('grauParentesco', result.data.grauParentesco || 'Pai / Mãe', { shouldValidate: true });
            setStatus('found');
          } else {
            // Se não encontrou, limpa os campos para permitir digitação livre
            setValue('nomeResponsavel', '', { shouldValidate: false });
            setValue('rgResponsavel', '', { shouldValidate: false });
            setValue('grauParentesco', '', { shouldValidate: false });
            setStatus('not_found');
          }
        })
        .catch(() => {
          if (!isCurrent) return;
          setValue('nomeResponsavel', '', { shouldValidate: false });
          setValue('rgResponsavel', '', { shouldValidate: false });
          setValue('grauParentesco', '', { shouldValidate: false });
          setStatus('not_found');
        });

      return () => {
        isCurrent = false;
      };
    } else {
      // Menos de 11 dígitos: oculta os outros campos e volta ao estado inicial
      setStatus('idle');
    }
  }, [cpfValue, setValue]);

  const isLocked = status === 'found';
  const showOtherFields = status === 'found' || status === 'not_found';

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Responsável Legal</h2>

      <div className={styles.searchSection}>
        <div className={styles.cpfRow}>
          <div className={styles.cpfContainer}>
            <Controller
              name="cpfResponsavel"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  label="CPF do Responsável"
                  placeholder="000.000.000-00"
                  mask="000.000.000-00"
                  error={errors.cpfResponsavel?.message}
                />
              )}
            />

            {status === 'searching' && (
              <div className={styles.spinnerWrapper} title="Consultando CPF...">
                <Loader2 size={20} />
              </div>
            )}
          </div>
        </div>

        {status === 'idle' && (
          <p className={styles.initialHint}>
            Informe o CPF do responsável legal para consultar o cadastro no sistema.
          </p>
        )}

        {status === 'found' && (
          <div className={styles.statusBannerFound}>
            <CheckCircle2 size={18} className={styles.statusIcon} />
            <span className={styles.statusText}>
              Responsável encontrado no sistema. Os dados foram preenchidos automaticamente e estão protegidos para edição.
            </span>
          </div>
        )}

        {status === 'not_found' && (
          <div className={styles.statusBannerNotFound}>
            <AlertCircle size={18} className={styles.statusIcon} />
            <span className={styles.statusText}>
              Responsável não localizado no sistema. Por favor, preencha os dados cadastrais abaixo.
            </span>
          </div>
        )}
      </div>

      {showOtherFields && (
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
                disabled={isLocked}
                error={errors.nomeResponsavel?.message}
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
                disabled={isLocked}
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
                disabled={isLocked}
                error={errors.grauParentesco?.message}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};
