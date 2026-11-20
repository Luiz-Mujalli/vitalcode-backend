function validateCNPJ(cnpj) {
    // TYPEOF VERIFICATION
    if (typeof cnpj !== 'string') {
        return false;
    }

    // REMOVING PUNCTUATION
    const cleanedCNPJ = cnpj.replace(/[.\-/]/g, '');

    // DIGITS VERIFICATION
    if (!/^\d{14}$/.test(cleanedCNPJ)) {
        return false;
    }

    // SEQUENCE VERIFICATION
    if (/^(\d)\1{13}$/.test(cleanedCNPJ)) {
        return false;
    }

    // CONVERTING IN ARRAY
    const digits = cleanedCNPJ.split('').map(Number);

    // RESULT
    return verifyDigit(digits);
}

function verifyDigit(cnpj) {
    const d1 = cnpj[12];
    const d2 = cnpj[13];

    const firstTwelveDigits = cnpj.slice(0, 12);

    const firstDigit = calculateDigit(firstTwelveDigits);

    if (firstDigit !== d1) {
        return false;
    }

    const firstThirteenDigits = [...firstTwelveDigits, firstDigit];

    const secondDigit = calculateDigit(firstThirteenDigits);

    return secondDigit === d2;
}

function calculateDigit(digits) {
    let multiplier = 2;
    let sum = 0;

    for (let i = digits.length - 1; i >= 0; i--) {
        sum += digits[i] * multiplier;
        multiplier = multiplier === 9 ? 2 : multiplier + 1;
    }

    const remainder = sum % 11;

    return remainder < 2 ? 0 : 11 - remainder;
}

module.exports = validateCNPJ;
