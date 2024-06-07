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
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'Doctor Trường','2000-01-01',1,'+84362213123','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/avatar/avatar-of-Doctor Trng-1717261306283','Hoàng Mai, Hà Nội',8,1,'2024-04-13 14:35:57.482241','2024-06-02 00:01:45.000000','Bạch Mai',10,'Dr. Truongt is a board-certified pediatrician with over 15 years of experience. She is passionate about providing comprehensive and compassionate care to children of all ages. Dr. Carter has a special interest in preventive medicine, child development, and adolescent health. She is dedicated to building strong relationships with her patients and their families and believes in empowering parents to make informed decisions about their children\'s health. ','07:00:00','20:00:00','monday','friday'),(2,'Doctor Hoàng Anh','2000-01-02',2,'+84362213123','https://i.pinimg.com/564x/b0/f3/61/b0f361e9e26d27c62e38b350e4737d71.jpg','Hoàng Mai, Hà Nội',10,2,'2024-04-13 14:35:57.482241','2024-05-03 15:28:43.150963','Việt Đức',5,'Dr. Hoang Anh is a board-certified pediatrician with over 15 years of experience. She is passionate about providing comprehensive and compassionate care to children of all ages. Dr. Carter has a special interest in preventive medicine, child development, and adolescent health. She is dedicated to building strong relationships with her patients and their families and believes in empowering parents to make informed decisions about their children\'s health. ','07:00:00','20:00:00','monday','friday'),(4,'Dr. Ngọc Quyên ','2000-05-27',2,'+84737264727','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/avatar/avatar-of-Dr. Ngc Quyn -1717261206767','Cầu giấy, Hà Nội ',15,4,'2024-05-13 22:26:13.221885','2024-06-02 00:00:07.000000','Việt Đức ',1,'Là một bác sĩ mới ra trường. Tôi mong muốn có thể giúp đỡ nhiều bệnh nhât nhất càng tốt ?','08:00:00','17:00:00','monday','friday'),(6,'Hoàng Đỗ Anh','1995-06-01',1,'+84938478382','https://doctor-appointment-bucket.s3.ap-southeast-1.amazonaws.com/avatar/avatar-of-ngoctruongworks-1717260906876','Hai Bà Trưng, Cầu Giấy, Hà Nội',23,6,'2024-05-27 10:17:45.692496','2024-06-01 23:58:05.000000','Bạch Mai',4,'Là một bác sĩ với 4 năm kinh nghiệm. Tôi mong muốn sẽ hỗ trợ được nhiều bệnh nhân trên ứng dụng này ?','08:00:00','17:00:00','monday','friday');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
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
