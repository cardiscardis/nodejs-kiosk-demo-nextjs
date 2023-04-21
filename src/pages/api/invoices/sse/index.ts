import { NextApiRequest, NextApiResponse } from 'next';
import { sseService } from '@/services/sse';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Content-Encoding': 'none',
    'Cache-Control': 'no-cache, no-trasnform',
  };

  const clientId = uuidv4();
  const newClient = {
    id: clientId,
    res,
  };

  sseService.addClient(newClient);

  res.writeHead(200, headers);
  res.flushHeaders();
  res.on('close', () => {
    sseService.removeClient(clientId);
  });
}
