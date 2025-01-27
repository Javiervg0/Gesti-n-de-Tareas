import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ fetchTasks = () => {} }) => { // Valor por defecto para fetchTasks
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null); // Estado para errores

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { title, description, category, due_date: dueDate };

    try {
      await axios.post('http://localhost:5000/tasks', newTask);
      alert('Tarea creada exitosamente');
      setTitle('');
      setDescription('');
      setCategory('');
      setDueDate('');
      fetchTasks(); // Actualizar la lista de tareas
      setError(null); // Limpiar errores previos
    } catch (err) {
      console.error('Error al crear la tarea:', err);
      setError('Hubo un error al crear la tarea. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Tarea</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Categoría"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">Agregar</button>
      </form>
    </div>
  );
};

export default TaskForm;
