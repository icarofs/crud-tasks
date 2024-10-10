import { parse } from 'csv-parse';
import fs from 'fs';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleCompleteTask,
  importTasks,
} from '../models/taskModel.js';

export const getTasks = (req, res) => {
  const query = req.url.split('?')[1]?.split('=')[1];
  const tasks = getAllTasks(query);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(tasks));
};

export const createNewTask = (req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    const { title, description } = JSON.parse(body);
    if (!title || !description) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Title and description are required.' }));
    }
    const newTask = createTask(title, description);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newTask));
  });
};

export const updateTaskById = (req, res) => {
  const id = req.url.split('/')[2];
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    const fieldsToUpdate = JSON.parse(body);
    const updatedTask = updateTask(id, fieldsToUpdate);
    if (!updatedTask) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Task not found.' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedTask));
  });
};

export const deleteTaskById = (req, res) => {
  const id = req.url.split('/')[2];
  const deleted = deleteTask(id);
  if (!deleted) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Task not found.' }));
  }
  res.writeHead(204);
  res.end();
};

export const completeTaskById = (req, res) => {
  const id = req.url.split('/')[2];
  const task = toggleCompleteTask(id);
  if (!task) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Task not found.' }));
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(task));
};

export const importTasksFromCSV = (req, res) => {
  const csvFilePath = req.url.split('=')[1];
  const records = [];
  fs.createReadStream(csvFilePath)
    .pipe(parse({ columns: true }))
    .on('data', (row) => {
      records.push({
        id: row.id || randomUUID(),
        title: row.title,
        description: row.description,
        completed_at: row.completed_at ? new Date(row.completed_at) : null,
        created_at: row.created_at ? new Date(row.created_at) : new Date(),
        updated_at: row.updated_at ? new Date(row.updated_at) : new Date(),
      });
    })
    .on('end', () => {
      importTasks(records);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Tasks imported successfully!' }));
    })
    .on('error', (error) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `Error importing tasks: ${error.message}` }));
    });
};
