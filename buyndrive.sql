DROP DATABASE IF EXISTS `buyndrive`;

CREATE DATABASE `buyndrive`;

USE `buyndrive`;

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees`(
    `EmployeeID` INT NOT NULL AUTO_INCREMENT,
    `FirstName` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `LastName` varchar(24)  CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `HireDate` datetime NOT NULL,
    `Phone` varchar(12) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    `Commission` double unsigned NOT NULL DEFAULT 0.0,
    PRIMARY KEY (`EmployeeID`),
    KEY `key_employees_lastname` (`LastName`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

LOCK TABLES `employees` WRITE;
INSERT INTO `employees` VALUES (1, 'SARAH', 'WOLFE', '2014-04-20 09:23:44', '352-547-2223', 0.14),
(2, 'SAM', 'VANDERVEEN', '2014-05-12 13:00:09', '467-247-9228', 0.14),
(3, 'ALEX', 'BROWN', '2014-06-08 16:23:59', '225-884-2638', 0.14),
(4, 'TOM', 'MCCASLIN', '2014-06-09 09:45:13', '467-223-3360', 0.12),
(5, 'RACHEL', 'GREY', '2014-08-11 10:30:29', '467-679-9228', 0.13),
(6, 'SAM', 'MARSH', '2014-08-20 11:22:03', '225-263-0051', 0.13),
(7, 'RONALD', 'VAN BERG', '2014-09-07 11:00:09', '467-247-9228', 0.14);
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
INSERT INTO `customers` (`CustomerID`, `FirstName`, `LastName`, `Phone`) VALUES (1, 'SAM', 'HYDE', '325-645-004'),
(2, 'JESSE', 'WILLIAMS', '227-976-0670'),
(3, 'KEITH', 'BRUIN', '761-227-8901'),
(4, 'KATHRYN', 'HYDE', '325-347-6772'),
(5, 'SETH', 'CASTLES', '112-001-5423'),
(6, 'KEITH', 'WILLIAMS', '620-664-9072');
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
INSERT INTO `vehicles` VALUES (1, 'HONDA', 'CR-V', '2006', 'CHARCOAL', 6700.00),
(2, 'HONDA', 'CR-V', '2006', 'CHARCOAL', 6700.00),
(3, 'HONDA', 'CR-V', '2006', 'RED', 6950.00),
(4, 'HONDA', 'CR-V', '2013', 'BLUE', 12700.00),
(5, 'HONDA', 'CR-V', '2013', 'SILVER', 12140.00),
(6, 'FORD', 'FUSION', '2014', 'CHARCOAL', 9900.00),
(7, 'FORD', 'FUSION', '2014', 'RED', 9500.00),
(8, 'FORD', 'FUSION', '2015', 'RED', 11400.00),
(9, 'FORD', 'FUSION', '2015', 'BLACK', 12100.00),
(10, 'KIA', 'OPTIMA', '2014', 'BLUE', 8800.00),
(11, 'KIA', 'OPTIMA', '2014', 'RED', 8950.00),
(12, 'KIA', 'OPTIMA', '2014', 'CHARCOAL', 8600.00),
(13, 'KIA', 'FORTE', '2018', 'WHITE', 12900.00),
(14, 'CHEVY', 'EQUINOX', '2013', 'BLACK', 11700.00),
(15, 'CHEVY', 'EQUINOX', '2017', 'CHARCOAL', 13000.00),
(16, 'CHEVY', 'VOLT', '2017', 'WHITE', 16000.00);
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
INSERT INTO `sales` VALUES 
(1, 1, 1, 1, 6700.00, 0.14),
(2, 2, 3, 3, 6950.00, 0.14),
(3, 3, 2, 8, 11400.00, 0.14),
(4, 4, 4, 7, 9500.00, 0.12),
(5, 6, 6, 16, 16000.00, 0.13),
(6, 3, 5, 4, 12700.00, 0.14);

UNLOCK TABLES;