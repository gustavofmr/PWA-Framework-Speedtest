console.log("Teste1")
const port = process.env.PORT
var exec = require('child_process').exec;
exec('nx serve speedtest-app -p ' + port, function callback(error, stdout, stderr){
    console.log("Teste2")
});

