// Import - Método index
const listCompanyEmployeesService = require('../../services/employees/listCompanyEmployeesService');

// Import - Método show
const getCompanyEmployeeService = require('../../services/employees/getCompanyEmployeeService');

// Import - Método clinicalStatus
const getEmployeeClinicalStatusService = require(
    '../../services/clinicalProfile/getEmployeeClinicalStatusService'
);

// Import - Método deactivate
const deactivateEmployeeService = require(
    '../../services/employees/deactivateEmployeeService'
);

// ======================================================================================================

// Método index
exports.index = async (req, res) => {
    try {
        const search = req.query.search;

        if (
            search !== undefined &&
            (typeof search !== 'string' || search.trim().length > 100)
        ) {
            return res.status(400).json({
                error: 'Parâmetro de pesquisa inválido'
            })
        }

        const employees = await listCompanyEmployeesService(
            req.company.id,
            search?.trim() || ''
        );

        return res.status(200).json({
            employees
        });

    } catch (error) {
        console.error('Erro ao listar funcionários: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao listar funcionários'
        });
    }
};

// ======================================================================================================

// Método show
exports.show = async (req, res) => {
    const employeeId = Number(req.params.employeeId);

    if (!Number.isSafeInteger(employeeId) || employeeId <= 0) {
        return res.status(400).json({
            error: 'Identificador do funcionário inválido'
        });
    }

    try {
        const employee = await getCompanyEmployeeService(
            req.company.id,
            employeeId
        );

        if (!employee) {
            return res.status(404).json({
                error: 'Funcionário não encontrado nesta empresa'
            });
        }

        return res.status(200).json({
            employee
        });

    } catch (error) {
        console.error('Erro ao consultar funcionário: ', error.name);

        return res.status(500).json({
            error: 'Erro interno ao consultar funcionário'
        });
    }
};

// ======================================================================================================

// Método clinicalStatus
exports.clinicalStatus = async (req, res) => {
    try {
        const result = await getEmployeeClinicalStatusService({
            employeeId: req.params.employeeId,
            companyId: req.company.id
        });

        return res.status(200).json({
            data: result
        });

    } catch (error) {
        if ([400, 404].includes(error.statusCode)) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error(
            'Erro ao consultar status clínico:',
            error.name
        );

        return res.status(500).json({
            error: 'Erro interno ao consultar status clínico'
        });
    }
};


// =====================================================================================

// Método deactivate
exports.deactivate = async (req, res) => {

    const employeeId = Number(req.params.employeeId);

    if (
        !/^\d+$/.test(req.params.employeeId) ||
        !Number.isSafeInteger(employeeId) ||
        employeeId <= 0
    ) {
        return res.status(400).json({
            error: 'Identificador do funcionário inválido'
        });
    }

    try {
        const result = await deactivateEmployeeService({
            actorUserId: req.user.id,
            companyId: req.company.id,
            employeeId
        });

        return res.status(200).json({
            message: 'Funcionário desativado com sucesso',
            data: result
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                error: error.message
            });
        }

        console.error(
            'Erro ao desativar funcionário:',
            error.name
        );

        return res.status(500).json({
            error: 'Erro interno ao desativar funcionário'
        });
    }
};
