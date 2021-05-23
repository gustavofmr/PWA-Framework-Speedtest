import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React, { useContext, useEffect } from 'react';
import { ApiClientContext, ApiClientProvider } from './context';

const ContextConsumer = () => {
  const { client, setAccessToken, setViasatId, token, viasatId } = useContext(
    ApiClientContext
  );
  useEffect(() => {
    setAccessToken('tok');
    setViasatId('vId');
  }, []);
  return (
    <ul>
      <li>Api url: {client.getApiUrl()}</li>
      <li>Header: {client.getAuthorizationHeader().get('Authorization')}</li>
      <li>Token: {token}</li>
      <li>Viasat id: {viasatId}</li>
    </ul>
  );
};

describe('Client context', () => {
  it('should expose API client', () => {
    render(
      <ApiClientProvider apiUrl="test-url">
        <ContextConsumer />
      </ApiClientProvider>
    );
    expect(screen.getByText(/^Api url:/)).toHaveTextContent(
      'Api url: test-url'
    );
    expect(screen.getByText(/^Header:/)).toHaveTextContent(
      'Header: Bearer tok'
    );
  });

  it('should set and expose token', () => {
    render(
      <ApiClientProvider apiUrl="test-url">
        <ContextConsumer />
      </ApiClientProvider>
    );
    expect(screen.getByText(/^Token:/)).toHaveTextContent('Token: tok');
  });

  it('should set and expose viasat Id', () => {
    render(
      <ApiClientProvider apiUrl="test-url">
        <ContextConsumer />
      </ApiClientProvider>
    );
    expect(screen.getByText(/^Viasat id:/)).toHaveTextContent('Viasat id: vId');
  });

  it('should return default context value when not provided', () => {
    render(<ContextConsumer />);
    expect(screen.getByText(/^Api url:/)).toHaveTextContent('Api url:');
    expect(screen.getByText(/^Token:/)).toHaveTextContent('Token:');
    expect(screen.getByText(/^Header:/)).toHaveTextContent('Header:');
    expect(screen.getByText(/^Viasat id:/)).toHaveTextContent('Viasat id:');
  });
});
