// Imports - Método myCompanies
const listMyCompaniesService = require('../../services/companies/listMyCompaniesService');

// Imports - Método register
const { UniqueConstraintError } = require('sequelize');
const registerCompanySchema = require('../../validators/companies/registerCompanySchema');
const registerCompanyService = require('../../services/companies/registerCompanyService');

// ======================================================================================================

// Método myCompanies
exports.myCompanies = async (req, res) => {
    try {
        const companies = await listMyCompaniesService(req.user.id);

        return res.status(200).json({ companies });

    } catch (error) {
        console.error('Erro ao procurar empresas:', error.name);

        return res.status(500).json({
            error: 'Erro ao encontrar empresas'
        });
    }
};

// ======================================================================================================

// Método register
exports.register = async (req, res) => {
    const validation = registerCompanySchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            error: 'Dados de cadastro inválidos',
            details: validation.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const result = await registerCompanyService(validation.data);

        return res.status(201).json({
            message: 'Empresa cadastrada com sucesso',
            data: result
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({
                error: 'CNPJ ou e-mail já cadastrado'
            });
        }

        console.error('Erro ao cadastrar empresa:', error.name);

        return res.status(500).json({
            error: 'Erro interno ao cadastrar empresa'
        });
    }
};
