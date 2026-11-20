const { UniqueConstraintError } = require('sequelize');

const registerCompanySchema = require('../validators/registerCompanySchema');
const registerCompanyService = require('../services/registerCompanyService');
const listMyCompaniesService = require('../services/listMyCompaniesService');

exports.myCompanies = async (req, res) => {
    try {
        const companies = await listMyCompaniesService(req.user.id);

        return res.status(200).json({ companies });

    } catch (error) {
        console.error('Erro ao procurar empresas:', error);

        return res.status(500).json({
            error: 'Erro ao encontrar empresas'
        });
    }
};

exports.register = async (req, res) => {
    // DATA VALIDATION
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
        // 2. EXECUTE REGISTER
        const result = await registerCompanyService(validation.data);

        return res.status(201).json({
            message: 'Empresa cadastrada com sucesso',
            data: result
        });
    } catch (error) {
        // UNIQUE ERROR TREATMENT
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({
                error: 'CNPJ ou e-mail já cadastrado'
            });
        }

        // UNEXPECTED ERROR TREATMENT
        console.error('Erro ao cadastrar empresa:', error);

        return res.status(500).json({
            error: 'Erro interno ao cadastrar empresa'
        });
    }
};
