import http from 'http';
import { routes } from './routes/taskRoutes.js';

const server = http.createServer((req, res) => {
  routes(req, res);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});