// Imports
const { z } = require('zod');

// Main Schema
const registerInvitedUserSchema = z.object({
    token: z.string()
        .regex(/^[a-fA-F0-9]{64}$/, 'Token inválido'),

    nome: z.string().trim().min(2).max(100),

    sobrenome: z.string().trim().min(2).max(100),

    data_nascimento: z.iso.date()
        .refine(
            value => value <= new Date().toISOString().slice(0, 10),
            'Data de nascimento não pode ser futura'
        ),

    email: z.string().trim().toLowerCase().pipe(z.email()),

    password: z.string()
        .min(8, 'A senha deve ter pelo menos 8 caracteres')
        .max(128, 'A senha deve ter no máximo 128 caracteres')
}).strict();

// =====================================================================================

// Export
module.exports = registerInvitedUserSchema;