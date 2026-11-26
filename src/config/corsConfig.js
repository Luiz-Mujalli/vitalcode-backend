// Validate Frontend URL
if (!process.env.FRONTEND_URL) {
    throw new Error('FRONTEND_URL is not configured');
}

const frontendURL = new URL(process.env.FRONTEND_URL);

if (!['http:', 'https:'].includes(frontendURL.protocol)) {
    throw new Error('FRONTEND_URL has an invalid protocol');
}

// =====================================================================================

// Allowed Origins
const allowedOrigins = [
    frontendURL.origin
];

// =====================================================================================

// CORS Configuration
const corsConfig = {
    origin: (origin, callback) => {

        // Allow Requests Without Origin
        if (!origin) {
            return callback(null, true);
        }

        // Validate Request Origin
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },

    methods: [
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS'
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ],

    credentials: false
};

// =====================================================================================

// Export
module.exports = corsConfig;
