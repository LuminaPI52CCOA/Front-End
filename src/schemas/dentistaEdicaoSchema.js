import { z } from 'zod';

const especialidades = [
  'Endodontia',
  'Periodontia',
  'Limpeza',
  'Odontopediatria',
  'Ortodontia',
  'Implantodontia',
  'Cirurgia',
  'Prótese',
  'Dentística',
  'Radiologia',
];

const statusOptions = ['Ativo', 'Inativo'];

export const dentistaEdicaoSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(1, 'Nome completo é obrigatório')
    .min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim()), 'Formato de e-mail inválido'),
  telefone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .refine((val) => val.replace(/\D/g, '').length >= 10, 'Telefone incompleto (10 ou 11 dígitos)'),
  especialidades: z.array(z.string()).min(1, 'Selecione ao menos uma especialidade'),
  status: z.string().min(1, 'Selecione o status'),
});

export const ESPECIALIDADES = especialidades.map((e) => ({ value: e, label: e }));
export const STATUS_OPTIONS = statusOptions.map((s) => ({ value: s, label: s }));