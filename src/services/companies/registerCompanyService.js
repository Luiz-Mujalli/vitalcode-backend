const database = require('../../database');
const Company = require('../../models/Company');
const User = require('../../models/User');
const CompanyMembership = require('../../models/CompanyMembership');
const { hashPassword } = require('../auth/passwordService');

async function registerCompanyService(data) {
    const { company, admin } = data;

    const passwordHash = await hashPassword(admin.password);

    const result = await database.connection.transaction(async (transaction) => {

        const newCompany = await Company.create(
            {
                nome: company.nome,
                cnpj: company.cnpj,
                status: 'active'
            },
            { transaction }
        );

        const newUser = await User.create(
            {
                nome: admin.nome,
                sobrenome: admin.sobrenome,
                data_nascimento: admin.data_nascimento,
                email: admin.email,
                password_hash: passwordHash,
                status: 'active'
            },
            { transaction }
        );

        const membership = await CompanyMembership.create(
            {
                company_id: newCompany.id,
                user_id: newUser.id,
                role: 'admin',
                status: 'active'
            },
            { transaction }
        );

        return {
            company: {
                id: newCompany.id,
                nome: newCompany.nome,
                cnpj: newCompany.cnpj,
                status: newCompany.status
            },
            admin: {
                id: newUser.id,
                nome: newUser.nome,
                sobrenome: newUser.sobrenome,
                email: newUser.email
            },
            membership: {
                id: membership.id,
                role: membership.role,
                status: membership.status
            }
        };
    });

    return result;
}

module.exports = registerCompanyService;
