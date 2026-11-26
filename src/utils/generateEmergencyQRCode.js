// Imports
const QRCode = require('qrcode');

// =====================================================================================

// Main Function
async function generateEmergencyQRCode(token) {

    // Validate Frontend URL
    if (!process.env.FRONTEND_URL) {
        throw new Error('FRONTEND_URL is not configured');
    }

    // Generate Emergency URL
    const emergencyUrl = new URL(
        `/emergency/${token}`,
        process.env.FRONTEND_URL
    ).toString();

    // Generate QR Code
    const qrCode = await QRCode.toDataURL(emergencyUrl, {
        type: 'image/png',
        errorCorrectionLevel: 'H',
        width: 400,
        margin: 4,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    });

    // Return Emergency URL and QR Code
    return {
        emergency_url: emergencyUrl,
        qr_code: qrCode
    };
}

// =====================================================================================

// Export
module.exports = generateEmergencyQRCode;
