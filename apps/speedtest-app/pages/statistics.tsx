import React from 'react';
import { Button } from "reactstrap";
import Link from 'next/link'




export const About = () => {

    function I(i){return document.getElementById(i);}

    function calculate(){
        console.log("oiebdwjm")
        var memo = window.localStorage
        Storage.prototype.setObject = function(key, value) {
        this.setItem(key, JSON.stringify(value));
        }
    
        Storage.prototype.getObject = function(key) {
        return JSON.parse(this.getItem(key));
        }

        var last_isp = memo.getItem("last_isp");
        var user_dspeed = I("user_dspeed").value;
        var user_uspeed = I("user_uspeed").value;
        var d40s = 0.4*user_dspeed;
        var u40s = 0.4*user_uspeed;
        var d80s = 0.8*user_dspeed;
        var u80s = 0.8*user_uspeed;
        var dicionario_ =  memo.getObject(last_isp);
        var test_number = dicionario_.length;
        console.log(test_number)
        var d40n = 0;
        var u40n = 0;
        var d80n = 0;
        var u80n = 0;
        var dsm = 0;
        var usm = 0;
        var pm_ = 0;
        var jm_ = 0;

        for(var dict_ in dicionario_){
            console.log(dict_)
            var uspeed = parseFloat(dicionario_[dict_].ul);
            var dspeed = parseFloat(dicionario_[dict_].ds);
            var ping_ = parseFloat(dicionario_[dict_].ping);
            var jitter_ = parseFloat(dicionario_[dict_].jitter);

            console.log(uspeed);
            console.log(dspeed);
            console.log(ping_);
            console.log(jitter_);

            dsm = dsm + dspeed;
            usm = usm + uspeed;
            pm_ = pm_ + ping_;
            jm_ = jm_ +jitter_;

            if(dspeed > d40s){
                d40n = d40n + 1;
            }
            if(dspeed > d80s){
                d80n = d80n + 1;
            }
            if(uspeed > u40s){
                u40n = u40n + 1;
            }
            if(uspeed > u80s){
                u80n = u80n + 1;
            }
        }

        d40n = (d40n/test_number).toFixed(2);
        u40n = (u40n/test_number).toFixed(2);
        d80n = (d80n/test_number).toFixed(2);
        u80n = (u80n/test_number).toFixed(2);
        dsm = (dsm/test_number).toFixed(2);
        usm = (usm/test_number).toFixed(2);
        pm_ = (pm_/test_number).toFixed(2);
        jm_ = (jm_/test_number).toFixed(2);
      
        I("last_isp").innerHTML = last_isp;
        I("medida1").innerHTML = dsm + "Mbps";
        I("medida2").innerHTML = usm + "Mbps";
        I("medida3").innerHTML = "Download: " + (d40n*100) + "%" + "  Upload: " + (u40n*100) + "%";
        I("medida4").innerHTML = "Download: " + (d80n*100) + "%" + "  Upload: " + (u80n*100) + "%";
        I("medida5").innerHTML = pm_ + "mS";
        I("medida6").innerHTML = jm_ + "mS";
        I("calculate").style.display = "none";
        I("show").style.display = "block";

    }
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

            #show{
                display: none
            }

            h3,
            h4,
            h5 {
              color: #016ead;
              font-size: 21px;
              margin: 14px 0;
            }
            input{
                margin: 0 0 15px 0;
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
          `}</style>

          <Link href="/">

            <Button type="button" className="botaohome"> Home</Button>

          </Link>
          <main>
            <h1>My measurements</h1>
            <p>Here you can see statistics for the last ISP you took the test.</p>

            <h2>Criteria</h2>
            <p>
              ANATEL defines that the mean tranfer rate measured by you has to be at least 80% of the nominal transfer rate of your internet connection. And the immediate tranfer rate measured by you has to be at least 40%.  
            </p>
            <h2>Last ISP</h2>
            <p id="last_isp">
            </p>
            <h2>Statistics</h2>
            <div className="col-md-4 col-md-offset-3" id="calculate">

                <label>
                     Your download speed:
                    <input type="number" id="user_dspeed"/>
                </label>

                <label>
                     Your upload speed:
                    <input type="number" id="user_uspeed"/>
                </label>                
                
                <Button type="button" className="btn-block" onClick={calculate}> Calculate statistics</Button>

            </div>
            
            <div className="row ymarging">

                <div className="col-md-4 col-md-offset-3" id="show">

                    <p>
                        Your mean download speed:
                    </p>

                    <p id="medida1"></p>

                    <p>
                        Your mean upload speed:
                    </p>                
                    
                    <p id="medida2"></p>

                    <p>
                        Percent of tests when the measured speed was above 40%:
                    </p>
                    <p id="medida3"></p>
                    <p>
                        Percent of tests when the measured speed was above 80%:
                    </p>
                    <p id="medida4"></p>

                    <p>
                        Mean delay:
                    </p>
                    <p id="medida5"></p>
                    <p>
                        Mean jitter:
                    </p>
                    <p id="medida6"></p>
                </div>
            </div>
          
          </main>
        </>
      );
    };export default About;
