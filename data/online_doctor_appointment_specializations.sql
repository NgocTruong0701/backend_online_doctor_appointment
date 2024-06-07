-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: online_doctor_appointment
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `specializations`
--

LOCK TABLES `specializations` WRITE;
/*!40000 ALTER TABLE `specializations` DISABLE KEYS */;
INSERT INTO `specializations` VALUES (1,'Dentis','Dentis','2024-04-13 14:35:57.449919','2024-04-30 00:41:49.695490','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/category/Tooth.png'),(2,'Cardiologist','Cardiologist','2024-04-13 14:35:57.449919','2024-04-30 00:41:49.697633','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/category/Brain.png'),(3,'Orthorpedic','Orthorpedic','2024-04-13 14:35:57.449919','2024-04-30 00:18:50.744046','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/category/Joints+Bone.png'),(4,'Neurologist','Neurologist','2024-04-13 14:35:57.449919','2024-04-30 00:18:50.744046','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/category/Heart+Rate.png'),(5,'Virustlogist','Virustlogist','2024-04-13 14:35:57.449919','2024-04-13 14:35:57.449919','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/category/Virus.png'),(6,'Pediatrician ','Pediatrician ','2024-04-13 14:35:57.449919','2024-04-13 14:35:57.449919','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/category/Body.png'),(7,'Ophthalmologist ','Ophthalmologist ','2024-04-13 14:35:57.449919','2024-04-30 11:25:30.992627','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/category/Eye.png');
/*!40000 ALTER TABLE `specializations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-07 20:44:47
