// Imports
const { z } = require('zod');
const validateCNPJ = require('./cnpjValidator');

// =====================================================================================

// Main Schema
const registerCompanySchema = z.object({
    company: z.object({
        nome: z.string().trim().min(2, 'Nome da empresa é obrigatório'),

        cnpj: z.string()
            .refine(validateCNPJ, 'CNPJ inválido')
            .transform(value => value.replace(/\D/g, ''))
    }),

    admin: z.object({
        nome: z.string().trim().min(2, 'Nome é obrigatório'),

        sobrenome: z.string().trim().min(2, 'Sobrenome é obrigatório'),

        data_nascimento: z.iso.date()
            .refine(value => value <= new Date().toISOString().slice(0, 10),
                'Data de nascimento não pode ser futura'),

        email: z.string().trim().toLowerCase().pipe(z.email()),

        password: z.string()
            .min(8, 'A senha deve ter pelo menos 8 caracteres')
            .max(128, 'A senha deve ter no máximo 128 caracteres')
    })
}).strict();

// =====================================================================================

// Export
module.exports = registerCompanySchema;
