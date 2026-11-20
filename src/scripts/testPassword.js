const { hashPassword, verifyPassword } = require('../services/passwordService');

// PASSWORDS
const correctPassword = 'TestandoUmaSenhaVálida123!';
const wrongPassword = 'testandoumasenhaerrada';

async function testPassword() {
    try {
        // HASHES
        const hashPassword1 = await hashPassword(correctPassword);
        const hashPassword2 = await hashPassword(correctPassword);

        // TESTS
        const correctResult = await verifyPassword(hashPassword1, correctPassword);
        const wrongResult = await verifyPassword(hashPassword1, wrongPassword);

        // RESULTS
        console.log('Senha Correta: ', correctResult);
        console.log('Senha Incorreta: ', wrongResult);
        console.log('Hashes Diferentes: ', hashPassword1 !== hashPassword2);
    } catch (e) {
        // ERRORS
        console.error('Erro ao verificar senhas: ', e);
        process.exitCode = 1;
    }
}

testPassword();