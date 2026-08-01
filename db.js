const {Pool} = require(`pg`);
require(`dotenv`).config();
const isProduction = process.env.NODE_ENV === `production`;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? {rejectUnauthorized: false} : false
});

const inicializarDB = async()=>{
    try{
        await pool.query(`CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL);`);

        await pool.query(`INSERT INTO usuarios (nombre, email, password) VALUES ('Admin','admin@gmail.com','admin123') ON CONFLICT (email) DO NOTHING;`);
        
        await pool.query(`CREATE TABLE IF NOT EXISTS productos (
            id SERIAL PRIMARY KEY),
            nombre VARCHAR(100) NOT NULL,
            codigo VARCHAR(50) NOT NULL,
            precio DECIMAL(10,2) NOT NULL,
            stock INT NOT NULL);`);
        
        console.log('Base de datos iniciada');
    }catch(error){
        console.error('Error al iniciar la base de datos', error);
    }

};
inicializarDB();

module.exports=pool;
