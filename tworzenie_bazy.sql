START TRANSACTION;

CREATE DATABASE soz_database;
USE soz_database;

SET @A = now();

CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

INSERT INTO `roles` VALUES
(1,'admin',@A,@A),
(2,'magazynier',@A,@A),
(3,'technolog',@A,@A),
(4,'klient',@A,@A);

CREATE TABLE `statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

INSERT INTO `statuses` VALUES
(1,'anulowane',@A,@A),
(2,'złożone',@A,@A),
(3,'zatwierdzone',@A,@A),
(4,'wysłane',@A,@A),
(5,'na magazynie',@A,@A),
(6,'w produkcji',@A,@A),
(7,'wykonane',@A,@A),
(8,'do odbioru',@A,@A),
(9,'zakończone',@A,@A);

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `firstName` varchar(200) NOT NULL,
  `lastName` varchar(200) NOT NULL,
  `companyName` varchar(200) DEFAULT NULL,
  `nip` decimal(10,0) unsigned DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `RoleId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `RoleId` (`RoleId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

INSERT INTO `users` VALUES
(1,'admin','$2b$10$22KdnhorQLK6bJRSLyjvNeMG67ggHE45B3d.W9Za1wJm/RQNKWWzW','Administrator','Administrator','Moja Firma',5245428584,1,@A,@A,1),
(2,'magazynier','$2b$10$Jn2ZX1TsRdN/kaZv2wq6huOjbkiaMcDmKKWaEEIigkUp.Mn7fMzY.','Magazynier','Magazynier','Moja Firma',5245428584,1,@A,@A,2),
(3,'technolog','$2b$10$QYi.lp6bZock6ybN0cF./eJqpmi9uIFZh8lYZ3.MVUayv6xRKZb..','Technolog','Technolog','Moja Firma',5245428584,1,@A,@A,3),
(4,'jank','$2b$10$deBOYlU1.RR./1WkOo7Z6uPhiQRiPDpfwiJ740HONw0s9K3r5mGQO','Jan','Kowalski','PPHU Janex',4964676764,0,@A,@A,4);


CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rawMaterialName` varchar(200) NOT NULL,
  `orderDate` datetime NOT NULL,
  `rawMaterialMass` decimal(10,2) unsigned NOT NULL,
  `rawMaterialPallets` int NOT NULL,
  `productMass` decimal(10,2) unsigned DEFAULT NULL,
  `productPallets` int unsigned DEFAULT NULL,
  `currentStatus` int unsigned NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ordererId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ordererId` (`ordererId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`ordererId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `orderstatushistories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `changeDate` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `changedByUserId` int NOT NULL,
  `StatusId` int NOT NULL,
  `OrderId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `changedByUserId` (`changedByUserId`),
  KEY `StatusId` (`StatusId`),
  KEY `OrderId` (`OrderId`),
  CONSTRAINT `orderstatushistories_ibfk_1` FOREIGN KEY (`changedByUserId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistories_ibfk_2` FOREIGN KEY (`StatusId`) REFERENCES `statuses` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `orderstatushistories_ibfk_3` FOREIGN KEY (`OrderId`) REFERENCES `orders` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

COMMIT;