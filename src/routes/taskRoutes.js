import {
    getTasks,
    createNewTask,
    updateTaskById,
    deleteTaskById,
    completeTaskById,
    importTasksFromCSV,
  } from '../controllers/taskController.js';
  
  export const routes = (req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/tasks')) return getTasks(req, res);
    if (req.method === 'POST' && req.url === '/tasks') return createNewTask(req, res);
    if (req.method === 'PUT' && req.url.match(/^\/tasks\/\w+/)) return updateTaskById(req, res);
    if (req.method === 'DELETE' && req.url.match(/^\/tasks\/\w+/)) return deleteTaskById(req, res);
    if (req.method === 'PATCH' && req.url.match(/^\/tasks\/\w+\/complete/)) return completeTaskById(req, res);
    if (req.method === 'POST' && req.url.startsWith('/tasks/import-csv')) return importTasksFromCSV(req, res);
  
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found.' }));
  };
  