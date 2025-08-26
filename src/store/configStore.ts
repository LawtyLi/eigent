import { create } from 'zustand';

export interface ChatConfig {
  email: string;
  api_key: string;
  model_platform: string;
  model_type: string;
}

interface ConfigState {
  config: ChatConfig;
  taskId: string;
  setConfig: (partial: Partial<ChatConfig>) => void;
  setTaskId: (id: string) => void;
  load: () => void;
}

const initial: ChatConfig = {
  email: '',
  api_key: '',
  model_platform: '',
  model_type: '',
};

export const useConfigStore = create<ConfigState>((set) => ({
  config: initial,
  taskId: '',
  setConfig: (partial) =>
    set((state) => {
      const next = { ...state.config, ...partial };
      localStorage.setItem('chat_config', JSON.stringify(next));
      return { config: next };
    }),
  setTaskId: (id) => set({ taskId: id }),
  load: () => {
    const raw = localStorage.getItem('chat_config');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        set({ config: { ...initial, ...parsed } });
      } catch {
        /* ignore */
      }
    }
  },
}));

