import en from '@/locales/en.json';
import zh from '@/locales/zh.json';
import { useAuthStore } from '@/store/authStore';

const resources = { en, zh } as const;

type Languages = keyof typeof resources;

export function useTranslation() {
  const language = useAuthStore((s) => s.language) as Languages;
  const t = (key: string): string => {
    const dict = resources[language] || resources.en;
    return (dict as Record<string, string>)[key] || key;
  };
  return { t };
}
