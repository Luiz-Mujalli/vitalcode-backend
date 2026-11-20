const listCompanyEmployeesService = require('../services/listCompanyEmployeesService');
const getCompanyEmployeeService = require('../services/getCompanyEmployeeService');

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
        console.error('Erro ao listar funcionários: ', error);

        return res.status(500).json({
            error: 'Erro interno ao listar funcionários'
        });
    }
};

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
        console.error('Erro ao consultar funcionário: ', error);

        return res.status(500).json({
            error: 'Erro interno ao consultar funcionário'
        });
    }
};