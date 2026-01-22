-- SQL-запрос для создания таблицы пользователей
-- Необходимо для системы логинов и регистрации

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(100),
    reset_token VARCHAR(100),
    reset_token_expires TIMESTAMP WITH TIME ZONE
);

-- Создание индексов для ускорения поиска
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Комментарии к полям для документации
COMMENT ON TABLE users IS 'Таблица пользователей для системы аутентификации и авторизации';
COMMENT ON COLUMN users.id IS 'Уникальный идентификатор пользователя';
COMMENT ON COLUMN users.username IS 'Уникальное имя пользователя для входа';
COMMENT ON COLUMN users.email IS 'Уникальный email пользователя';
COMMENT ON COLUMN users.password_hash IS 'Хеш пароля (никогда не хранить пароли в открытом виде)';
COMMENT ON COLUMN users.role IS 'Роль пользователя (user, admin, etc.)';
COMMENT ON COLUMN users.is_active IS 'Флаг активности аккаунта';
COMMENT ON COLUMN users.email_verified IS 'Флаг верификации email';
COMMENT ON COLUMN users.verification_token IS 'Токен для верификации email';
COMMENT ON COLUMN users.reset_token IS 'Токен для сброса пароля';
COMMENT ON COLUMN users.reset_token_expires IS 'Срок действия токена сброса пароля';

-- Пример вставки тестового пользователя (для разработки)
-- INSERT INTO users (username, email, password_hash, first_name, last_name, role)
-- VALUES ('admin', 'admin@example.com', '$2a$10$somehashedpassword', 'Admin', 'User', 'admin');