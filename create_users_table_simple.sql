-- SQL-запрос для создания таблицы пользователей
-- Соответствует требованиям кода в neon-client.js

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'spectator'
);

-- Создание индекса для ускорения поиска по username
CREATE INDEX idx_users_username ON users(username);

-- Комментарии к полям для документации
COMMENT ON TABLE users IS 'Таблица пользователей для системы аутентификации';
COMMENT ON COLUMN users.id IS 'Уникальный идентификатор пользователя';
COMMENT ON COLUMN users.username IS 'Уникальное имя пользователя для входа';
COMMENT ON COLUMN users.password IS 'Пароль пользователя (в реальном приложении должен быть хеширован)';
COMMENT ON COLUMN users.role IS 'Роль пользователя (spectator, user, admin, etc.)';

-- Примеры вставки тестовых пользователей
-- INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
-- INSERT INTO users (username, password, role) VALUES ('user1', 'password1', 'user');
-- INSERT INTO users (username, password, role) VALUES ('spectator', 'spectator123', 'spectator');