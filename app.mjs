import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import { fileURLToPath } from 'url';
import { connectDB } from './src/config/dbConfig.mjs';
import router from './src/routes/superHeroRoutes.mjs';
import { obtenerTodosLosSuperHeroesDashboardController } from './src/controllers/superheroesController.mjs'; // dashboard
import flash from 'connect-flash';
import session from 'express-session';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views')); 
app.use(express.static(path.join(__dirname, 'src', 'public'))); 
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Solicitud: ${req.method} ${req.url}`);
  next();
});

// Configuración de sesión
app.use(session({
  secret: 'aL0ngAndC0mpl3xStr1ng!@#$', // Cambia esto por un secreto real
  resave: false,
  saveUninitialized: true
}));

// Inicializa flash
app.use(flash());

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Conexión a la base de datos
connectDB().catch(err => {
  console.error('Error al conectar a la base de datos:', err);
  process.exit(1);
});

// rutas de superhéroes
app.use('/api', router);

// Ruta para obtener todos los superhéroes en el dashboard
app.get('/dashboard', obtenerTodosLosSuperHeroesDashboardController);

app.get('/addSuperhero', (req, res) => {
  res.render('addSuperhero'); // Renderiza la vista addSuperhero.ejs
});



// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send({ mensaje: 'ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
});