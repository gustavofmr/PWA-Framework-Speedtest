import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700&family=Material+Icons&display=swap"
          />

          <link 
            rel="stylesheet" 
            href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" 
            integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" 
            crossOrigin="anonymous"
          />


        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
