import mongoose from 'mongoose';
import { 
  obtenerTodosLosSuperHeroes, 
  insertarSuperHeroes, 
  actualizarSuperHeroes, 
  borrarSuperHeroePorId 
} from '../services/SuperHeroService.mjs';
import { validationResult } from 'express-validator';
import superHeroRepository from '../repositories/SuperHeroRepository.mjs';
import SuperHero from '../models/SuperHero.mjs';

// Extrae ObjectId de mongoose
const { ObjectId } = mongoose.Types;

// Controlador para obtener todos los superhéroes (JSON)
export async function obtenerTodosLosSuperHeroesController(req, res) {
  try {
    const superheroes = await obtenerTodosLosSuperHeroes();
    res.json(superheroes);
  } catch (error) {
    console.error('Error al obtener superhéroes:', error);
    res.status(500).send('Error interno del servidor');
  }
}

// Controlador para el dashboard
export async function obtenerTodosLosSuperHeroesDashboardController(req, res) {
  try {
    const superheroes = await obtenerTodosLosSuperHeroes();
    res.render('dashboard', { superheroes });
  } catch (error) {
    console.error('Error al obtener superhéroes:', error);
    res.status(500).send('Error interno del servidor');
  }
}

// Controlador para insertar un superhéroe
export async function insertarSuperHeroesController(req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const superheroData = {
    nombreSuperHeroe: req.body.nombreSuperHeroe,
    nombreReal: req.body.nombreReal,
    edad: req.body.edad,
    planetaOrigen: req.body.planetaOrigen,
    debilidad: req.body.debilidad,
    poderes: req.body.poderes?.split(',').map(poder => poder.trim()) || [],
    aliados: req.body.aliados?.split(',').map(aliado => aliado.trim()) || [],
    enemigos: req.body.enemigos?.split(',').map(enemigo => enemigo.trim()) || [],
  };

  try {
    await insertarSuperHeroes(superheroData);
    req.flash('success_msg', 'Superhéroe creado exitosamente');
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Error en el controlador:", error.message);
    res.status(500).json({ error: "Error al insertar el superhéroe" });
  }
}

// Controlador para editar un superhéroe
export async function editarSuperHeroesController(req, res) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const { id } = req.params;
  const superheroeData = {
    ...req.body,
    poderes: req.body.poderes?.split(',').map(poder => poder.trim()) || [],
    aliados: req.body.aliados?.split(',').map(aliado => aliado.trim()) || [],
    enemigos: req.body.enemigos?.split(',').map(enemigo => enemigo.trim()) || []
  };

  try {
    const superheroe = await actualizarSuperHeroes(id, superheroeData);
    if (!superheroe) {
      return res.status(404).send({ error: 'Superhéroe no encontrado' });
    }
    req.flash('success_msg', 'Superhéroe actualizado exitosamente');
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Error en el controlador:", error.message);
    res.status(500).send({ error: "Error al actualizar el superhéroe" });
  }
}

// Controlador para borrar un superhéroe
export async function borrarSuperHeroePorIdController(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID no válido' });
  }

  try {
    const superheroe = await superHeroRepository.borrarPorId(id);
    if (!superheroe) {
      return res.status(404).json({ error: 'Superhéroe no encontrado' });
    }
    
    // Cambia esto para enviar un mensaje de éxito más explícito
    res.status(200).json({ 
      success: true, 
      message: 'Superhéroe eliminado exitosamente' 
    });
  } catch (error) {
    console.error("Error en el controlador:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Error al borrar el superhéroe" 
    });
  }
}

// Controlador para obtener un superhéroe por ID
export async function obtenerSuperHeroePorIdController(req, res) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send('ID no válido');
  }

  try {
    const superheroe = await SuperHero.findById(new ObjectId(id));
    if (!superheroe) {
      return res.status(404).send('Superhéroe no encontrado');
    }
    res.render('editSuperhero', { 
      title: 'Editar Superhéroe', 
      superheroe 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el superhéroe');
  }
}



