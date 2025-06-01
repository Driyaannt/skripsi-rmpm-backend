/**
 * Usage example:
 * 
 * npm run models-dev -- --db=digimond table1 table2
 * 
 * db: Select from available database configurations (e.g., digimond, php_ms_login, aiopms)
 * table1 table2: Optional list of specific tables to generate models for
 */

const path = require("path");
const SequelizeAuto = require('sequelize-auto');
const dotenv = require("dotenv");

// Function to convert names to camelCase
const toCamelCaseName = (str) => {
  return str
    .toLowerCase()
    .replace(/_(.)/g, (_, match) => match.toUpperCase());
};

// Parse command-line arguments
const args = process.argv.slice(2);
const dbArg = args.find(arg => arg.startsWith('--db='))?.split('=')[1] || 'db_rmpm'; // Default to 'DIGIMOND'
const envArg = args.find(arg => arg.startsWith('--env='))?.split('=')[1] || '../env/.env.dev'; // Default to '../env/.env.dev'
const tables = args.filter(arg => !arg.startsWith('--db=') && !arg.startsWith('--env='));
const tablesToGenerate = tables.length > 0 ? tables : undefined; // Default set to undefined to generate all table

// Load environment variables from the specified .env file
dotenv.config({ path: path.join(__dirname, envArg) });

// Function to get database configuration based on the environment
const getDbConfig = (env) => {
  const config = {
    db_rmpm: {
      name: process.env.MYSQL_RMPM_NAME,
      user: process.env.MYSQL_RMPM_USER,
      pass: process.env.MYSQL_RMPM_PASS,
      host: process.env.MYSQL_RMPM_HOST,
      port: process.env.MYSQL_RMPM_PORT,
      dialect: process.env.MYSQL_RMPM_DIALECT
    },
    db_ahp: {
      name: process.env.MYSQL_AHP_NAME,
      user: process.env.MYSQL_AHP_USER,
      pass: process.env.MYSQL_AHP_PASS,
      host: process.env.MYSQL_AHP_HOST,
      port: process.env.MYSQL_AHP_PORT,
      dialect: process.env.MYSQL_AHP_DIALECT
    },
  };

  return config[env] || config.MYSQL; // Default to MYSQL if env is not found
};

// Get database configuration based on the environment
const dbConfig = getDbConfig(dbArg);

// Initialize SequelizeAuto
const auto = new SequelizeAuto(
  dbConfig.name,  // Database name
  dbConfig.user,  // User
  dbConfig.pass,  // Password
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    directory: path.join(__dirname, '../src/models/', toCamelCaseName(dbConfig.name)), // Specify the models directory
    port: dbConfig.port,
    caseModel: 'c', 
    caseFile: 'c', 
    singularize: false,
    additional: {
      timestamps: false // Disable timestamps
    },
    noInitModels: true, // Don't initialize models
    tables: tablesToGenerate // Specify tables to generate models for
  }
);

// Run SequelizeAuto and handle results
auto.run().then(data => {
  // Uncomment to debug
  console.log('Models generated successfully!');
});