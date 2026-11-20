const Company = require('../models/Company');
const CompanyMembership = require('../models/CompanyMembership');

function authorizeCompany(allowedRoles = []) {
    if (!Array.isArray(allowedRoles) || !allowedRoles.every(role => typeof role === 'string')) {
        throw new TypeError(
            'allowedRoles deve ser um array de strings'
        );
    }

    return async (req, res, next) => {
        const companyId = Number(req.params.companyId);

        if (!Number.isSafeInteger(companyId) || companyId <= 0) {
            return res.status(400).json({
                error: 'Identificador da empresa inválido.'
            });
        }

        try {
            const membership = await CompanyMembership.findOne({
                where: {
                    user_id: req.user.id,
                    company_id: companyId,
                    status: 'active'
                },
                include: [{
                    model: Company,
                    as: 'company',
                    where: { status: 'active' },
                    required: true
                }]
            });

            if (!membership) {
                return res.status(403).json({
                    error: 'Acesso não permitido a esta empresa'
                });
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role)) {
                return res.status(403).json({
                    error: 'Permissão insuficiente'
                });
            }

            req.company = {
                id: membership.company_id,
                name: membership.company.nome,
                membership_id: membership.id,
                role: membership.role
            };

            return next();

        } catch (error) {
            console.error('Erro na autorização da empresa: ', error);

            return res.status(500).json({
                error: 'Erro interno de autorização'
            });
        }
    };
}

module.exports = authorizeCompany;