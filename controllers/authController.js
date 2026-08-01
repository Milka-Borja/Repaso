const db = require(`../db`);

exports.login=async(req, res) =>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: `Por favor ingrese email y contraseña`});
    }
    try{
        const consulta = `SELECT id, nombre, email FROM usuarios WHERE email =$1 AND password=$2`;
        const resultado = await db.query (consulta,[email,password]);
        if(resultado.rows.length ===0){
            return res.status(401).json({error:`Usuario o contraseña incorrectos`});
        }
        res.status(200).json({
            mensaje:`Inicio de sesion exitoso`,
            usuario: resultado.rows[0]
        });
    }catch(error){
        res.status(500).json({error:`Error en el servidor`});
    }
};