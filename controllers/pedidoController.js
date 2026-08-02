const db= require(`../db`);

exports.pedido = async(req,res)=>{
    const{usuario_id, producto_id, cantidad}=req.body;
    if(!usuario_id || !producto_id || !cantidad || cantidad<=0){
        return res.status(400).json({error: `Todos los campos son obligatorios`});
    }
    try{
        const productoResult = await db.query(`SELECT * FROM productos WHERE id=$1`, [producto_id]);

        if (productoResult.rows.length===0){
            return res.status(404).json({error:`El producto solicitado no existe`});
        }
        const producto=productoResult.rows[0];

        if(producto.stock < cantidad){
            return res.status(400).json({error:`Stock insuficiente`});
        }

        const total=producto.precio * cantidad;

        const insertPedidoQuery=`INSERT INTO pedidos (usuario_id, producto_id, cantidad, total) VALUES ($1,$2,$3,$4) RETURNING *`;

        const nuevoPedido= await db.query(insertPedidoQuery,[usuario_id,producto_id,cantidad,total]);

        const nuevoStock= producto.stock - cantidad;
        await db.query(`UPDATE productos SET stock = $1 WHERE id=$2`, [nuevoStock, producto_id]);

        res.status(201).json({mensaje: "Compra realizada", compra: nuevoPedido.rows[0]});
    }catch (error){
        console.error(error);
        res.status(500).json({error: `error al realizar la compra en el servidor`});
    }
};

exports.obtenerHistorial = async(req, res)=>{
    try{
        const consulta=`
        SELECT
            p.id AS pedido_id,
            u.nombre AS comprador,
            pr.nombre AS producto,
            p.cantidad,
            p.total,
            p.fecha
        FROM pedidos p
        INNER JOIN usuarios u ON p.usuario_id = u.id
        INNER JOIN productos pr ON p.producto_id = pr.id
        ORDER BY p.fecha DESC
        `;
        const resultado = await db.query (consulta);
        res.status(200).json(resultado.rows);
    }catch (error){
        res.status(500).json({error:`Error al obtener el historial`});

    }

}