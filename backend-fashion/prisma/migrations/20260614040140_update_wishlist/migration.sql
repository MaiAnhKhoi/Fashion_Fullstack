/*
  Warnings:

  - You are about to drop the column `variant_id` on the `wishlists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,product_id]` on the table `wishlists` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `wishlists` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `wishlists` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `wishlists` DROP FOREIGN KEY `wishlists_ibfk_1`;

-- DropForeignKey
ALTER TABLE `wishlists` DROP FOREIGN KEY `wishlists_ibfk_2`;

-- DropForeignKey
ALTER TABLE `wishlists` DROP FOREIGN KEY `wishlists_ibfk_3`;

-- DropIndex
DROP INDEX `variant_id` ON `wishlists`;

-- AlterTable
ALTER TABLE `wishlists` DROP COLUMN `variant_id`,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `product_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `wishlists_user_id_product_id_key` ON `wishlists`(`user_id`, `product_id`);

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
