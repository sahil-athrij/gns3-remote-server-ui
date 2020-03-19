import { Server } from '../models/server';

export function getTestServer(): Server {
  const server = new Server();
  server.host = 'icsaa.in';
  server.port = 3081;
  server.authorization = 'none';
  return server;
}
