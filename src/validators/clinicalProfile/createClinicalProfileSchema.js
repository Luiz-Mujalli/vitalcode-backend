// Imports
const { z } = require('zod');

const bloodTypes = [
    'A+', 'A-',
    'B+', 'B-',
    'AB+', 'AB-',
    'O+', 'O-',
    'Não sei'
];

// ===============================================================================

// Main Schema
const clinicalProfileFields = z.object({
    tipo_sanguineo: z.enum(bloodTypes)
        .nullable()
        .optional(),

    alergias: z.string()
        .trim()
        .max(5000)
        .nullable()
        .optional(),

    medicamentos: z.string()
        .trim()
        .max(5000)
        .nullable()
        .optional(),

    doencas: z.string()
        .trim()
        .max(5000)
        .nullable()
        .optional(),

    cirurgias: z.string()
        .trim()
        .max(5000)
        .nullable()
        .optional(),

    contato_emergencia_nome: z.string()
        .trim()
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(150)
        .nullable()
        .optional(),

    contato_emergencia_telefone: z.string()
        .trim()
        .regex(
            /^\+?[0-9()\s-]{10,20}$/,
            'Telefone de emergência inválido'
        )
        .nullable()
        .optional()

}).strict();

const createClinicalProfileSchema = clinicalProfileFields
    .refine(
        data => Object.keys(data).length > 0,
        { message: 'Informe pelo menos um campo' }
    );

const updateClinicalProfileSchema = clinicalProfileFields
    .refine(
        data => Object.keys(data).length > 0,
        { message: 'Informe pelo menos um campo para atualizar' }
    );

// ===============================================================================

// Export
module.exports = {
    createClinicalProfileSchema,
    updateClinicalProfileSchema
};
