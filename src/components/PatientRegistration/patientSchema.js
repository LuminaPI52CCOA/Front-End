import { z } from 'zod';

export const isValidBirthDate = (dobString) => {
  if (!dobString || dobString.replace(/\D/g, '').length < 8) return false;
  const parts = dobString.split('/');
  if (parts.length !== 3) return false;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return false;

  // Validar data exata no calendário (trata ano bissexto, dias por mês)
  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return false;
  }

  // Não pode ser uma data futura
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (birthDate > today) return false;

  return true;
};

export const calculateAge = (dobString) => {
  if (!isValidBirthDate(dobString)) return 99;
  const parts = dobString.split('/');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const birthDate = new Date(year, month, day);

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const isMinor = (dobString) => {
  return calculateAge(dobString) < 18;
};

export const patientSchema = z
  .object({
    // Etapa 1: Dados Pessoais
    nomeCompleto: z
      .string()
      .min(1, 'Nome completo é obrigatório')
      .min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
    estadoCivil: z.string().min(1, 'Selecione o estado civil'),
    cpf: z
      .string()
      .min(1, 'CPF é obrigatório')
      .refine((val) => val.replace(/\D/g, '').length === 11, 'CPF incompleto (11 dígitos)'),
    rg: z
      .string()
      .min(1, 'RG é obrigatório')
      .refine((val) => val.replace(/\D/g, '').length >= 7, 'RG incompleto'),
    dataNascimento: z
      .string()
      .min(1, 'Data de nascimento é obrigatória')
      .refine((val) => val.replace(/\D/g, '').length === 8, 'Data incompleta (dd/mm/aaaa)')
      .refine((val) => isValidBirthDate(val), 'Data de nascimento inválida ou futura'),
    naturalidade: z.string().min(1, 'Naturalidade é obrigatória'),
    nacionalidade: z.string().min(1, 'Nacionalidade é obrigatória'),
    convenio: z.string().min(1, 'Selecione o convênio'),
    sexo: z.string().min(1, 'Selecione o sexo'),

    // Etapa 2: Endereço & Contato
    cep: z
      .string()
      .min(1, 'CEP é obrigatório')
      .refine((val) => val.replace(/\D/g, '').length === 8, 'CEP incompleto (8 dígitos)'),
    rua: z.string().min(1, 'Rua é obrigatória'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional(),
    email: z
      .string()
      .min(1, 'E-mail é obrigatório')
      .email('Formato de e-mail inválido'),
    telefone: z
      .string()
      .min(1, 'Telefone é obrigatório')
      .refine((val) => val.replace(/\D/g, '').length >= 10, 'Telefone incompleto'),
    indicadoPor: z.string().optional(),

    // Etapa 3: Responsável Legal
    nomeResponsavel: z.string().optional(),
    cpfResponsavel: z.string().optional(),
    rgResponsavel: z.string().optional(),
    grauParentesco: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (isMinor(data.dataNascimento)) {
      if (!data.nomeResponsavel || data.nomeResponsavel.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Nome do responsável é obrigatório para menores de idade',
          path: ['nomeResponsavel'],
        });
      }
      if (!data.cpfResponsavel || data.cpfResponsavel.replace(/\D/g, '').length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CPF do responsável incompleto (11 dígitos)',
          path: ['cpfResponsavel'],
        });
      }
      if (!data.rgResponsavel || data.rgResponsavel.replace(/\D/g, '').length < 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'RG do responsável é obrigatório',
          path: ['rgResponsavel'],
        });
      }
      if (!data.grauParentesco || data.grauParentesco.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione o grau de parentesco',
          path: ['grauParentesco'],
        });
      }
    }
  });

export const STEP_FIELDS = [
  ['nomeCompleto', 'estadoCivil', 'cpf', 'rg', 'dataNascimento', 'naturalidade', 'nacionalidade', 'convenio', 'sexo'],
  ['cep', 'rua', 'bairro', 'numero', 'complemento', 'email', 'telefone', 'indicadoPor'],
  ['nomeResponsavel', 'cpfResponsavel', 'rgResponsavel', 'grauParentesco'],
];
