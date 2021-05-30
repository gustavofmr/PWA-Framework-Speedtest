import React from 'react';
import Link from 'next/link'


export const About = () => {
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
            <h1>About the GFM Speed Test</h1>
            <h2>App</h2>
            <p>This app was developed by GFM for the Viasat Hackaton 2k21</p>
            <p>
              It aims to measure the connection speed according to ANATEL.
            </p>
            <h2>Tecnology</h2>
            <p>
              Developed using the React framework NextJs and CSS library Bootstrap. For the connections measurements It uses the NodeJs LibreSpeed. 
            </p>
            <h2>Features</h2>
            <p>
              The app can record old measurements and generate a chart of these records. It also can send you push notifications (not implemented yet) to remind you to test regularly.
            </p>
            <h2>ANATEL standard</h2>
            <p>
              You can access this <a href="https://www.anatel.gov.br/Portal/exibirPortalPaginaEspecialPesquisa.do?acao=&tipoConteudoHtml=1&codNoticia=35544" target="_blank" rel="noopener noreferrer">page</a> to see the cretiria ANATEL adopts for internet speed measurement.
            </p>
          </main>
        </>
      );
    };export default About;
