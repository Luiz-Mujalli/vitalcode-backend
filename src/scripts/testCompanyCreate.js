const database = require('../database/index');
const Company = require('../models/Company');
const { UniqueConstraintError } = require('sequelize');

async function createCompany() {
    try {
        await database.authenticate();

        const company = await Company.create({
            nome: 'Empresa Exemplo',
            cnpj: '12345678000145'
        });

        console.log('Empresa criada com sucesso!');
        console.log(company.toJSON());
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            console.error('CNPJ já cadastrado.');
        } else {
            console.error('Erro Inesperado: ', error);
        }

        process.exitCode = 1;
    } finally {
        await database.connection.close();
    }
}

createCompany();