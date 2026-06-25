/*
  Warnings:

  - A unique constraint covering the columns `[user_id,variant_id]` on the table `carts` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variant_id` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `carts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `carts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_ibfk_1`;

-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_ibfk_2`;

-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_ibfk_3`;

-- AlterTable
ALTER TABLE `carts` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `product_id` INTEGER NOT NULL,
    MODIFY `variant_id` INTEGER NOT NULL,
    MODIFY `quantity` INTEGER NOT NULL DEFAULT 1,
    MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updated_at` DATETIME(0) NOT NULL;

-- CreateTable
CREATE TABLE `email_otps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `otp_hash` VARCHAR(255) NOT NULL,
    `type` ENUM('register', 'reset_password') NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,
    `consumed` BOOLEAN NOT NULL DEFAULT false,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `email_otps_email_type_idx`(`email`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `uniq_user_variant` ON `carts`(`user_id`, `variant_id`);

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
