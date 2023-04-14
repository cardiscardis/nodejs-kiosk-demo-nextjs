import { NextApiResponse } from 'next';

class SSEService {
  clients: { id: string; res: NextApiResponse }[] = [];

  constructor() {}

  addClient(newClient: { id: string; res: NextApiResponse }) {
    this.clients.push(newClient);
  }

  removeClient(clientId: string) {
    this.clients = this.clients.filter((client) => client.id !== clientId);
  }

  sendEvents(data: any) {
    this.clients.forEach((client) => {
      client.res.write(`id: ${client.id} \n`);
      client.res.write(`data: ${JSON.stringify(data)} \n\n`);
      client.res.flushHeaders();
    });
  }
}

export const sseService = new SSEService();
