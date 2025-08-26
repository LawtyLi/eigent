import { http, httpStream, uploadFile } from './http';

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

  async uploadAttachment(file: File, taskId: string) {
    return uploadFile('/chat/files/upload', file, taskId);
  },

  async supplement(id: string, question: string) {
    await http(`/chat/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
  },

  async takeControl(id: string, action: 'pause' | 'resume') {
    await http(`/task/${id}/take-control`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
  },

  async humanReply(id: string, agent: string, reply: string) {
    await http(`/chat/${id}/human-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, reply }),
    });
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

