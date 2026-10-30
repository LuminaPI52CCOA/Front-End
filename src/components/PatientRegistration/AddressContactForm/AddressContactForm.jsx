import { useRef, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { FormInput } from '../FormInput/FormInput';
import { buscarCep } from '../../../services/cepService';
import styles from './AddressContactForm.module.css';

export const AddressContactForm = () => {
  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    setFocus,
    clearErrors,
    setError,
  } = useFormContext();

  const ultimoCepRef = useRef('');
  const [carregandoCep, setCarregandoCep] = useState(false);
  const [ruaBloqueada, setRuaBloqueada] = useState(() => {
    const cepAtual = (getValues('cep') || '').replace(/\D/g, '');
    return Boolean(cepAtual.length === 8 && getValues('rua'));
  });
  const [bairroBloqueado, setBairroBloqueado] = useState(() => {
    const cepAtual = (getValues('cep') || '').replace(/\D/g, '');
    return Boolean(cepAtual.length === 8 && getValues('bairro'));
  });

  const handleCepChange = async (e, fieldOnChange) => {
    fieldOnChange(e);
    const valor = e?.target?.value || '';
    const digitos = valor.replace(/\D/g, '');

    if (digitos.length !== 8) {
      ultimoCepRef.current = '';
      setRuaBloqueada(false);
      setBairroBloqueado(false);
      return;
    }

    if (ultimoCepRef.current === digitos) {
      return;
    }

    ultimoCepRef.current = digitos;
    setCarregandoCep(true);

    const dados = await buscarCep(digitos);
    setCarregandoCep(false);

    if (!dados) {
      setRuaBloqueada(false);
      setBairroBloqueado(false);
      setError('cep', { type: 'manual', message: 'CEP não encontrado' });
      return;
    }

    if (dados.rua) {
      setValue('rua', dados.rua, { shouldValidate: true, shouldDirty: true });
      setRuaBloqueada(true);
    } else {
      setRuaBloqueada(false);
    }

    if (dados.bairro) {
      setValue('bairro', dados.bairro, { shouldValidate: true, shouldDirty: true });
      setBairroBloqueado(true);
    } else {
      setBairroBloqueado(false);
    }

    clearErrors(['rua', 'bairro', 'cep']);

    if (dados.rua || dados.bairro) {
      setFocus?.('numero');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Endereço</h2>

      <div className={styles.formGrid}>
        {/* CEP */}
        <div className={styles.cepWrapper}>
          <Controller
            name="cep"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label="CEP"
                placeholder="00000-000"
                mask="00000-000"
                onChange={(e) => handleCepChange(e, field.onChange)}
                error={errors.cep?.message}
              />
            )}
          />
          {carregandoCep && (
            <div className={styles.cepSpinner} aria-label="Buscando endereço">
              <Loader2 size={18} className={styles.spinnerIcon} />
            </div>
          )}
        </div>

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
              disabled={ruaBloqueada}
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
              disabled={bairroBloqueado}
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

      {/* Termo de Consentimento LGPD */}
      <Controller
        name="consentimentoLgpd"
        control={control}
        render={({ field }) => (
          <div className={styles.lgpdContainer}>
            <label className={styles.lgpdLabel}>
              <input
                type="checkbox"
                className={styles.lgpdCheckbox}
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <span className={styles.lgpdText}>
                Confirmo que o(a) paciente (ou seu responsável legal) autorizou o tratamento de seus dados pessoais e dados pessoais sensíveis de saúde (prontuário, anamnese e exames armazenados com pseudonimização) exclusivamente para fins de assistência odontológica, agendamento e obrigações legais, em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD, Arts. 7º e 11)</strong>.
              </span>
            </label>
            {errors.consentimentoLgpd?.message && (
              <span className={styles.lgpdError}>{errors.consentimentoLgpd.message}</span>
            )}
          </div>
        )}
      />
    </div>
  );
};
