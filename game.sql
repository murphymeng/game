-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 27, 2014 at 03:42 PM
-- Server version: 5.1.53
-- PHP Version: 5.3.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `game`
--

-- --------------------------------------------------------

--
-- Table structure for table `cards`
--

CREATE TABLE IF NOT EXISTS `cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `name` varchar(55) NOT NULL,
  `type` varchar(55) NOT NULL,
  `class` varchar(55) NOT NULL,
  `img` varchar(55) NOT NULL,
  `MD` int(11) NOT NULL COMMENT '移动距离',
  `AT` int(11) NOT NULL COMMENT '攻击力',
  `AD` int(11) NOT NULL COMMENT '攻击距离',
  `HP` int(11) NOT NULL COMMENT '血',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `cards`
--

INSERT INTO `cards` (`id`, `uid`, `name`, `type`, `class`, `img`, `MD`, `AT`, `AD`, `HP`, `create_time`) VALUES
(1, 0, 'bubing', 'B', 'bubing', 'bubing.png', 1, 3, 1, 10, '2014-04-26 16:05:35'),
(2, 0, 'archer', 'G', 'archer', 'archer.png', 1, 3, 3, 10, '2014-04-26 16:05:35'),
(3, 0, 'qibing', 'Q', 'qibing', 'qibing.png', 1, 3, 1, 10, '2014-04-26 16:07:09'),
(4, 1, 'archer', 'G', 'archer', 'archer.png', 2, 2, 2, 10, '2014-04-27 20:18:26');

-- --------------------------------------------------------

--
-- Table structure for table `card_groups`
--

CREATE TABLE IF NOT EXISTS `card_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `cards` varchar(255) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `card_groups`
--

INSERT INTO `card_groups` (`id`, `uid`, `cards`, `create_time`) VALUES
(1, 1, '1,2,3', '2014-04-26 16:18:20'),
(2, 2, '1,2,3', '2014-04-26 16:18:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(55) NOT NULL,
  `password` varchar(55) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `create_time`) VALUES
(1, 'murphy', '111', '2014-04-26 16:19:07'),
(2, 'merlin', '111', '2014-04-26 16:19:07');

-- --------------------------------------------------------

--
-- Table structure for table `user_card`
--

CREATE TABLE IF NOT EXISTS `user_card` (
  `uid` int(11) NOT NULL,
  `cid` int(11) NOT NULL,
  PRIMARY KEY (`uid`,`cid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_card`
--

INSERT INTO `user_card` (`uid`, `cid`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 2),
(2, 3);
