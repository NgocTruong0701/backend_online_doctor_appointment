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
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,'cancelled',6,1,'tôi bị ốm, đau đầu, đau bụng, đau lưng, đau chân, đau cổ tay, đau ngực, đau chân. Nói chung chỗ nào cũng đau hết','2024-05-09 01:07:07.490000','2024-05-27 09:43:58.248814',1,'2024-05-10 09:00:00',0),(2,'cancelled',6,1,'tôi bị ốm, đau đầu, đau bụng, đau lưng, đau chân, đau cổ tay, đau ngực, đau chân. Nói chung chỗ nào cũng đau hết','2024-05-09 01:12:22.228000','2024-05-14 15:21:12.674202',1,'2024-05-14 09:00:00',0),(3,'upcoming',6,1,'tôi bị ốm, đau đầu, đau bụng, đau lưng, đau chân, đau cổ tay, đau ngực, đau chân. Nói chung chỗ nào cũng đau hết','2024-05-12 19:45:05.399000','2024-05-14 15:20:48.903928',2,'2024-05-13 20:00:00',0),(4,'upcoming',6,4,'Tôi bị ốm','2024-05-13 22:33:22.820724','2024-05-13 22:33:22.820724',1,'2024-05-15 10:00:00',0),(5,'completed',6,4,'Toi thay chong mat, hoi met moi 1 chut, can tu van','2024-05-18 11:22:34.841000','2024-05-19 12:04:05.401000',3,'2024-05-19 13:00:00',0.5),(6,'cancelled',6,1,'Tôi bị đau bụng, sốt cao 39 độ. Đau toàn thân','2024-05-26 17:03:17.329000','2024-05-26 17:03:17.329000',3,'2024-05-28 09:00:00',2),(7,'completed',6,4,'Tôi bị đau dâudld','2024-05-27 09:30:06.648000','2024-05-27 09:44:05.304000',3,'2024-05-28 09:30:00',0.5),(8,'completed',14,4,'A','2024-05-31 23:33:16.956000','2024-05-31 23:33:16.956000',1,'2024-06-02 08:00:00',0.5),(9,'completed',15,1,'Hi','2024-06-01 23:37:16.267000','2024-06-01 23:37:16.267000',1,'2024-06-03 07:00:00',0.5),(10,'completed',15,1,'Hi','2024-06-01 23:38:23.230000','2024-06-01 23:38:23.230000',1,'2024-06-03 07:00:00',0.5),(11,'completed',15,1,'','2024-06-02 00:08:22.716000','2024-06-02 00:08:22.716000',2,'2024-06-03 07:00:00',0.5),(12,'completed',14,4,'Toi đau đầu','2024-06-02 09:38:30.750000','2024-06-02 09:38:30.750000',2,'2024-06-03 10:00:00',0.5),(13,'upcoming',6,4,'Tôi bị om','2024-06-02 10:35:12.900806','2024-06-02 10:35:12.900806',1,'2024-06-03 11:00:00',0.5);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
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
