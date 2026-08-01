const db= require(`../db`);

exports.obtenerTodos= async(req,res)=>{
    try{
        const resultado=await db.query(`SELECT * FROM productos ORDER BY id ASC`);
        res.status(200).json(resultado.rows);
    }catch(error){
        res.status(500).json({error:`Error en el servidor`});
    }
};

exports.crear= async(req, res)=>{
    
    const{nombre, codigo, precio , stock} = req.body;
    
    if(!nombre || !codigo || !precio || !stock){
        return res.status(200).json({error:`Todos los campos son obligatorios`});
    }
    try{
        const consulta= `INSERT INTO productos (nombre, codigo, precio, stock) VALUES ($1,$2,$3,$4) RETURNING id`;

        const resultado= await db.query(consulta,[nombre, codigo, precio, stock]);
        res.status(201).json({mensaje:`Producto creado `, id:resultado.rows[0].id});
    }catch(error){
        res.status(500).json({error:`Error al crear el producto`});
    }
};

exports.actualizar= async(req,res)=>{
    const {id} =req.params;
    const {nombre, codigo, precio, stock} = req.body;

    try{
        const consulta = `UPDATE productos SET nombre=$1, codigo=$2, precio=$3, stock=$4 WHERE id=$5`;
        
        const resultado = await db.query(consulta,[nombre, codigo, precio, stock, id]); 

        if(resultado.rowCount===0){
            return res.status(404).json({error:`Producto no encontrado`});
        }
        res.status(200).json({mensaje:`Producto actualizado`});
    }catch(error){
        res.status(500).json({error:`Error al actualizar el producto`});
    }
};

exports.eliminar= async(req, res)=>{
    const {id} =req.params;
    try{
        const resultado = await db.query(`DELETE FROM productos WHERE id=$1`,[id]);
        if(resultado.rowCount ===0){
            return res.status(404).json({error:`Producto no encontrado`});
        }
        res.status(200).json({mensaje:`Producto eliminado`});
    }catch(error){
        res.status(500).json({error:`Error al eliminar el producto`});
    }
}