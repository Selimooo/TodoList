import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Récupérer les tâches depuis le backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/api/tasks');
    setTasks(response.data);
  };

  // Ajouter une tâche
  const addTask = async () => {
    if (newTask.trim() === '') return;
    const response = await axios.post('http://localhost:5000/api/tasks', { text: newTask });
    setTasks([...tasks, response.data]);
    setNewTask('');
  };

  // Supprimer une tâche
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
  };

  // Basculer l'état "complété" d'une tâche
  const toggleTaskCompletion = async (id) => {
    const response = await axios.patch(`http://localhost:5000/api/tasks/${id}`);
    setTasks(tasks.map(task =>
      task._id === id ? response.data : task
    ));
  };

  return (
    <div className="task-list">
      <h1>To-Do List</h1>
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleTaskCompletion(task._id)}>
              {task.text}
            </span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;