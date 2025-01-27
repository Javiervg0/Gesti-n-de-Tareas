const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'task_manager'
};


let db;

mysql.createConnection(dbConfig)
  .then(connection => {
    db = connection;
    console.log('Conectado a la base de datos MySQL');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  });

app.get('/tasks', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM tasks');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

app.post('/tasks', async (req, res) => {
  const { title, description, category, due_date } = req.body;

  if (!title || !description || !category || !due_date) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const [results] = await db.query(
      'INSERT INTO tasks (title, description, category, due_date) VALUES (?, ?, ?, ?)',
      [title, description, category, due_date]
    );
    res.status(201).json({ id: results.insertId, title, description, category, due_date });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, category, due_date, completed } = req.body;

  if (!id || !title || !description || !category || !due_date) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const [results] = await db.query(
      'UPDATE tasks SET title = ?, description = ?, category = ?, due_date = ?, completed = ? WHERE id = ?',
      [title, description, category, due_date, completed, id]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea actualizada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Se requiere el ID de la tarea' });
  }

  try {
    const [results] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});