-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-12-2025 a las 21:53:40
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
-- Base de datos: `inventario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` enum('Activo','Inactivo') DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `estado`) VALUES
(5, 'Galletas', 'Galletasas', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` bigint(20) NOT NULL,
  `producto_nombre` varchar(100) NOT NULL,
  `tipo` enum('Ingreso','Salida') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `detalle` varchar(255) DEFAULT NULL,
  `proveedor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `producto_nombre`, `tipo`, `cantidad`, `fecha`, `detalle`, `proveedor`) VALUES
(12, 'Oreos Mangeku', 'Ingreso', 200, '2025-12-05 22:51:25', 'perfecta condicion', 'WhistonCandys');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` float DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `proveedor1` varchar(255) DEFAULT NULL,
  `proveedor2` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `categoria`, `proveedor1`, `proveedor2`) VALUES
(1, 'Oreos Mangeku', 'asasd', 15.99, 200, 'Galletas', 'WhistonCandys', 'Nestlé Perú'),
(3, 'Trululu Max', NULL, 5.99, 0, NULL, NULL, NULL),
(4, 'Chocolate Sublime', 'Tableta de chocolate con maní 30g', 2.5, 0, NULL, NULL, NULL),
(5, 'Inka Kola 500ml', 'Gaseosa peruana de sabor inconfundible', 3.5, 0, NULL, NULL, NULL),
(6, 'Cheetos Queso', 'Snack de maíz sabor queso 90g', 4.2, 0, NULL, NULL, NULL),
(7, 'Doritos Nacho', 'Snack triangular sabor nacho 100g', 5, 0, NULL, NULL, NULL),
(8, 'Agua San Luis 625ml', 'Agua mineral sin gas', 2, 0, NULL, NULL, NULL),
(9, 'Galletas Morochas', 'Galleta con cobertura de chocolate', 3, 0, NULL, NULL, NULL),
(10, 'Gomitas Trolli', 'Gomitas surtidas 100g', 4.5, 0, NULL, NULL, NULL),
(11, 'Pringles Original', 'Snack de papa sabor original', 7, 0, NULL, NULL, NULL),
(16, 'Monster energy', 'Bebida ', 19, 0, '', 'WhistonCandys', 'Nestlé Perú');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `nombre`, `contacto`, `telefono`) VALUES
(2, 'WhistonCandys', 'AV. Garcilazo Puno 789, Lima', '987267844'),
(3, 'Nestlé Perú', 'Av. Javier Prado 456, Lima', '987654321'),
(4, 'Coca Cola Perú', 'Av. Argentina 1200, Callao', '976543210'),
(5, 'FritoLay', 'Av. Industrial 789, Lima', '945123678'),
(6, 'Haribo', 'Av. Los Rosales 789, Arequipa', '954789123'),
(8, 'Monster Co.', 'Av. Principal 987, Lima', '978654321');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(120) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre`, `apellido`, `email`, `password`, `rol`) VALUES
(33, 'Patrick', 'Vera Jara', 'vera3@gmai.com', '$2a$10$177Wl2pltq0VC76VNnMmneNi79CC7nvnDnXA76H7KoVI8hqX4dKQ2', 'admin'),
(34, 'Ashton', 'Vera', 'vera@gmail.com', '$2a$10$AeHk6dDUi7XM5vuHXJbDdO.R0LC01E8pPvygAmhlfc9zsSpbtrVxG', 'admin'),
(35, 'Jeremy', 'Jara', 'vera2@gmail.com', '$2a$10$Tcjoy6mx8HEVvMQuB3ARcu2xnYBz53Fx4TkC0UnjNsTiR3oJ0XmpO', 'vendedor');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
