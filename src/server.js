const app = require('./app');

// não remova a variável `API_PORT` ou o `listen`
const port = process.env.API_PORT;

app.listen(port, () => console.log('ouvindo porta', port));
