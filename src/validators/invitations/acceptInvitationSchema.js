// Imports
const { z } = require('zod');

// =====================================================================================

// Main Schema
const acceptInvitationSchema = z.object({
    token: z.string()
        .regex(/^[a-fA-F-0-9]{64}$/, 'Token Inválido')
}).strict();

// =====================================================================================

// Export
module.exports = acceptInvitationSchema;