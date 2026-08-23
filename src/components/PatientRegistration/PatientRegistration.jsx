import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { patientSchema, STEP_FIELDS, isMinor } from './patientSchema';
import { Stepper } from './Stepper/Stepper';
import { PersonalDataForm } from './PersonalDataForm/PersonalDataForm';
import { AddressContactForm } from './AddressContactForm/AddressContactForm';
import { LegalGuardianForm } from './LegalGuardianForm/LegalGuardianForm';
import styles from './PatientRegistration.module.css';

export const PatientRegistration = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedData, setSubmittedData] = useState(null);

  const methods = useForm({
    resolver: zodResolver(patientSchema),
    mode: 'onTouched',
    defaultValues: {
      nomeCompleto: '',
      estadoCivil: '',
      cpf: '',
      rg: '',
      dataNascimento: '',
      naturalidade: '',
      nacionalidade: 'Brasil',
      convenio: '',
      sexo: '',
      cep: '',
      rua: '',
      bairro: '',
      numero: '',
      complemento: '',
      email: '',
      telefone: '',
      indicadoPor: '',
      nomeResponsavel: '',
      cpfResponsavel: '',
      rgResponsavel: '',
      grauParentesco: '',
    },
  });

  const { trigger, handleSubmit, watch } = methods;

  const dataNascimento = watch('dataNascimento');
  const minor = isMinor(dataNascimento);
  const lastStepIndex = minor ? 2 : 1;

  // Reset to last available step if user becomes adult after navigating to step 2
  useEffect(() => {
    if (!minor && currentStep > 1) {
      setCurrentStep(1);
    }
  }, [minor, currentStep]);

  const validateStepsUpTo = async (targetStep) => {
    for (let s = 0; s < targetStep; s++) {
      const isStepValid = await trigger(STEP_FIELDS[s]);
      if (!isStepValid) {
        return s;
      }
    }
    return targetStep;
  };

  const handleNextStep = async () => {
    const nextStep = Math.min(currentStep + 1, lastStepIndex);
    const validStep = await validateStepsUpTo(nextStep);
    setCurrentStep(validStep);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = async (targetStep) => {
    if (targetStep > lastStepIndex) return;

    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
    } else if (targetStep > currentStep) {
      const validStep = await validateStepsUpTo(targetStep);
      setCurrentStep(validStep);
    }
  };

  const onSubmit = (data) => {
    // If not minor, clean up any residual guardian fields
    const finalData = { ...data };
    if (!minor) {
      delete finalData.nomeResponsavel;
      delete finalData.cpfResponsavel;
      delete finalData.rgResponsavel;
      delete finalData.grauParentesco;
    }

    console.log('JSON final e validado do cadastro de paciente:', finalData);
    setSubmittedData(finalData);
    if (onSuccess) {
      onSuccess(finalData);
    }
  };

  const isFinalStep = currentStep === lastStepIndex;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* Menu de etapas (Stepper) */}
        <Stepper
          currentStep={currentStep}
          onStepClick={handleStepClick}
          isMinor={minor}
        />

        {/* Container principal do formulário */}
        <div className={styles.formCard}>
          {submittedData && (
            <div className={styles.successBanner}>
              ✓ Paciente cadastrado com sucesso! Veja o console para detalhes dos dados em JSON.
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {currentStep === 0 && <PersonalDataForm />}
              {currentStep === 1 && <AddressContactForm />}
              {currentStep === 2 && minor && <LegalGuardianForm />}

              <div className={styles.footerDivider}>
                {currentStep > 0 && (
                  <button
                    type="button"
                    className={styles.backButton}
                    onClick={handlePrevStep}
                  >
                    <ArrowLeft size={18} />
                    Voltar
                  </button>
                )}

                {!isFinalStep ? (
                  <button
                    type="button"
                    className={styles.submitButton}
                    onClick={handleNextStep}
                  >
                    Próximo
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button type="submit" className={styles.submitButton}>
                    Cadastrar
                    <ArrowRight size={18} />
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
