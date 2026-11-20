
const validateCNPJ = require('../validators/cnpjValidator');

const tests = [
    ['11.222.333/0001-81', true],
    ['11222333000181', true],
    ['12345678000145', false],
    ['11111111111111', false],
    ['11A22333000181', false],
    ['123456789', false],
    [null, false]
];

let failures = 0;

for (const [cnpj, expected] of tests) {
    const result = validateCNPJ(cnpj);
    const passed = result === expected;

    console.log(
        `${passed ? 'PASSOU' : 'FALHOU'} | ${String(cnpj)} | ${result}`
    );

    if (!passed) failures++;
}

if (failures > 0) {
    process.exitCode = 1;
}
