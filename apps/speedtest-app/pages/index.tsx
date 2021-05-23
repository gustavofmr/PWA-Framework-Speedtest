import { Speedtest } from '@vst/speedtest';
import React from 'react';

export const Index = () => {
  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          background-color: #f2f5f8;
          font-family: 'Source Sans Pro';
        }

        h1 {
          color: #0aa5ab;
        }

        h2 {
          color: #016ead;
        }

        h3,
        h4,
        h5 {
          color: #016ead;
          font-size: 21px;
          margin: 14px 0;
        }

        p {
          font-size: 19px;
        }

        pre {
          background-color: #202e39;
          opacity: 0.8;
          padding: 8px 12px 10px;
          color: #f2f5f8;
          border-radius: 8px;
          font-size: 16px;
        }

        main {
          margin: 0 auto;
          max-width: 800px;
        }

        details {
          font-size: 21px;
          color: #202e39;
        }

        .preview {
          border: 2px solid #0aa5ab;
          border-radius: 8px;
          padding: 20px;
          margin: 6px 0 12px;
          background-color: white;
        }
      `}</style>
      <main>
        <h1>Welcome in speedtest-app</h1>
        <h2>App</h2>
        <p>Your app is available in "apps/speedtest-app" directory.</p>
        <p>
          App is based on <a href="https://nextjs.org/">Next.js</a>. If you are
          not familiar with the framework head out to{' '}
          <a href="https://nextjs.org/docs/basic-features/pages">docs</a>.
        </p>
        <h2>PWA Framework</h2>
        <p>
          Small, single responsibility libraries are the core of the framework.
          Try to encapsulate speedtest functionality into easy to use React
          component that can be placed in any React application.
        </p>
        <Speedtest />
        <h2>Commands</h2>
        <p>
          <a href="https://nx.dev">Nx</a> unifies commands in repository. For
          every application/library use the same commands.
        </p>
        <p>
          Start - development: <pre>nx serve speedtest-app</pre>
        </p>
        <p>
          Unit tests: <pre>nx test speedtest-app</pre>
        </p>
        <p>
          E2E tests: <pre>nx e2e speedtest-app-e2e [--watch]</pre>
        </p>
      </main>
    </>
  );
};

export default Index;
