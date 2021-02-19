const express = require('express');

const app = express();

app.get('/test', (req, res) =>{
    res.status(200).send({
        success:'true',
        message:'api test endpoint'
    })    
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})
