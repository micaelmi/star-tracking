-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `type` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeviceStatus` (
    `deviceStatusId` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`deviceStatusId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IButton` (
    `ibuttonId` INTEGER NOT NULL AUTO_INCREMENT,
    `number` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `programmedField` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(500) NULL,
    `url1` VARCHAR(191) NULL,
    `url2` VARCHAR(191) NULL,
    `deviceStatusId` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`ibuttonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tracker` (
    `trackerId` INTEGER NOT NULL AUTO_INCREMENT,
    `number` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `chipOperator` VARCHAR(191) NOT NULL,
    `iccid` VARCHAR(191) NOT NULL,
    `output` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(500) NULL,
    `deviceStatusId` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`trackerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fleet` (
    `fleetId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',

    PRIMARY KEY (`fleetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FleetContact` (
    `fleetContactId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `fleetId` INTEGER NOT NULL,

    PRIMARY KEY (`fleetContactId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FleetEmail` (
    `fleetEmailId` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `fleetId` INTEGER NOT NULL,

    PRIMARY KEY (`fleetEmailId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `driverId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `cnh` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(500) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `fleetId` INTEGER NOT NULL,

    UNIQUE INDEX `Driver_cpf_key`(`cpf`),
    PRIMARY KEY (`driverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `vehicleId` INTEGER NOT NULL AUTO_INCREMENT,
    `model` VARCHAR(191) NOT NULL,
    `licensePlate` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `renavam` VARCHAR(191) NOT NULL,
    `chassis` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `installationDate` DATETIME(3) NOT NULL,
    `comments` VARCHAR(500) NULL,
    `url` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `fleetId` INTEGER NOT NULL,

    UNIQUE INDEX `Vehicle_licensePlate_key`(`licensePlate`),
    PRIMARY KEY (`vehicleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComunicationProblem` (
    `comunicationProblemId` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `vehicleId` INTEGER NOT NULL,

    PRIMARY KEY (`comunicationProblemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComunicationDescription` (
    `comunicationDescriptionId` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `userId` INTEGER NOT NULL,
    `comunicationProblemId` INTEGER NOT NULL,

    PRIMARY KEY (`comunicationDescriptionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DriverIButton` (
    `driverIButtonId` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` TIMESTAMP(0) NULL,
    `comments` VARCHAR(191) NOT NULL,
    `driverId` INTEGER NOT NULL,
    `ibuttonId` INTEGER NOT NULL,

    PRIMARY KEY (`driverIButtonId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehicleTracker` (
    `vehicleTrackerId` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endDate` TIMESTAMP(0) NULL,
    `comments` VARCHAR(191) NOT NULL,
    `vehicleId` INTEGER NOT NULL,
    `trackerId` INTEGER NOT NULL,

    PRIMARY KEY (`vehicleTrackerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IButton` ADD CONSTRAINT `IButton_deviceStatusId_fkey` FOREIGN KEY (`deviceStatusId`) REFERENCES `DeviceStatus`(`deviceStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tracker` ADD CONSTRAINT `Tracker_deviceStatusId_fkey` FOREIGN KEY (`deviceStatusId`) REFERENCES `DeviceStatus`(`deviceStatusId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FleetContact` ADD CONSTRAINT `FleetContact_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`fleetId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FleetEmail` ADD CONSTRAINT `FleetEmail_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`fleetId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`fleetId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_fleetId_fkey` FOREIGN KEY (`fleetId`) REFERENCES `Fleet`(`fleetId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComunicationProblem` ADD CONSTRAINT `ComunicationProblem_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`vehicleId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComunicationDescription` ADD CONSTRAINT `ComunicationDescription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComunicationDescription` ADD CONSTRAINT `ComunicationDescription_comunicationProblemId_fkey` FOREIGN KEY (`comunicationProblemId`) REFERENCES `ComunicationProblem`(`comunicationProblemId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverIButton` ADD CONSTRAINT `DriverIButton_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`driverId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverIButton` ADD CONSTRAINT `DriverIButton_ibuttonId_fkey` FOREIGN KEY (`ibuttonId`) REFERENCES `IButton`(`ibuttonId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleTracker` ADD CONSTRAINT `VehicleTracker_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`vehicleId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleTracker` ADD CONSTRAINT `VehicleTracker_trackerId_fkey` FOREIGN KEY (`trackerId`) REFERENCES `Tracker`(`trackerId`) ON DELETE RESTRICT ON UPDATE CASCADE;
