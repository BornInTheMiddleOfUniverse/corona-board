const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./database');

async function launchServer() {
    const app = express();

    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.json({ message: 'Hello CoronaBoard!' });
    });
};

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`😀 Server is running on port ${port}`);
});