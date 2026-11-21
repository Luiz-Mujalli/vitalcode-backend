// Imports
const argon2 = require('argon2');

// =====================================================================================

// Export Function
exports.hashPassword = async (password) => {
    return await argon2.hash(password, {
        type: argon2.argon2id
    });
};

// =====================================================================================

// Export Function
exports.verifyPassword = async (hash, password) => {
    return await argon2.verify(hash, password);
};
