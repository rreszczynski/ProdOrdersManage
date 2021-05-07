const express = require('express');
const router = express.Router();
const db = require('../database/db');
const jwtAuth = require('../middleware/jwtAuth');
const STATUSES = require('../helpers/statuses');
const ROLES = require('../helpers/roles');

// dodanie nowego zamówienia do bazy przez kilenta
const addOrder = async (req, res) => {  
  try {
    if (req.user.RoleId !== ROLES.KLIENT) {
      return res.status(500).send('Wyłącznie klient może dodać zlecenie!')
    }
    const newOrder = await db.Order.create({
      ordererId: req.user.id,
      rawMaterialName: req.body.rawMaterialName,
      orderDate: Date.now(),
      currentStatus: STATUSES.ZLOZONE,
      rawMaterialMass: req.body.rawMaterialMass,
      rawMaterialPallets: req.body.rawMaterialPallets
    });
    await db.OrderStatusHistory.create({
      changedByUserId: req.user.id,
      changeDate: Date.now(),
      OrderId: newOrder.id,
      StatusId: newOrder.currentStatus
    });
    return res.status(200).send('Pomyślnie dodano zamówienie');
  }catch (error) {
    return res.status(500).send(error);
  }
}


// pobranie listy zamówień klienta, lub wszystkich zamówień (pozostali użytkownicy)
const getOrders = async (req, res) => { 
  try {
    if (req.user.RoleId === ROLES.KLIENT) {
      const orders = await db.Order.findAll({
        where: {
          ordererId: req.user.id
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [{ model: db.User, as: 'User', attributes: ['companyName'] }]
      });
      return res.status(200).send(orders);
    }
    else {
      const orders = await db.Order.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [{ model: db.User, as: 'User', attributes: ['companyName'] }]
      });
      return res.status(200).send(orders);
    }
  } catch (error) {
    return res.status(500).send('Nie udało się pobrać listy zleceń');
  }
}


// pobranie historii zmian statusu danego zlecenia
const getOrderHistory = async (req, res) => { 
  try {
    orderToCheck = await db.Order.findOne({ where: { id: req.body.orderId } })

    // sprawdzam, czy klient próbuje pobrać historię zamówienia, którego nie złożył
    if (req.user.RoleId === ROLES.KLIENT && orderToCheck.ordererId !== req.user.id) {
      return res.status(500).send('Nie masz dostępu do historii tego zamówienia');
    }

    const orderHistory = await db.OrderStatusHistory.findAll({
      where: {
        orderId: req.body.orderId
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'changedByUserId']
      }
    });
    return res.status(200).send(
      {orderHistory: orderHistory,
        rawMaterialName: orderToCheck.rawMaterialName
      });
    
  } catch (error) {
    return res.status(500).send(error);
  }
}

router.get('/getorders', jwtAuth, getOrders);
router.post('/addOrder', jwtAuth, addOrder);
router.post('/getorderhistory', jwtAuth, getOrderHistory);

module.exports = router;