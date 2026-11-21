// Config
require('dotenv').config();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET não configurado adequadamente');
}

// =====================================================================================

// Imports
const app = require('./app');
const database = require('./database/index');

// =====================================================================================

// PORT
const PORT = process.env.PORT || 3000;

// =====================================================================================

// Main Function
async function startServer() {
    try {
        await database.authenticate();

        console.log('Servidor conectado ao banco de dados com sucesso.');

        app.listen(PORT, () => {
            console.log('Servidor Rodando.');
            console.log(`http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error('Erro ao iniciar a aplicação: ', e);
        process.exit(1);
    }
};

// =====================================================================================

// Executing Function
startServer();
