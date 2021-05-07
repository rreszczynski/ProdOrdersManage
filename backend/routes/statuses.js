const express = require('express');
const router = express.Router();
const db = require('../database/db');
const jwtAuth = require('../middleware/jwtAuth');
const STATUSES = require('../helpers/statuses')
const ROLES = require('../helpers/roles')
const canStatusBeChanged = require('../helpers/canStatusBeChanged')

// zmiana statusu zamówienia
const changeStatus = async (req, res) => {	
	try {
		const oldStatus = req.body.oldStatus;
		const newStatus = req.body.newStatus;
		const user = req.user;
		const orderToChange = await db.Order.findOne({ where: { id: req.body.orderId } });

		// klient może zmieniać tylko status swojego zamówienia
		if (user.RoleId === ROLES.KLIENT && orderToChange.ordererId !== user.id) {
			return res.status(500).send('Zabronione')
		}

		// pozostałe role - sprawdź czy mogą zmienić i jeżeli tak - zmień
		if(canStatusBeChanged(user.RoleId, oldStatus, newStatus)) {
			
			orderToChange.currentStatus = newStatus;
			//jeżeli technolog zdaje produkt do magazynu - dodaj mase prod. i ilosc palet
			if(newStatus === STATUSES.WYKONANE) {
				if(req.body.productMass && req.body.productPallets) {
					orderToChange.productMass = req.body.productMass;
					orderToChange.productPallets = req.body.productPallets;
				} else {
					throw new error();
				}
			}
			await orderToChange.save();

			await db.OrderStatusHistory.create({
				changedByUserId: user.id,
				changeDate: Date.now(),
				OrderId: orderToChange.id,
				StatusId: newStatus
			});
			return res.sendStatus(200);
		} else {
			return res.status(500).send('Nieduane');
		}
	} catch (error) {
		return res.status(500).send('Błąd');
	}
}

router.post('/changestatus', jwtAuth, changeStatus);

module.exports = router;