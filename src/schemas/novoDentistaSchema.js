import { z } from 'zod';

export const novoDentistaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'Informe o nome completo'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe o e-mail')
    .refine(
      (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor),
      'Formato de e-mail inválido',
    ),
  cpf: z
    .string()
    .refine(
      (valor) => valor.replace(/\D/g, '').length === 11,
      'Informe um CPF com 11 dígitos',
    ),
  cro: z
    .string()
    .trim()
    .min(4, 'Informe o CRO'),
  especialidade: z
    .string()
    .min(1, 'Selecione a especialidade'),
});
