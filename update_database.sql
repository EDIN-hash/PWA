-- Добавляем новое поле ilosc (integer) в таблицу items
ALTER TABLE items ADD COLUMN ilosc INTEGER DEFAULT 0;

-- Обновляем существующие записи, чтобы перенести данные из quantity в ilosc
-- (если quantity содержит числовые значения)
UPDATE items SET ilosc = CAST(quantity AS INTEGER) WHERE quantity ~ '^[0-9]+$';

-- Очищаем quantity для записей, где оно было числовым
UPDATE items SET quantity = '' WHERE quantity ~ '^[0-9]+$';

-- Для категорий, где quantity должно быть разновидностью (например, Lodowki),
-- можно вручную обновить значения
-- Пример:
-- UPDATE items SET quantity = 'Двухкамерная' WHERE category = 'Lodowki' AND quantity = '';
