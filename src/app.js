const express = require('express');
const { loginRoute, usersRoute, 
  categoriesRoute, postsRoute } = require('./routes');
require('express-async-errors');

// ...

const app = express();

// não remova ou mova esse endpoint
app.get('/', (_request, response) => {
  response.send();
});

app.use(express.json());
app.use('/login', loginRoute);
app.use('/user', usersRoute);
app.use('/categories', categoriesRoute);
app.use('/post', postsRoute);

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message });
});

// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
