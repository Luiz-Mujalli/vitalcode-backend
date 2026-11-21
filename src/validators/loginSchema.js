// Imports
const { z } = require('zod');

// =====================================================================================

// Main Schema
const loginSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .pipe(z.email()),

    password: z.string().min(1, 'A senha é obrigatória')
}).strict();

// =====================================================================================

// Export
module.exports = loginSchema;