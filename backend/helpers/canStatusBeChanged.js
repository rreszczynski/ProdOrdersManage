const STATUSES = require('../helpers/statuses')
const ROLES = require('../helpers/roles')

const canStatusBeChanged = function (role, oldStatus, newStatus){

switch (role) {
      case ROLES.ADMIN:
        return true;
        break;

      case ROLES.MAGAZYNIER:
        if (oldStatus === STATUSES.WYSLANE && newStatus === STATUSES.NA_MAGAZYNIE)
          return true;
        if (oldStatus === STATUSES.WYKONANE && newStatus === STATUSES.DO_ODBIORU)
          return true;
        if (oldStatus === STATUSES.DO_ODBIORU && newStatus === STATUSES.ZAKONCZONE)
          return true;
        break;

      case ROLES.TECHNOLOG:
        if (oldStatus === STATUSES.ZLOZONE && newStatus == STATUSES.ZATWIERDZONE)
          return true;
        if (oldStatus === STATUSES.ZLOZONE && newStatus == STATUSES.ANULOWANE)
          return true;
        if (oldStatus === STATUSES.ZATWIERDZONE && newStatus === STATUSES.ANULOWANE)
          return true;
        if (oldStatus === STATUSES.NA_MAGAZYNIE && newStatus === STATUSES.W_PRODUKCJI)
          return true;
        if (oldStatus === STATUSES.W_PRODUKCJI && newStatus === STATUSES.WYKONANE)
          return true;
        break;

      case ROLES.KLIENT:
        if (oldStatus === STATUSES.ZLOZONE && newStatus === STATUSES.ANULOWANE)
          return true;
        if (oldStatus === STATUSES.ZATWIERDZONE && newStatus === STATUSES.ANULOWANE)
          return true;
        if (oldStatus === STATUSES.ZATWIERDZONE && newStatus === STATUSES.WYSLANE)
          return true;
        break;

      default:
        return false;
        break;
    }

}

module.exports = canStatusBeChanged