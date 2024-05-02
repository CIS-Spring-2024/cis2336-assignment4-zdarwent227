const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());


app.post('/order', (req, res) => {
   
});


const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


server.on('close', () => {
    console.log('Server has been closed');
});

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server has been terminated due to SIGINT signal');
        process.exit(0); 
    });
});
