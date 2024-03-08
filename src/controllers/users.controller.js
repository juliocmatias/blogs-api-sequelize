const { usersService } = require('../services');
const mapStatusHTTPS = require('../utils/mapStatusHTTP');

const create = async (req, res) => {
  const { displayName, email, password, image } = req.body;

  const { status, data } = await usersService.create({ displayName, email, password, image });

  return res.status(mapStatusHTTPS(status)).json(data);
};

const getAll = async (_req, res) => {
  const { status, data } = await usersService.getAll();

  return res.status(mapStatusHTTPS(status)).json(data);
};

module.exports = {
  create,
  getAll,
};