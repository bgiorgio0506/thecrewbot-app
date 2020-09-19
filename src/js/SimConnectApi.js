const SimConnect = require('nodejs-simconnect')
// Open connection
function connectToSimInternal (){
    
    var success = SimConnect.open("MyAppName", function(name, version) {
        console.log("\n-----------------------------------------------\nConnected to: " + name + "\nSimConnect version: " + version + "\n-----------------------------------------------");
        //doStuffWithSimconnect();

    }, () => {
        console.log("Quit.... :(");
    }, (exception) => {
        console.log("SimConnect exception: " + exception.name + " (" + exception.dwException + ", " + exception.dwSendID + ", " + exception.dwIndex + ", " + exception.cbData + ")");
    }, (error) => {
        // Happens for example when connection with SimConnect is lost unexpectedly. For crash details: ntstatus.h
        if(error.toString().includes('0xC00000B0') === true) console.log('Error ok!!')
        console.log("SimConnect error: " + error);

        // The connection must be re-opened
    });

    if(!success){
        console.log('Trying again in 5 sec!!')
    }
}

exports.connectToSim = ()=>{
    console.log("Trying to connect...")

    var success = SimConnect.open(process.env.APP_NAME, function(name, version) {
        console.log("\n-----------------------------------------------\nConnected to: " + name + "\nSimConnect version: " + version + "\n-----------------------------------------------");
        //doStuffWithSimconnect();

    }, () => {
        console.log("Quit.... :(");
        connectToSimInternal();
    }, (exception) => {
        console.log("SimConnect exception: " + exception.name + " (" + exception.dwException + ", " + exception.dwSendID + ", " + exception.dwIndex + ", " + exception.cbData + ")");
    }, (error) => {
        // Happens for example when connection with SimConnect is lost unexpectedly. For crash details: ntstatus.h
        console.log("SimConnect error: " + error);

        // The connection must be re-opened
        connectToSimInternal();
    });

    let SimConnectionInterval;
    if(!success) {
        console.log(success)
        SimConnectionInterval = setInterval(() => {
            connectToSimInternal();
        }, 5000);
    }else{
        console.log(success)
        console.log('Connected success')
        clearInterval(SimConnectionInterval)
    }
}