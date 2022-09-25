const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./coronaboard-api/database');

const globalStatController = require('./coronaboard-api/controller/global-stat.controller');
const keyValueController = require('./coronaboard-api/controller/key-value.controller');

async function launchServer() {
    const app = express();

    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.json({ message: 'Hello CoronaBoard!' });
    });

    app.get('/global-stats', globalStatController.getAll);
    app.post('/global-stats', globalStatController.insertOrUpdate);
    app.delete('/global-stats', globalStatController.remove);

    app.get('/key-value/:key', keyValueController.get);
    app.post('/key-value', keyValueController.insertOrUpdate);
    app.delete('/key-value/:key', keyValueController.remove);

    try {
        await sequelize.sync({ alter: true });
        console.log('Database is ready!');
      } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error);
        process.exit(1);
      }
    
      const port = process.env.PORT || 8080;
      app.listen(port, () => {
        console.log(`Server is running on port ${port}.`);
      });
};

launchServer();