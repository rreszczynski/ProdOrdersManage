const dbConnectionParams = require('./dbConnectionParams.json');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const db ={};

const sequelize = new Sequelize(
	dbConnectionParams.dbName,
	dbConnectionParams.dbUser,
	dbConnectionParams.dbPassword,
	dbConnectionParams.dbOptions
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('../models/User')(sequelize, Sequelize);
db.Role = require('../models/Role')(sequelize, Sequelize);
db.Status = require('../models/Status')(sequelize, Sequelize);
db.Order = require('../models/Order')(sequelize, Sequelize);
db.OrderStatusHistory = require('../models/OrderStatusHistory')(sequelize, Sequelize);

// DODANIE DO USER METODY  - porównanie hasła w postaci plain text z hasłem zahashowanym zapisanym w bazie
db.User.prototype.checkPassword = async function(password) {
	return await bcrypt.compare(password, this.password);
}

// sprawdzenie czy wpiano poprawny nip w formularzu
// źródło kodu: https://pl.wikibooks.org/wiki/Kody_%C5%BAr%C3%B3d%C5%82owe/Implementacja_NIP#Implementacja_algorytmu_w_j%C4%99zyku_JavaScript
db.User.prototype.validateNip = function(nip) {
    var weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    nip = nip.replace(/[\s-]/g, '');
               
    if (nip.length === 10 && parseInt(nip, 10) > 0) {
        var sum = 0;
        for(var i = 0; i < 9; i++){
                sum += nip[i] * weights[i];
        }                     
        return (sum % 11) === Number(nip[9]);
    }
    return false;	
}

// ASOCJACJE

// *** ROLE
// dodanie asocjacji User -< Role
db.Role.hasMany(db.User, {
  foreignKey: {
    allowNull: false
  }
});

// *** ORDERSTATUSHISTORY
// dodanie asocjacji User -- OrderStatusHistory
db.OrderStatusHistory.belongsTo(db.User, {
	foreignKey: {
		name: 'changedByUserId',
		allowNull: false
	}
});

// dodanie asocjacji Status -- OrderStatusHistory
db.OrderStatusHistory.belongsTo(db.Status, {
  foreignKey: {
    allowNull: false
  }
});
// dodanie asocjacji Status -- OrderStatusHistory
db.OrderStatusHistory.belongsTo(db.Order, {
  foreignKey: {
    allowNull: false
  }
});

// *** ORDER
// dodanie asocjacji User -- Order (zlecający zamówienie)
db.Order.belongsTo(db.User, {
	foreignKey: {
		name: 'ordererId',
		allowNull: false
	}
});
//synchronizacja bazy
//db.sequelize.sync();

module.exports = db;
