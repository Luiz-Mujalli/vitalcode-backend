const { Op } = require('sequelize');

const CompanyMembership = require("../models/CompanyMembership")
const User = require('../models/User');

async function listCompanyEmployeesService(companyId, search = '') {
    const userWhere = {};

    if (search) {
        userWhere[Op.or] = [
            {
                nome: {
                    [Op.like]: `%${search}%`
                }
            },
            {
                sobrenome: {
                    [Op.like]: `%${search}%`
                }
            }
        ];
    }

    const memberships = await CompanyMembership.findAll({
        where: {
            company_id: companyId
        },
        attributes: [
            'id',
            'cargo',
            'role',
            'status'
        ],
        include: [{
            model: User,
            as: 'user',
            attributes: [
                'id',
                'nome',
                'sobrenome',
                'email',
                'status'
            ],
            where: userWhere,
            required: true
        }],
        order: [['id', 'ASC']]
    });

    return memberships.map(membership => ({
        membership_id: membership.id,
        cargo: membership.cargo,
        role: membership.role,
        membership_status: membership.status,
        user: {
            id: membership.user.id,
            nome: membership.user.nome,
            sobrenome: membership.user.sobrenome,
            email: membership.user.email,
            status: membership.user.status
        }
    }));
}

module.exports = listCompanyEmployeesService;