const express = require('express');

const app = express();

app.get('/api/test', (req, res) =>{
    res.status(200).send({
        success:'true',
        message:'api test passed'
    })    
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})