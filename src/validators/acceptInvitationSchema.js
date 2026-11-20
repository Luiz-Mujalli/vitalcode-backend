const { z } = require('zod');

const acceptInvitationSchema = z.object({
    token: z.string()
        .regex(/^[a-fA-F-0-9]{64}$/, 'Token Inválido')
}).strict();

module.exports = acceptInvitationSchema;