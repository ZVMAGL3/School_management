/*
SQLyog Ultimate v10.00 Beta1
MySQL - 5.5.36 : Database - user
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`user` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `user`;

/*Table structure for table `comment` */

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `id` bigint(20) NOT NULL,
  `account` varchar(128) NOT NULL,
  `content` text NOT NULL,
  `messageBoardId` bigint(20) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `replyTo` varchar(128) DEFAULT NULL,
  KEY `message_board_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `comment` */

insert  into `comment`(`id`,`account`,`content`,`messageBoardId`,`time`,`replyTo`) values (1,'20220000','这是一条回复',106,'2023-04-20 01:59:02',''),(1,'20220000','这是一条回复',107,'2023-04-20 02:04:47',''),(2,'20220000','这是一条回复',107,'2023-04-20 02:05:00','20220000'),(2,'20220001','这是一条学生回复',106,'2023-05-25 22:21:26','20220000');

/*Table structure for table `homepage` */

DROP TABLE IF EXISTS `homepage`;

CREATE TABLE `homepage` (
  `account` varchar(128) NOT NULL,
  `signature` varchar(128) DEFAULT '',
  `emaliAddress` varchar(128) DEFAULT '',
  `selfIntroduction` varchar(512) DEFAULT '',
  `campusExperience` varchar(512) DEFAULT '',
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `homepage` */

insert  into `homepage`(`account`,`signature`,`emaliAddress`,`selfIntroduction`,`campusExperience`) values ('1','生活趋于平淡,趋于美好.','1669545001@qq.com','',''),('20220000','开心最重要~','1669545001@qq.com','热爱前端开发领域，在校期间积累了一定数量中小型项目开发经验。对Vue、React等主流框架有一定的了解和使用经验。逻辑分析能力强，善于沟通协作。具备较强的学习能力。  ',''),('20220002','为中华之崛起而读书!','','','');

/*Table structure for table `message_board` */

DROP TABLE IF EXISTS `message_board`;

CREATE TABLE `message_board` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `account` varchar(128) DEFAULT NULL,
  `userMessage` text CHARACTER SET utf8mb4,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `commentCount` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8;

/*Data for the table `message_board` */

insert  into `message_board`(`id`,`account`,`userMessage`,`time`,`commentCount`) values (106,'20220000','这是一条留言','2023-05-25 22:21:26',2),(107,'20220000','这是一条留言','2023-04-20 02:05:00',2);

/*Table structure for table `result` */

DROP TABLE IF EXISTS `result`;

CREATE TABLE `result` (
  `account` varchar(128) NOT NULL,
  `userName` varchar(128) NOT NULL,
  `chineseScore` float DEFAULT '0',
  `mathScore` float DEFAULT '0',
  `englishScore` float DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `result` */

insert  into `result`(`account`,`userName`,`chineseScore`,`mathScore`,`englishScore`) values ('20220001','张三',63,81,63),('20220002','李四',45,25,78),('20220003','王五',66,99,99),('20220004','赵六',77,69,80),('20220005','李芬芬',90,86,79),('20220006','刘菲菲',98,86,54),('20220007','冉冰',50,100,43),('20220008','凌菲菲',81,52,49),('20220009','朱冰冰',48,69,83),('20220010','绯红红',95,40,85),('20220011','李倩倩',63,80,66),('20220012','王成玉',45,95,47),('20220013','尤动',68,44,65),('20220014','林芬芬',89,98,82),('20220015','胡玉成',53,83,91),('20220016','上官云阙',53,95,48),('20220017','胡冰',84,63,51),('20220018','简自卑',88,84,92),('20220019','方家俊',47,90,80),('20220020','李莹莹',80,43,67),('20220021','王杰',84,44,75),('20220022','孙文',42,61,60),('20220023','雯雯',89,47,73),('20220024','卢冰',73,54,75),('20220025','周川',94,64,70),('20220026','解江',100,83,55),('20220027','林嘉荣',91,82,98),('20220028','周星驰',76,41,52),('20220029','王静',71,91,52),('20220030','欧阳风',91,50,73),('20220031','世峰',73,91,97),('20220032','李华',87,82,69),('20220033','小红',99,74,85),('20220034','小明',41,61,78),('20220035','小刚',97,76,74),('20220036','小李',99,63,78),('20220037','小东',76,88,96),('20220038','小王',41,52,61),('20220039','王四',53,45,79),('20220040','王力',65,97,70);

/*Table structure for table `user_password` */

DROP TABLE IF EXISTS `user_password`;

CREATE TABLE `user_password` (
  `account` varchar(128) NOT NULL,
  `userName` varchar(128) NOT NULL DEFAULT '111',
  `password` varchar(128) NOT NULL DEFAULT '123456',
  `identity` varchar(63) NOT NULL DEFAULT 'student',
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_password` */

insert  into `user_password`(`account`,`userName`,`password`,`identity`) values ('1','1','123456','admin'),('1669545001','X_sir','WJ5XJJ21','teacher'),('20220000','ZVMAGL3','WJ5XJJ21','admin'),('20220001','张三','123456','student'),('20220002','李四','123456','student'),('20220003','王五','123456','student'),('20220004','赵六','123456','student'),('20220005','李芬芬','123456','student'),('20220006','刘菲菲','123456','student'),('20220007','冉冰','123456','student'),('20220008','凌菲菲','123456','student'),('20220009','朱冰冰','123456','student'),('20220010','绯红红','123456','student'),('20220011','李倩倩','123456','student'),('20220012','王成玉','123456','student'),('20220013','尤动','123456','student'),('20220014','林芬芬','123456','student'),('20220015','胡玉成','123456','student'),('20220016','上官云阙','123456','student'),('20220017','胡冰','123456','student'),('20220018','简自卑','123456','student'),('20220019','方家俊','123456','student'),('20220020','李莹莹','123456','student'),('20220021','王杰','123456','student'),('20220022','孙文','123456','student'),('20220023','雯雯','123456','student'),('20220024','卢冰','123456','student'),('20220025','周川','123456','student'),('20220026','解江','123456','student'),('20220027','林嘉荣','123456','student'),('20220028','周星驰','123456','student'),('20220029','王静','123456','student'),('20220030','欧阳风','123456','student'),('20220031','世峰','123456','student'),('20220032','李华','123456','student'),('20220033','小红','123456','student'),('20220034','小明','123456','student'),('20220035','小刚','123456','student'),('20220036','小李','123456','student'),('20220037','小东','123456','student'),('20220038','小王','123456','student'),('20220039','王四','123456','student'),('20220040','王力','123456','student');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
