const { z } = require('zod');

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

module.exports = createInvitationSchema;