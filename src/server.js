const app = require('./app');

// não remova a variável `API_PORT` ou o `listen`
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log('ouvindo porta', PORT));
