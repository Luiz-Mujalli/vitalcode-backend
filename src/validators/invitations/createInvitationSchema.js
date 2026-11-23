// Imports
const { z } = require('zod');

// =====================================================================================

// Main Schema
const createInvitationSchema = z.object({
    email: z.string()
        .trim()
        .toLowerCase()
        .pipe(z.email()),

    cargo: z.string()
        .trim()
        .min(1)
        .max(100)
        .optional()
}).strict();

// =====================================================================================

// Export
module.exports = createInvitationSchema;