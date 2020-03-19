import { Server } from '../models/server';

export function getTestServer(): Server {
  const server = new Server();
  server.host = 'ec2-13-233-160-96.ap-south-1.compute.amazonaws.com';
  server.port = 3081;
  server.authorization = 'none';
  return server;
}
