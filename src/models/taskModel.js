import { randomUUID } from 'crypto';

let tasks = [];

export const getAllTasks = (query) => {
  if (query) {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  return tasks;
};

export const getTaskById = (id) => tasks.find((task) => task.id === id);

export const createTask = (title, description) => {
  const newTask = {
    id: randomUUID(),
    title,
    description,
    completed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id, fieldsToUpdate) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...fieldsToUpdate, updated_at: new Date() };
    return tasks[taskIndex];
  }
  return null;
};

export const deleteTask = (id) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    return true;
  }
  return false;
};

export const toggleCompleteTask = (id) => {
  const task = getTaskById(id);
  if (task) {
    task.completed_at = task.completed_at ? null : new Date();
    task.updated_at = new Date();
    return task;
  }
  return null;
};

export const importTasks = (newTasks) => {
  tasks = [...tasks, ...newTasks];
};
