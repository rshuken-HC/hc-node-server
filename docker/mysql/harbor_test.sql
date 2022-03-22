CREATE DATABASE IF NOT EXISTS harbor_test CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
GRANT ALL ON harbor_test.* TO harbor@'%';
FLUSH PRIVILEGES;
