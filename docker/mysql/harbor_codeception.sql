CREATE DATABASE IF NOT EXISTS harbor_codeception CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
GRANT ALL ON harbor_codeception.* TO harbor@'%';
FLUSH PRIVILEGES;
