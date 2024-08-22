import EventEmitter from 'events';

class SSEService {
  private emitter = new EventEmitter();

  constructor() {}

  public subscribe(callback: (message: any) => void): void {
    this.emitter.once('message', callback);
  }

  public unsubscribe(callback: (message: any) => void): void {
    this.emitter.off('message', callback);
  }

  public addEvent(message: any): void {
    this.emitter.emit('message', message);
  }
}

export const sseService = new SSEService();
