import { create } from 'zustand';

interface RestClientPageStore {
  requestMethod: string;
  requestUrl: string;
  requestBody: string;
  requestHeaders: RestClientHeader[];

  setRequestMethod: (method: string) => void;
  setRequestUrl: (url: string) => void;
  setRequestBody: (body: string) => void;
  addRequestHeader: (params: { name: string; value: string }) => void;
  updateRequestHeader: (params: { id: string; name?: string; value?: string }) => void;
  removeRequestHeader: (params: { id: string }) => void;
  clearRequestHeaders: () => void;
}

export interface RestClientHeader {
  id: string;
  name: string;
  value: string;
}

export const restClientPageStore = create<RestClientPageStore>((set) => ({
  requestMethod: '',
  requestUrl: '',
  requestBody: '',
  requestHeaders: [],

  setRequestMethod: (method: string) => {
    set({ requestMethod: method });
  },

  setRequestUrl: (url: string) => {
    set({ requestUrl: url });
  },

  setRequestBody: (body: string) => {
    set({ requestBody: body });
  },

  addRequestHeader: ({ name, value }) =>
    set((state) => ({
      requestHeaders: [
        ...state.requestHeaders,
        {
          id: crypto.randomUUID(),
          name,
          value,
        },
      ],
    })),

  updateRequestHeader: ({ id, name, value }) =>
    set((state) => {
      const headerIndex = state.requestHeaders.findIndex((h) => h.id === id);
      if (headerIndex === -1) {
        return state;
      }

      const requestHeaders = [...state.requestHeaders];
      const header = requestHeaders[headerIndex];
      requestHeaders[headerIndex] = { ...header, name: name ?? header.name, value: value ?? header.value };

      return {
        requestHeaders,
      };
    }),

  removeRequestHeader: ({ id }) => {
    set((state) => {
      return {
        requestHeaders: state.requestHeaders.filter((header) => header.id !== id),
      };
    });
  },

  clearRequestHeaders: () => {
    set(() => {
      return {
        requestHeaders: [],
      };
    });
  },
}));
