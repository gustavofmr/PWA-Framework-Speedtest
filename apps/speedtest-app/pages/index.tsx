//import { Speedtest } from '@vst/speedtest';
import React from 'react';
import { Button } from "reactstrap";
import Link from 'next/link'




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
          color: #016ead;
          font-size: 44px;
          /*color: #0aa5ab;*/
          text-align: center;
        }

        h2 {
          color: #016ead;
          text-align: center;
        }

        h3,
        h4 {
          color: #016ead;
          font-size: 21px;
          margin: 14px 0;
        }
        
        
        h5 {
          color: #016ead;
          font-size: 21px;
          margin: 14px 0;
          text-align: center;
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
        .botaohome{
          margin: 12px
        }
        .preview {
          border: 2px solid #0aa5ab;
          border-radius: 8px;
          padding: 20px;
          margin: 6px 0 12px;
          background-color: white;
        }

        Button {
          background-color: #d4dee8;
          color: rgb(51, 51, 51);
        }

        .ymarging {
          margin-top: 2%;
        }

      `}</style>
      <main>
        
        <div className="row">
          
          <div className="col-md-6 col-md-offset-3">

          <h1>Welcome to GFM Speed Test</h1>

          <h5>This is the state of the art app for measuring internet connection healt and speed!</h5>

          <h5>Are you ready to start measuring your connection?</h5>

          </div>
        
        </div>
        
        <div className="row">

          <div className="row ymarging">

            <div className="col-md-4 col-md-offset-3">

            <Link href="/about">

              <Button type="button" className="btn-block"> Learn more about the app</Button>
          
            </Link>

            </div>

          </div>
          
          <div className="row ymarging">

            <div className="col-md-4 col-md-offset-3">

            <Link href="/config">

              <Button type="button" className="btn-block"> Change app preferences</Button>

            </Link>

            </div>

          </div>
          
          
          <div className="row ymarging">

            <div className="col-md-4 col-md-offset-3">
            
              <Link href="/speedtest">

                <Button type="button" className="btn-block"> Start connection measurements</Button>

              </Link>
              

            </div>

          </div>

          <div className="row ymarging">

            <div className="col-md-4 col-md-offset-3">

            <Link href="/statistics">

              <Button type="button" className="btn-block"> View old measurements</Button>

            </Link>

            </div>

          </div>


          {/*
          <p>Your app is available in "apps/speedtest-app" directory.</p>
          <p>
            App is based on <a href="https://nextjs.org/">Next.js</a>. If you are
            not familiar with the framework head out to{' '}
            <a href="https://nextjs.org/docs/basic-features/pages">docs</a>.
          </p>
          <h2>PWA Framework</h2>
          <Speedtest />
          */}
        
      </div>

      </main>
    </>
  );
};

export default Index;
