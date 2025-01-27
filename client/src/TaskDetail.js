import React from 'react';

const TaskDetail = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{task.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p><strong>Descripción:</strong> {task.description}</p>
            <p><strong>Categoría:</strong> {task.category}</p>
            <p><strong>Fecha límite:</strong> {task.due_date}</p>
            <p><strong>Estado:</strong> {task.completed ? 'Completada' : 'Pendiente'}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;