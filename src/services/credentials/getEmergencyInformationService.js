// Imports
const { Op } = require('sequelize');

const User = require('../../models/User');
const Company = require('../../models/Company');
const CompanyMembership = require('../../models/CompanyMembership');
const ClinicalProfile = require('../../models/ClinicalProfile');
const EmergencyCredential = require('../../models/EmergencyCredential');
const AuditLog = require('../../models/AuditLog');

const isClinicalProfileComplete = require(
    '../../utils/isClinicalProfileComplete'
);

const {
    hashEmergencyToken
} = require('../../utils/emergencyToken');

// =====================================================================================

// Error Treatment Function
function unavailableCredential() {
    const error = new Error(
        'Credencial emergencial indisponível'
    );

    error.statusCode = 404;

    throw error;
}

// =====================================================================================

// Main Function
async function getEmergencyInformationService({ token }) {

    // Hash Emergency Token
    const tokenHash = hashEmergencyToken(token);

    // Find Emergency Credential
    const credential = await EmergencyCredential.findOne({
        where: {
            token_hash: tokenHash,
            status: 'active'
        },

        attributes: [
            'id',
            'membership_id',
            'status'
        ],

        include: [
            {
                model: CompanyMembership,
                as: 'membership',
                required: true,

                where: {
                    status: 'active',
                    role: {
                        [Op.in]: ['admin', 'employee']
                    }
                },

                attributes: [
                    'id',
                    'user_id',
                    'company_id',
                    'cargo'
                ],

                include: [
                    {
                        model: Company,
                        as: 'company',
                        required: true,

                        where: {
                            status: 'active'
                        },

                        attributes: [
                            'id',
                            'nome'
                        ]
                    },
                    {
                        model: User,
                        as: 'user',
                        required: true,

                        where: {
                            status: 'active'
                        },

                        attributes: [
                            'id',
                            'nome',
                            'sobrenome',
                            'data_nascimento'
                        ],

                        include: [
                            {
                                model: ClinicalProfile,
                                as: 'clinicalProfile',
                                required: true,

                                attributes: [
                                    'tipo_sanguineo',
                                    'alergias',
                                    'medicamentos',
                                    'doencas',
                                    'cirurgias',
                                    'contato_emergencia_nome',
                                    'contato_emergencia_telefone'
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    // Validate Emergency Credential
    if (!credential) {
        unavailableCredential();
    }

    // Get Related Information
    const membership = credential.membership;
    const company = membership.company;
    const user = membership.user;
    const profile = user.clinicalProfile;

    // Validate Clinical Profile
    if (!isClinicalProfileComplete(profile)) {
        unavailableCredential();
    }

    // Register Audit Log
    await AuditLog.create({
        company_id: company.id,
        actor_user_id: null,
        target_user_id: user.id,
        action: 'credential.accessed',
        resource_type: 'emergency_credential',
        resource_id: String(credential.id)
    });

    // Return Emergency Information
    return {
        employee: {
            nome: user.nome,
            sobrenome: user.sobrenome,
            data_nascimento: user.data_nascimento,
            cargo: membership.cargo
        },

        company: {
            nome: company.nome
        },

        clinical_profile: {
            tipo_sanguineo: profile.tipo_sanguineo,
            alergias: profile.alergias,
            medicamentos: profile.medicamentos,
            doencas: profile.doencas,
            cirurgias: profile.cirurgias
        },

        emergency_contact: {
            nome: profile.contato_emergencia_nome,
            telefone: profile.contato_emergencia_telefone
        }
    };
}

// =====================================================================================

// Export
module.exports = getEmergencyInformationService;
