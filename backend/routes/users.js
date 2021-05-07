const express = require('express');
const router = express.Router();
const db = require('../database/db');
const jwt = require('jsonwebtoken');
const secretKey = require('../secret/key');
const jwtAuth = require('../middleware/jwtAuth');
const ROLES = require('../helpers/roles');

const addClient = async (req, res) => { 
  try {
    if (await db.User.findOne({ where: { name: req.body.username } })) {
      return res.status(500).send('Nazwa użytkownika jest już zajęta')
    }
    const newClient = await db.User.create({
      name: req.body.username,
      password: req.body.password,
      RoleId: 4,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      companyName: req.body.companyName,
      nip: req.body.nip,
      isActive: true
    });
    return res.status(200).send(newClient);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// zaloguj użytkownika
const loginUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = await db.User.findOne({ where: { name: username } });

  if(user) {
    const correct = await user.checkPassword(password);
    if (!user.isActive) {
      return res.status(500).send('Użytkownik zablokowany');
    }
    if(correct && user.isActive) {
      const accessToken = jwt.sign({ id: user.id, role: user.RoleId, name: user.name }, secretKey);
      return res.json({ accessToken });
    } else {
      return res.status(500).send('Nieprawidłowe hasło');
    }
  } else {
    return res.status(500).send('Użytkownik nie istnieje');
  }
}

// pobierz dane użytkownika
const getUser = async (req, res) => {
  const userData = {
    name: req.user.name,
    RoleId: req.user.RoleId,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    companyName: req.user.companyName,
    nip: req.user.nip,
    createdAt: req.user.createdAt
  }
  return res.json(userData);
}

// pobierz dane wszystkich klientów
const getAllClients = async (req, res) => {
  try {
    if (req.user.RoleId === ROLES.KLIENT) {
      return res.status(500).send('Dostęp zabroniony');
    }

    const clients = await db.User.findAll({
      where: {
        RoleId: ROLES.KLIENT
      },
      attributes: {
        exclude: ['password', 'RoleId', 'createdAt', 'updatedAt']
      }
    });
    return res.status(200).send(clients);
  } catch (error) {
    return res.status(500).send('Wystąpił błąd przy pobieraniu listy klientów.');
  }
}

// zmień status klienta na odwrotny (aktywny <-> nieaktywny)
const changeClientStatus = async (req, res) => {
  try {
    if (req.user.RoleId !== ROLES.ADMIN) {
      return res.status(500).send('Dostęp zabroniony');
    }

    const client = await db.User.findOne({ where: { id: req.body.clientId } })
    client.isActive =! client.isActive;
    client.save();
    return res.status(200).send('status zmieniony na: ' + client.isActive);
  } catch (error) {
    return res.status(500).send('Błąd serwera');
  }
}

router.post('/addClient', addClient);
router.get('/getallclients', jwtAuth, getAllClients);
router.post('/login', loginUser);
router.get('/getUser', jwtAuth, getUser);
router.post('/changeclientstatus', jwtAuth, changeClientStatus);

module.exports = router;