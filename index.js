const express= require(`express`);
const cors= require(`cors`);
require(`dotenv`).config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(`/api/auth`,require(`./routes/authRoutes`));
app.use(`/api/productos`,require(`./routes/productoRoutes`));

const PORT =process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Servidor activo en: http://localhost:${PORT}`);
}); 