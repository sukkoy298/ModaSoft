-- Eliminar triggers existentes si los hay
DROP TRIGGER IF EXISTS after_compra_insert;
DROP TRIGGER IF EXISTS after_detalle_venta_insert;
DROP TRIGGER IF EXISTS after_venta_insert;

-- Cambiar delimitador temporalmente para MariaDB
DELIMITER //

-- Trigger para compras
CREATE TRIGGER after_compra_insert 
AFTER INSERT ON compra
FOR EACH ROW
BEGIN
    -- 1. Débito a Inventario
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_compra, id_usuario)
    VALUES (NEW.fecha, '1.1.3', CONCAT('Compra #', NEW.id_compra, ' - Mercancía'), NEW.subtotal, 0.00, NEW.id_compra, NEW.id_usuario);
    
    -- 2. Débito a IVA Crédito Fiscal
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_compra, id_usuario)
    VALUES (NEW.fecha, '2.1.2', CONCAT('IVA compra #', NEW.id_compra), NEW.iva, 0.00, NEW.id_compra, NEW.id_usuario);
    
    -- 3. Crédito a Proveedores
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_compra, id_usuario)
    VALUES (NEW.fecha, '2.1.1', CONCAT('Compra #', NEW.id_compra, ' - Proveedor'), 0.00, NEW.total, NEW.id_compra, NEW.id_usuario);
END//

-- Trigger para ventas
CREATE TRIGGER after_venta_insert 
AFTER INSERT ON venta
FOR EACH ROW
BEGIN
    -- 1. Débito a Caja
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_venta, id_usuario)
    VALUES (NEW.fecha, '1.1.1', CONCAT('Venta #', NEW.id_venta, ' - Cliente'), NEW.total, 0.00, NEW.id_venta, NEW.id_usuario);
    
    -- 2. Crédito a Ventas
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_venta, id_usuario)
    VALUES (NEW.fecha, '4.1.1', CONCAT('Ingreso por venta #', NEW.id_venta), 0.00, NEW.subtotal, NEW.id_venta, NEW.id_usuario);
    
    -- 3. Crédito a IVA por Pagar
    INSERT INTO movimientos_contables (fecha_movimiento, codigo_cuenta, descripcion, debe, haber, id_venta, id_usuario)
    VALUES (NEW.fecha, '2.1.2', CONCAT('IVA venta #', NEW.id_venta), 0.00, NEW.iva, NEW.id_venta, NEW.id_usuario);
END//

-- Trigger para detalle de ventas (costo de ventas)
CREATE TRIGGER after_detalle_venta_insert 
AFTER INSERT ON detalle_venta
FOR EACH ROW
BEGIN
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
END//

-- Restaurar delimitador
DELIMITER ;