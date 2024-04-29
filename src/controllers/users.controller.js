const { usersService } = require('../services');
const mapStatusHTTPS = require('../utils/mapStatusHTTP');

const create = async (req, res) => {
  const { displayName, email, password, image } = req.body;

  try {
    const { status, data } = await usersService.create({ displayName, email, password, image });

    return res.status(mapStatusHTTPS(status)).json(data);
  } catch (error) {
    console.error('error server ------', error.message);
    res.status(mapStatusHTTPS(error.status)).json({ message: 'Internal Server Error' });
  }
};

const getAll = async (_req, res) => {
  try {
    const { status, data } = await usersService.getAll();

    return res.status(mapStatusHTTPS(status)).json(data);
  } catch (error) {
    console.error('error server ------', error.message);
    res.status(mapStatusHTTPS(error.status)).json({ message: 'Internal Server Error' });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const { status, data } = await usersService.getById(Number(id));

    return res.status(mapStatusHTTPS(status)).json(data);
  } catch (error) {
    console.error('error server ------', error.message);
    res.status(mapStatusHTTPS(error.status)).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  create,
  getAll,
  getById,
};