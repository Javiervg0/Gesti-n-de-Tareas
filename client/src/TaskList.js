import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskDetail from './TaskDetail';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores

  // Obtener las tareas al cargar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  // Función para obtener las tareas
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Error al obtener las tareas. Por favor, inténtalo más tarde.');
      console.error('Error al obtener las tareas:', error);
    }
  };

  // Función para eliminar una tarea
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id)); // Actualiza el estado sin necesidad de fetch
    } catch (error) {
      setError('Error al eliminar la tarea. Por favor, inténtalo de nuevo.');
      console.error('Error al eliminar la tarea:', error);
    }
  };

  // Función para editar una tarea
  const handleEdit = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed }; // Cambia el estado de completado
      await axios.put(`http://localhost:5000/tasks/${task.id}`, updatedTask);
      setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t))); // Actualiza directamente el estado
    } catch (error) {
      setError('Error al editar la tarea. Por favor, inténtalo de nuevo.');
      console.error('Error al editar la tarea:', error);
    }
  };

  // Función para ver los detalles de una tarea
  const handleViewDetails = (task) => {
    setSelectedTask(task);
  };

  // Función para cerrar el modal de detalles
  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Tareas</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <li key={task.id} className="list-group-item">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Categoría:</strong> {task.category}</p>
              <p><strong>Fecha límite:</strong> {task.due_date}</p>
              <p><strong>Estado:</strong> {task.completed ? '✅ Completada' : '❌ Pendiente'}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleViewDetails(task)}
              >
                Ver detalles
              </button>
              <button
                className="btn btn-warning me-2"
                onClick={() => handleEdit(task)}
              >
                Cambiar estado
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(task.id)}
              >
                Eliminar
              </button>
            </li>
          ))
        ) : (
          <li className="list-group-item">No hay tareas disponibles.</li>
        )}
      </ul>

      {selectedTask && <TaskDetail task={selectedTask} onClose={handleCloseDetails} />}
    </div>
  );
};

export default TaskList;
