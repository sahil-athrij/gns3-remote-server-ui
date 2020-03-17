import { Server } from '../models/server';

export function getTestServer(): Server {
  const server = new Server();
  server.host = 'ec2-13-235-99-198.ap-south-1.compute.amazonaws.com';
  server.port = 443;
  server.authorization = 'none';
  return server;
}
