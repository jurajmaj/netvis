import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUrlStore = create(persist(
  (set) => ({
    url: '',
    setUrl: (url) => set({ url }),
  }),
  {
    name: 'url-storage',
  }
));

export default useUrlStore;
