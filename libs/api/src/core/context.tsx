import * as React from 'react';
import { Client } from './client';

type ApiClientContextType = {
  setAccessToken: (token: string) => void;
  setViasatId: (id: string) => void;
  token: string;
  viasatId: string;
  client: Client;
};

export const ApiClientContext = React.createContext<ApiClientContextType>({
  setAccessToken: () => undefined,
  setViasatId: () => undefined,
  token: '',
  viasatId: '',
  client: new Client({
    apiUrl: '',
    getAuthorizationHeader: () => {
      return new Headers();
    },
  }),
});

export const ApiClientProvider: React.FC<{ apiUrl: string }> = (props) => {
  const [token, setToken] = React.useState('');
  const [id, setId] = React.useState('');

  const API_URL = props.apiUrl;

  const getHeaders = () => {
    const header = new Headers();

    if (token) {
      header.append('Authorization', `Bearer ${token}`);
    }
    return header;
  };

  const setAccessToken = (token: string) => {
    setToken(token);
  };

  const setViasatId = (id: string) => {
    setId(id);
  };

  const client = new Client({
    apiUrl: API_URL,
    getAuthorizationHeader: getHeaders,
  });

  return (
    <ApiClientContext.Provider
      value={{
        setAccessToken,
        token,
        client,
        setViasatId,
        viasatId: id,
      }}
    >
      {props.children}
    </ApiClientContext.Provider>
  );
};
