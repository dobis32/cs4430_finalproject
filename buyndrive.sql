DROP DATABASE IF EXISTS `buyndrive`;

CREATE DATABASE `buyndrive`;

USE `buyndrive`;

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees`(
    `EmployeeID` INT NOT NULL AUTO_INCREMENT,
    `FirstName` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `LastName` varchar(24)  CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `HireDate` datetime NOT NULL,
    `SalesToDate` double unsigned NOT NULL DEFAULT 0.0,
    `Phone` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    `Commission` double unsigned NOT NULL DEFAULT 0.0,
    PRIMARY KEY (`EmployeeID`),
    KEY `key_employees_lastname` (`LastName`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

LOCK TABLES `employees` WRITE;
INSERT INTO `employees` VALUES (1, 'SCOTT', 'VANDERWEIDE', '1981-04-20 09:23:44', 2600.00, '2695479518', 0.30);
UNLOCK TABLES;

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers`(
    `CustomerID` INT NOT NULL AUTO_INCREMENT,
    `FirstName` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `LastName` varchar(24)  CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `Phone` char(12) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    PRIMARY KEY (`CustomerID`),
    KEY `key_customers_lastname` (`LastName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `customers` WRITE;
INSERT INTO `customers` (`FirstName`, `LastName`, `Phone`) VALUES ('SAM', 'HYDE', '325-6390-004');
UNLOCK TABLES;

DROP TABLE IF EXISTS `vehicles`;
CREATE TABLE `vehicles` (
    `VehicleID` INT NOT NULL AUTO_INCREMENT,
    `Make` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `Model` varchar(24) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `Year` INT NOT NULL,
    `Color` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    `Price` double unsigned NOT NULL,
    PRIMARY KEY (`VehicleID`),
    KEY `key_vehicles_make` (`Make`),
    KEY `key_vehicles_year` (`Year`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

LOCK TABLES `vehicles` WRITE;
INSERT INTO `vehicles` VALUES (1, 'HONDA', 'CR-V', '2006', 'CHARCOAL', 6700.00);
UNLOCK TABLES;

DROP TABLE IF EXISTS `sales`;
CREATE TABLE `sales` (
    `SaleID` INT NOT NULL AUTO_INCREMENT,
    `EmployeeID` INT,
    `CustomerID` INT,
    `VehicleID` INT,
    `SubTotal` double unsigned NOT NULL,
    `Commission` double unsigned NOT NULL,
    PRIMARY KEY (`SaleID`),
    UNIQUE KEY `UK_sales_vehicleid` (`VehicleID`),
    KEY `key_sales_employeeid` (`EmployeeID`),
    CONSTRAINT `FK_sales_employeeid` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`),
    CONSTRAINT `FK_sales_customerid` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`),
    CONSTRAINT `FK_sales_vehicleid` FOREIGN KEY (`VehicleID`) REFERENCES `vehicles` (`VehicleID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

LOCK TABLES `sales` WRITE;
INSERT INTO `sales` VALUES (1, 1, 1, 1, 6700.00, 0.30);
UNLOCK TABLES;