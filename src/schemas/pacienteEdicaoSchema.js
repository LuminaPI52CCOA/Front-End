import { z } from 'zod';
import { isValidBirthDate } from '../components/PatientRegistration/patientSchema';

export const pacienteEdicaoSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(1, 'Nome completo é obrigatório')
    .min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  dataNascimento: z
    .string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine((val) => val.replace(/\D/g, '').length === 8, 'Data incompleta (dd/mm/aaaa)')
    .refine((val) => isValidBirthDate(val), 'Data de nascimento inválida ou futura'),
  cep: z
    .string()
    .min(1, 'CEP é obrigatório')
    .refine((val) => val.replace(/\D/g, '').length === 8, 'CEP incompleto (8 dígitos)'),
  enderecoTexto: z.string().trim().min(1, 'Endereço é obrigatório'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim()), 'Formato de e-mail inválido'),
  telefone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .refine((val) => val.replace(/\D/g, '').length >= 10, 'Telefone incompleto (10 ou 11 dígitos)'),
  indicadoPor: z.string().optional(),
});
