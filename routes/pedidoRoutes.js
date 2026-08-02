const express= require(`express`);
const router = express.Router();
const pedidoController = require(`../controller/pedidoController`);

router.post(`/pedido`, pedidoController.pedido);
router.get(`/historial`,pedidoController.obtenerHistorial);

module.exports= router;
