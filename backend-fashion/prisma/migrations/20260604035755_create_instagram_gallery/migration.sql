-- CreateTable
CREATE TABLE `instagram_gallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image_url` TEXT NOT NULL,
    `caption` TEXT NULL,
    `instagram_url` TEXT NULL,
    `username` VARCHAR(100) NULL,
    `likes_count` INTEGER NOT NULL DEFAULT 0,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `instagram_gallery_products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gallery_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `instagram_gallery_products_gallery_id_idx`(`gallery_id`),
    INDEX `instagram_gallery_products_product_id_idx`(`product_id`),
    UNIQUE INDEX `instagram_gallery_products_gallery_id_product_id_key`(`gallery_id`, `product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `instagram_gallery_products` ADD CONSTRAINT `instagram_gallery_products_gallery_id_fkey` FOREIGN KEY (`gallery_id`) REFERENCES `instagram_gallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instagram_gallery_products` ADD CONSTRAINT `instagram_gallery_products_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
