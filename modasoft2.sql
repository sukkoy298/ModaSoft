CREATE DATABASE modasoft2;
USE modasoft2;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-12-2025 a las 03:26:13
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `modasoft2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `catalogo_cuentas`
--

CREATE TABLE `catalogo_cuentas` (
  `id_cuenta` int(11) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` enum('DEBE','HABER') NOT NULL,
  `activa` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `catalogo_cuentas`
--

INSERT INTO `catalogo_cuentas` (`id_cuenta`, `codigo`, `nombre`, `tipo`, `activa`) VALUES
(1, '1.1.1', 'Caja', 'DEBE', 1),
(2, '1.1.2', 'Bancos', 'DEBE', 1),
(3, '1.1.3', 'Inventario', 'DEBE', 1),
(4, '1.1.4', 'Clientes', 'DEBE', 1),
(5, '2.1.1', 'Proveedores', 'HABER', 1),
(6, '2.1.2', 'IVA por Pagar', 'HABER', 1),
(7, '4.1.1', 'Ventas Ropa', 'HABER', 1),
(8, '5.1.1', 'Costo Ventas', 'DEBE', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, 'Camisas', 'Camisas de vestir', '2025-11-08 17:01:50', '2025-11-08 17:01:50'),
(2, 'Deportes', 'Todo tipo de ropa deportiva', '2025-11-08 17:41:15', '2025-11-08 17:41:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `cedula` varchar(30) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `tipo` varchar(10) NOT NULL COMMENT 'natural, jurídico, genérico',
  `fecha_registro` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_cliente`, `cedula`, `nombre`, `email`, `telefono`, `direccion`, `tipo`, `fecha_registro`, `created_at`, `updated_at`, `activo`) VALUES
(10, '20664895', 'Leo Torres', 'Leo@gmail.com', '04143849587', 'Barquisimeto Calle 37 carrera 35', 'Jurídico', '2025-12-08', '2025-12-09 02:12:00', '2025-12-09 02:12:00', 1),
(2, '23948576', 'Roberto Pérez', 'roberto@gmail.com', '04163847596', 'Barquisimeto Calle 38 carrera 31', 'Genérico', '2025-11-08', '2025-11-08 17:25:04', '2025-11-08 17:25:04', 1),
(9, '24867592', 'Camilo Hernandez', 'Camilo@gmail.com', '04168459384', 'Cabudare, Av. La Mata Calle 8', 'Natural', '2025-12-07', '2025-12-07 17:20:04', '2025-12-07 17:20:39', 1),
(1, '27586745', 'Carla Soto', 'carla@gmail.com', '04142837489', 'Barquisimeto Calle 57 carrera 32', 'Natural', '2025-11-08', '2025-11-08 16:58:26', '2025-11-08 16:58:26', 1),
(3, '29384758', 'Mario Soto', 'mario@gmail.com', '04241238866', 'Barquisimeto Calle 33 carrera 32', 'Natural', '2025-11-08', '2025-11-08 17:28:24', '2025-12-09 02:12:31', 1),
(5, '30998746', 'Angela Rodriguez', 'angela@gmail.com', '04241198374', 'Calle 34 carrera 29', 'Genérico', '2025-11-08', '2025-11-09 02:28:53', '2025-11-09 02:28:53', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id_compra` int(11) NOT NULL,
  `cedula_proveedor` varchar(30) NOT NULL,
  `fecha` date NOT NULL,
  `nro_factura` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(10,2) DEFAULT 0.00,
  `iva` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compra`
--

INSERT INTO `compra` (`id_compra`, `cedula_proveedor`, `fecha`, `nro_factura`, `total`, `id_usuario`, `created_at`, `updated_at`, `subtotal`, `iva`) VALUES
(2, '21003948', '2025-11-08', '0.00', 500.00, 1, '2025-11-08 21:01:51', '2025-11-08 21:01:51', 431.03, 68.97),
(3, '21003948', '2025-11-09', '0.00', 232.00, 1, '2025-11-25 21:36:03', '2025-11-25 21:36:03', 200.00, 32.00),
(20, '22003948', '2025-12-08', '1.00', 4.64, 1, '2025-12-08 22:01:31', '2025-12-08 22:01:31', 4.00, 0.64),
(21, '22003948', '2025-12-08', '002', 4.64, 1, '2025-12-08 22:04:52', '2025-12-08 22:04:52', 4.00, 0.64),
(22, '22003948', '2025-12-09', '3', 116.93, 1, '2025-12-09 02:05:07', '2025-12-09 02:05:07', 100.80, 16.13),
(23, '22003948', '2025-12-09', '5', 87.66, 1, '2025-12-09 02:24:29', '2025-12-09 02:24:29', 75.57, 12.09);

--
-- Disparadores `compra`
--
DELIMITER $$
CREATE TRIGGER `after_compra_insert` AFTER INSERT ON `compra` FOR EACH ROW BEGIN
    -- 1. Débito a Inventario
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_compra, id_usuario)
    VALUES (NEW.fecha, '1.1.3', CONCAT('Compra #', NEW.id_compra, ' - Mercancía'), NEW.subtotal, 0.00, NEW.id_compra, NEW.id_usuario);
    
    -- 2. Débito a IVA Crédito Fiscal
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_compra, id_usuario)
    VALUES (NEW.fecha, '2.1.2', CONCAT('IVA compra #', NEW.id_compra), NEW.iva, 0.00, NEW.id_compra, NEW.id_usuario);
    
    -- 3. Crédito a Proveedores
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_compra, id_usuario)
    VALUES (NEW.fecha, '2.1.1', CONCAT('Compra #', NEW.id_compra, ' - Proveedor'), 0.00, NEW.total, NEW.id_compra, NEW.id_usuario);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compra`
--

CREATE TABLE `detalle_compra` (
  `id_detallecompra` int(11) NOT NULL,
  `id_compra` int(11) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario_costo` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_compra`
--

INSERT INTO `detalle_compra` (`id_detallecompra`, `id_compra`, `id_variante`, `cantidad`, `precio_unitario_costo`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 10, 50.00, '2025-11-08 21:01:51', '2025-11-08 21:01:51'),
(18, 20, 1, 1, 4.00, '2025-12-08 22:01:31', '2025-12-08 22:01:31'),
(19, 21, 1, 1, 4.00, '2025-12-08 22:04:52', '2025-12-08 22:04:52'),
(20, 22, 1, 4, 25.20, '2025-12-09 02:05:07', '2025-12-09 02:05:07'),
(21, 23, 2, 3, 25.19, '2025-12-09 02:24:29', '2025-12-09 02:24:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_devolucion`
--

CREATE TABLE `detalle_devolucion` (
  `id_detalledevolucion` int(11) NOT NULL,
  `id_devolucion` int(11) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_devolucion`
--

INSERT INTO `detalle_devolucion` (`id_detalledevolucion`, `id_devolucion`, `id_variante`, `cantidad`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 1, '2025-11-08 21:02:46', '2025-11-08 21:02:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta`
--

CREATE TABLE `detalle_venta` (
  `id_detalleventa` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `id_metodo` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario_venta` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta`
--

INSERT INTO `detalle_venta` (`id_detalleventa`, `id_venta`, `id_variante`, `id_metodo`, `cantidad`, `precio_unitario_venta`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 1, 2, 29.99, '2025-11-08 20:00:32', '2025-11-08 20:00:32'),
(2, 3, 1, 1, 2, 35.99, '2025-11-09 02:26:24', '2025-11-09 02:26:24');

--
-- Disparadores `detalle_venta`
--
DELIMITER $$
CREATE TRIGGER `after_detalle_venta_insert` AFTER INSERT ON `detalle_venta` FOR EACH ROW BEGIN
    DECLARE costo_total DECIMAL(12,2);
    DECLARE id_usuario_venta INT;
    DECLARE costo_unitario_producto DECIMAL(10,2);
    
    -- Obtener usuario y costo
    SELECT v.id_usuario INTO id_usuario_venta FROM venta v WHERE v.id_venta = NEW.id_venta;
    SELECT vp.costo_unitario INTO costo_unitario_producto FROM variante_producto vp WHERE vp.id_variante = NEW.id_variante;
    
    -- Calcular costo total
    SET costo_total = NEW.cantidad * costo_unitario_producto;
    
    -- 4. Débito a Costo de Ventas
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_venta, id_usuario)
    VALUES (CURDATE(), '5.1.1', CONCAT('Costo venta #', NEW.id_venta), costo_total, 0.00, NEW.id_venta, id_usuario_venta);
    
    -- 5. Crédito a Inventario
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_venta, id_usuario)
    VALUES (CURDATE(), '1.1.3', CONCAT('Salida inventario venta #', NEW.id_venta), 0.00, costo_total, NEW.id_venta, id_usuario_venta);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devolucion`
--

CREATE TABLE `devolucion` (
  `id_devolucion` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `motivo` text DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `devolucion`
--

INSERT INTO `devolucion` (`id_devolucion`, `id_venta`, `fecha`, `motivo`, `id_usuario`, `created_at`, `updated_at`) VALUES
(2, 2, '2025-11-08', 'Producto defectuoso', 1, '2025-11-08 21:02:46', '2025-11-08 21:02:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL,
  `id_variante` int(11) NOT NULL,
  `tipo` varchar(20) NOT NULL COMMENT 'entrada, salida, ajuste, devolucion',
  `cantidad` int(11) NOT NULL,
  `stock_actual` int(11) NOT NULL,
  `stock_minimo` int(11) NOT NULL,
  `fecha_ultima_entrada` datetime NOT NULL,
  `referencia` varchar(100) DEFAULT NULL COMMENT 'ID de Compra/Venta/Devolución',
  `id_usuario` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id_inventario`, `id_variante`, `tipo`, `cantidad`, `stock_actual`, `stock_minimo`, `fecha_ultima_entrada`, `referencia`, `id_usuario`, `created_at`, `updated_at`) VALUES
(16, 2, 'entrada', 27, 30, 10, '2025-12-08 22:24:29', 'ajuste_manual', 1, '2025-11-08 19:23:49', '2025-11-08 19:23:49'),
(17, 1, 'entrada', 10, 15, 10, '2025-12-08 22:05:07', 'compra_2', 1, '2025-11-08 21:01:51', '2025-11-08 21:01:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_marca` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id_marca`, `nombre`, `created_at`, `updated_at`) VALUES
(1, 'Puma', '2025-11-08 17:01:56', '2025-11-08 17:01:56'),
(2, 'Adidas', '2025-11-08 17:38:42', '2025-11-08 17:38:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id_metodopago` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `codigo` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id_metodopago`, `nombre`, `codigo`, `created_at`, `updated_at`) VALUES
(1, 'Efectivo', 1.00, '2025-11-08 19:57:22', '2025-11-08 19:57:22'),
(2, 'Tarjeta Débito', 2.00, '2025-11-08 19:57:35', '2025-11-08 19:57:35'),
(3, 'Tarjeta Crédito', 3.00, '2025-11-08 19:57:42', '2025-11-08 19:57:42'),
(4, 'Transferencia', 4.00, '2025-11-08 19:57:47', '2025-11-08 19:57:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_contables`
--

CREATE TABLE `movimientos_contables` (
  `id_movimiento` int(11) NOT NULL,
  `fecha_movimiento` date NOT NULL,
  `codigo_cuenta` varchar(10) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `debe` decimal(12,2) DEFAULT 0.00,
  `haber` decimal(12,2) DEFAULT 0.00,
  `id_venta` int(11) DEFAULT NULL,
  `id_compra` int(11) DEFAULT NULL,
  `id_devolucion` int(11) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos_contables`
--

INSERT INTO `movimientos_contables` (`id_movimiento`, `fecha_movimiento`, `codigo_cuenta`, `descripcion`, `debe`, `haber`, `id_venta`, `id_compra`, `id_devolucion`, `id_usuario`, `created_at`) VALUES
(1, '2025-11-08', '1.1.1', 'Venta ID 3 - Cliente Carla Soto', 47.86, 0.00, 3, NULL, NULL, 4, '2025-11-25 21:17:11'),
(2, '2025-11-08', '4.1.1', 'Venta ID 3 - Base imponible', 0.00, 41.26, 3, NULL, NULL, 4, '2025-11-25 21:17:11'),
(3, '2025-11-08', '2.1.2', 'IVA Venta ID 3', 0.00, 6.60, 3, NULL, NULL, 4, '2025-11-25 21:17:11'),
(4, '2025-11-09', '1.1.1', 'Venta de productos', 100.00, 0.00, 4, NULL, NULL, 1, '2025-11-25 21:38:23'),
(5, '2025-11-09', '4.1.1', 'Ingreso por venta', 0.00, 86.21, 4, NULL, NULL, 1, '2025-11-25 21:38:23'),
(6, '2025-11-09', '2.1.2', 'IVA venta', 0.00, 13.79, 4, NULL, NULL, 1, '2025-11-25 21:38:23'),
(7, '2025-11-08', '1.1.1', 'Venta #2 - Cliente Mario Soto', 59.98, 0.00, 2, NULL, NULL, 1, '2025-11-25 23:01:02'),
(8, '2025-11-08', '4.1.1', 'Ingreso por venta #2', 0.00, 51.71, 2, NULL, NULL, 1, '2025-11-25 23:01:02'),
(9, '2025-11-08', '2.1.2', 'IVA venta #2', 0.00, 8.27, 2, NULL, NULL, 1, '2025-11-25 23:01:02'),
(10, '2025-11-08', '1.1.3', 'Compra #2 - Mercancía', 431.03, 0.00, NULL, 2, NULL, 1, '2025-11-25 23:01:02'),
(11, '2025-11-08', '2.1.2', 'IVA compra #2', 68.97, 0.00, NULL, 2, NULL, 1, '2025-11-25 23:01:02'),
(12, '2025-11-08', '2.1.1', 'Compra #2 - Proveedor', 0.00, 500.00, NULL, 2, NULL, 1, '2025-11-25 23:01:02'),
(13, '2025-11-09', '1.1.3', 'Compra #3 - Mercancía', 200.00, 0.00, NULL, 3, NULL, 1, '2025-11-25 23:01:03'),
(14, '2025-11-09', '2.1.2', 'IVA compra #3', 32.00, 0.00, NULL, 3, NULL, 1, '2025-11-25 23:01:03'),
(15, '2025-11-09', '2.1.1', 'Compra #3 - Proveedor', 0.00, 232.00, NULL, 3, NULL, 1, '2025-11-25 23:01:03'),
(64, '2025-12-08', '1.1.3', 'Compra #20 - Mercancía', 4.00, 0.00, NULL, 20, NULL, 1, '2025-12-08 22:01:31'),
(65, '2025-12-08', '2.1.2', 'IVA compra #20', 0.64, 0.00, NULL, 20, NULL, 1, '2025-12-08 22:01:31'),
(66, '2025-12-08', '2.1.1', 'Compra #20 - Proveedor', 0.00, 4.64, NULL, 20, NULL, 1, '2025-12-08 22:01:31'),
(67, '2025-12-08', '1.1.3', 'Compra #21 - Mercancía', 4.00, 0.00, NULL, 21, NULL, 1, '2025-12-08 22:04:52'),
(68, '2025-12-08', '2.1.2', 'IVA compra #21', 0.64, 0.00, NULL, 21, NULL, 1, '2025-12-08 22:04:52'),
(69, '2025-12-08', '2.1.1', 'Compra #21 - Proveedor', 0.00, 4.64, NULL, 21, NULL, 1, '2025-12-08 22:04:52'),
(70, '2025-12-09', '1.1.3', 'Compra #22 - Mercancía', 100.80, 0.00, NULL, 22, NULL, 1, '2025-12-09 02:05:07'),
(71, '2025-12-09', '2.1.2', 'IVA compra #22', 16.13, 0.00, NULL, 22, NULL, 1, '2025-12-09 02:05:07'),
(72, '2025-12-09', '2.1.1', 'Compra #22 - Proveedor', 0.00, 116.93, NULL, 22, NULL, 1, '2025-12-09 02:05:07'),
(73, '2025-12-09', '1.1.3', 'Compra #23 - Mercancía', 75.57, 0.00, NULL, 23, NULL, 1, '2025-12-09 02:24:29'),
(74, '2025-12-09', '2.1.2', 'IVA compra #23', 12.09, 0.00, NULL, 23, NULL, 1, '2025-12-09 02:24:29'),
(75, '2025-12-09', '2.1.1', 'Compra #23 - Proveedor', 0.00, 87.66, NULL, 23, NULL, 1, '2025-12-09 02:24:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_categoria` int(11) NOT NULL,
  `id_marca` int(11) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `descripcion`, `id_categoria`, `id_marca`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Camisa Clásica de Algodón', 'Camisa de vestir Nyke', 1, 1, 1, '2025-11-08 17:02:30', '2025-11-08 17:02:30'),
(2, 'Zapatos Running', 'Zapatos para correr', 1, 1, 1, '2025-11-08 17:44:57', '2025-11-08 17:44:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `doc_identidad` varchar(30) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`doc_identidad`, `nombre`, `telefono`, `email`, `direccion`, `created_at`, `updated_at`) VALUES
('21003948', 'Distribuidora Moda S.A.', '04248875968', 'contacto@distribuidora.com', 'Av. Principal 456', '2025-11-08 19:08:05', '2025-11-08 19:08:05'),
('22003948', 'Distribuidora Moda S.A.', '04248875968', 'contacto@distribuidora.com', 'Av. Principal 456', '2025-11-10 02:55:25', '2025-11-10 02:55:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_usuario`
--

CREATE TABLE `rol_usuario` (
  `id_rol` int(11) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol_usuario`
--

INSERT INTO `rol_usuario` (`id_rol`, `rol`, `created_at`, `updated_at`) VALUES
(1, 'Administrador', '2025-11-08 19:00:11', '2025-11-08 19:00:11'),
(2, 'Vendedor', '2025-11-08 19:00:33', '2025-11-08 19:00:33'),
(3, 'Almacen', '2025-11-08 19:00:41', '2025-11-08 19:00:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `usuario`, `password_hash`, `id_rol`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, '2025-11-08 19:23:36', '2025-11-08 19:23:36'),
(2, 'vendedor1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, '2025-11-08 19:00:54', '2025-11-08 19:00:54'),
(3, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, '2025-11-08 19:22:28', '2025-11-08 19:22:28'),
(4, 'Manuel', '$2b$10$xIx08mzUe78GoTk/RcW7au/yfomLc1LN/rFEEVmDj/rsYmoKAEiNS', 2, '2025-11-09 01:33:25', '2025-11-09 22:53:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `variante_producto`
--

CREATE TABLE `variante_producto` (
  `id_variante` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `talla` varchar(15) NOT NULL,
  `color` varchar(50) NOT NULL,
  `codigo_barras` varchar(50) NOT NULL,
  `precio_unitario_venta` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `costo_unitario` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `variante_producto`
--

INSERT INTO `variante_producto` (`id_variante`, `id_producto`, `talla`, `color`, `codigo_barras`, `precio_unitario_venta`, `created_at`, `updated_at`, `costo_unitario`) VALUES
(1, 1, 'M', 'Blanco', 'C001-BL-M', 35.99, '2025-11-08 17:02:41', '2025-11-08 17:02:41', 25.00),
(2, 1, '42', 'Negro', 'ZAP-RUN-42', 89.99, '2025-11-08 17:45:21', '2025-11-08 17:45:21', 45.00),
(3, 1, '42', 'Negro', 'ZAP-RUN-42', 89.99, '2025-11-08 18:09:52', '2025-11-08 18:09:52', 45.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id_venta` int(11) NOT NULL,
  `cedula_cliente` varchar(30) NOT NULL,
  `fecha` date NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `estado` varchar(15) NOT NULL COMMENT 'pagada, pendiente, anulada',
  `id_usuario` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `subtotal` decimal(10,2) DEFAULT 0.00,
  `iva` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`id_venta`, `cedula_cliente`, `fecha`, `total`, `estado`, `id_usuario`, `created_at`, `updated_at`, `subtotal`, `iva`) VALUES
(2, '29384758', '2025-11-08', 59.98, 'pagada', 1, '2025-11-08 20:00:32', '2025-11-08 20:00:32', 51.71, 8.27),
(3, '27586745', '2025-11-08', 47.86, 'pagada', 4, '2025-11-09 02:26:24', '2025-11-09 02:26:24', 41.26, 6.60),
(4, '27586745', '2025-11-09', 116.00, 'pagada', 1, '2025-11-25 21:36:03', '2025-11-25 21:36:03', 100.00, 16.00);

--
-- Disparadores `venta`
--
DELIMITER $$
CREATE TRIGGER `after_venta_insert` AFTER INSERT ON `venta` FOR EACH ROW BEGIN
    -- 1. Débito a Caja
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_venta, id_usuario)
    VALUES (NEW.fecha, '1.1.1', CONCAT('Venta #', NEW.id_venta, ' - Cliente'), NEW.total, 0.00, NEW.id_venta, NEW.id_usuario);
    
    -- 2. Crédito a Ventas
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_venta, id_usuario)
    VALUES (NEW.fecha, '4.1.1', CONCAT('Ingreso por venta #', NEW.id_venta), 0.00, NEW.subtotal, NEW.id_venta, NEW.id_usuario);
    
    -- 3. Crédito a IVA por Pagar
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_venta, id_usuario)
    VALUES (NEW.fecha, '2.1.2', CONCAT('IVA venta #', NEW.id_venta), 0.00, NEW.iva, NEW.id_venta, NEW.id_usuario);
END
$$
DELIMITER ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `catalogo_cuentas`
--
ALTER TABLE `catalogo_cuentas`
  ADD PRIMARY KEY (`id_cuenta`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`cedula`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `cedula_proveedor` (`cedula_proveedor`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD PRIMARY KEY (`id_detallecompra`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_variante` (`id_variante`);

--
-- Indices de la tabla `detalle_devolucion`
--
ALTER TABLE `detalle_devolucion`
  ADD PRIMARY KEY (`id_detalledevolucion`),
  ADD KEY `id_devolucion` (`id_devolucion`),
  ADD KEY `id_variante` (`id_variante`);

--
-- Indices de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD PRIMARY KEY (`id_detalleventa`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_variante` (`id_variante`),
  ADD KEY `id_metodo` (`id_metodo`);

--
-- Indices de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD PRIMARY KEY (`id_devolucion`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD KEY `id_variante` (`id_variante`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id_marca`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id_metodopago`);

--
-- Indices de la tabla `movimientos_contables`
--
ALTER TABLE `movimientos_contables`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `codigo_cuenta` (`codigo_cuenta`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_compra` (`id_compra`),
  ADD KEY `id_devolucion` (`id_devolucion`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_marca` (`id_marca`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`doc_identidad`);

--
-- Indices de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `id_rol` (`id_rol`);

--
-- Indices de la tabla `variante_producto`
--
ALTER TABLE `variante_producto`
  ADD PRIMARY KEY (`id_variante`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `cedula_cliente` (`cedula_cliente`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `catalogo_cuentas`
--
ALTER TABLE `catalogo_cuentas`
  MODIFY `id_cuenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  MODIFY `id_detallecompra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `detalle_devolucion`
--
ALTER TABLE `detalle_devolucion`
  MODIFY `id_detalledevolucion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  MODIFY `id_detalleventa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `id_devolucion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id_metodopago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `movimientos_contables`
--
ALTER TABLE `movimientos_contables`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `rol_usuario`
--
ALTER TABLE `rol_usuario`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `variante_producto`
--
ALTER TABLE `variante_producto`
  MODIFY `id_variante` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`cedula_proveedor`) REFERENCES `proveedor` (`doc_identidad`),
  ADD CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `detalle_compra`
--
ALTER TABLE `detalle_compra`
  ADD CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`),
  ADD CONSTRAINT `detalle_compra_ibfk_2` FOREIGN KEY (`id_variante`) REFERENCES `variante_producto` (`id_variante`);

--
-- Filtros para la tabla `detalle_devolucion`
--
ALTER TABLE `detalle_devolucion`
  ADD CONSTRAINT `detalle_devolucion_ibfk_1` FOREIGN KEY (`id_devolucion`) REFERENCES `devolucion` (`id_devolucion`),
  ADD CONSTRAINT `detalle_devolucion_ibfk_2` FOREIGN KEY (`id_variante`) REFERENCES `variante_producto` (`id_variante`);

--
-- Filtros para la tabla `detalle_venta`
--
ALTER TABLE `detalle_venta`
  ADD CONSTRAINT `detalle_venta_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  ADD CONSTRAINT `detalle_venta_ibfk_2` FOREIGN KEY (`id_variante`) REFERENCES `variante_producto` (`id_variante`),
  ADD CONSTRAINT `detalle_venta_ibfk_3` FOREIGN KEY (`id_metodo`) REFERENCES `metodo_pago` (`id_metodopago`);

--
-- Filtros para la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD CONSTRAINT `devolucion_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  ADD CONSTRAINT `devolucion_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_variante`) REFERENCES `variante_producto` (`id_variante`),
  ADD CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `movimientos_contables`
--
ALTER TABLE `movimientos_contables`
  ADD CONSTRAINT `movimientos_contables_ibfk_1` FOREIGN KEY (`codigo_cuenta`) REFERENCES `catalogo_cuentas` (`codigo`),
  ADD CONSTRAINT `movimientos_contables_ibfk_2` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  ADD CONSTRAINT `movimientos_contables_ibfk_3` FOREIGN KEY (`id_compra`) REFERENCES `compra` (`id_compra`),
  ADD CONSTRAINT `movimientos_contables_ibfk_4` FOREIGN KEY (`id_devolucion`) REFERENCES `devolucion` (`id_devolucion`),
  ADD CONSTRAINT `movimientos_contables_ibfk_5` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`),
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`id_marca`) REFERENCES `marca` (`id_marca`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol_usuario` (`id_rol`);

--
-- Filtros para la tabla `variante_producto`
--
ALTER TABLE `variante_producto`
  ADD CONSTRAINT `variante_producto_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`cedula_cliente`) REFERENCES `cliente` (`cedula`),
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;