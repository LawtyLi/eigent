import { http, httpStream } from './http';

export interface Chat {
  [key: string]: any;
}

export const chatService = {
  async startChat(options: Chat, onChunk: (step: string, data: any) => void) {
    await httpStream(
      '/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      },
      (event) => {
        const { step, data } = event;
        onChunk(step, data);
      },
    );
  },

  async getChat(id: string) {
    return 'TODO';
  },

  async startTask(id: string) {
    return 'TODO';
  },

  async validateModel(data: any) {
    return 'TODO';
  },
};
