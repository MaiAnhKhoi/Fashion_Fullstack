import {
  products_status,
  orders_status,
  orders_payment_status,
  payments_status,
  payments_method,
  shipments_status,
  coupons_type,
  inventory_logs_type,
  review_media_type,
  page_group,
  page_section_type,
} from "../generated/prisma/enums";
import { faker } from "@faker-js/faker";
import { prisma } from "@/config/prisma.config";

export default async function seedData() {
  console.log("🌱 Start seeding...");

  // Add your cleanup here if needed

  // Brands
  const brands = [];
  for (const name of [
    "Nike",
    "Adidas",
    "Puma",
    "Converse",
    "Vans",
    "New Balance",
  ]) {
    brands.push(
      await prisma.brands.create({
        data: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      }),
    );
  }

  // Colors
  const colors = [];
  for (const c of [
    ["Black", "#000000"],
    ["White", "#FFFFFF"],
    ["Red", "#FF0000"],
    ["Blue", "#0000FF"],
    ["Green", "#00FF00"],
  ]) {
    colors.push(
      await prisma.colors.create({ data: { name: c[0], hex: c[1] } }),
    );
  }

  // Sizes
  const sizes = [];
  for (const s of ["S", "M", "L", "XL", "XXL"]) {
    sizes.push(await prisma.sizes.create({ data: { name: s } }));
  }

  // Categories
  const cat = await prisma.product_categories.create({
    data: { name: "Fashion", slug: "fashion" },
  });

  // Users
  const users = [];
  for (let i = 0; i < 30; i++) {
    const u = await prisma.users.create({
      data: {
        email: faker.internet.email(),
        password_hash: "$2b$10$seedpasswordhash",
        full_name: faker.person.fullName(),
        role: "customer",
        is_verified: true,
      },
    });
    users.push(u);

    await prisma.user_addresses.create({
      data: {
        user_id: u.id,
        receiver_name: u.full_name,
        receiver_phone: "0900000000",
        province: "HCM",
        district: "Thu Duc",
        ward: "Linh Trung",
        street_address: faker.location.streetAddress(),
        is_default: true,
      },
    });
  }

  const products: any[] = [];
  const variants: any[] = [];

  for (let i = 0; i < 50; i++) {
    const p = await prisma.products.create({
      data: {
        title: faker.commerce.productName(),
        slug: `product-${i}-${faker.string.alphanumeric(6)}`,
        description: faker.commerce.productDescription(),
        base_price: faker.number.int({ min: 100000, max: 3000000 }),
        old_price: faker.number.int({ min: 200000, max: 4000000 }),
        status: products_status.active,
      },
    });

    products.push(p);

    await prisma.product_images.create({
      data: {
        product_id: p.id,
        url: `https://picsum.photos/seed/p${p.id}/1200/1200`,
        is_main: true,
      },
    });

    await prisma.product_brands.create({
      data: {
        product_id: p.id,
        brand_id: faker.helpers.arrayElement(brands).id,
      },
    });

    await prisma.product_category_map.create({
      data: {
        product_id: p.id,
        category_id: cat.id,
      },
    });

    for (const color of colors) {
      for (const size of sizes) {
        const v = await prisma.product_variants.create({
          data: {
            product_id: p.id,
            color_id: color.id,
            size_id: size.id,
            sku: `SKU-${p.id}-${color.id}-${size.id}`,
            price: faker.number.int({ min: 100000, max: 3000000 }),
            stock: faker.number.int({ min: 0, max: 200 }),
          },
        });

        variants.push(v);

        await prisma.product_variant_images.create({
          data: {
            product_variant_id: v.id,
            url: `https://picsum.photos/seed/v${v.id}/1200/1200`,
            is_main: true,
          },
        });

        await prisma.inventory_logs.create({
          data: {
            variant_id: v.id,
            type: inventory_logs_type.import,
            quantity: faker.number.int({ min: 50, max: 200 }),
            note: "Initial stock",
          },
        });
      }
    }
  }

  // Coupons
  const coupons: any[] = [];
  for (let i = 1; i <= 5; i++) {
    coupons.push(
      await prisma.coupons.create({
        data: {
          code: `SALE${i}`,
          type: coupons_type.percent,
          value: 10,
          usage_limit: 100,
          is_active: true,
        },
      }),
    );
  }

  // Orders + Payments + Shipments
  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(users);

    const order = await prisma.orders.create({
      data: {
        user_id: user.id,
        order_code: `ORD-${Date.now()}-${i}`,
        status: orders_status.completed,
        payment_status: orders_payment_status.paid,
        subtotal: 500000,
        shipping_fee: 30000,
        discount_amount: 0,
        total_amount: 530000,
      },
    });

    const variant = faker.helpers.arrayElement(variants);

    await prisma.order_items.create({
      data: {
        order_id: order.id,
        product_id: variant.product_id,
        variant_id: variant.id,
        quantity: 1,
        price: variant.price,
        total: variant.price,
      },
    });

    await prisma.payments.create({
      data: {
        order_id: order.id,
        method: payments_method.cod,
        amount: 530000,
        status: payments_status.success,
      },
    });

    await prisma.shipments.create({
      data: {
        order_id: order.id,
        carrier: "GHN",
        tracking_code: faker.string.alphanumeric(12),
        status: shipments_status.delivered,
      },
    });
  }

  // Reviews
  for (let i = 0; i < 200; i++) {
    const review = await prisma.user_reviews.create({
      data: {
        user_id: faker.helpers.arrayElement(users).id,
        product_id: faker.helpers.arrayElement(products).id,
        rating: faker.number.int({ min: 1, max: 5 }),
        title: faker.lorem.sentence(),
        comment: faker.lorem.paragraph(),
      },
    });

    await prisma.review_media.create({
      data: {
        review_id: review.id,
        type: review_media_type.image,
        url: `https://picsum.photos/seed/review${review.id}/800/800`,
      },
    });
  }

  // Banners
  await prisma.banners.create({
    data: {
      title: "Summer Sale",
      image_url: "https://picsum.photos/1920/900",
    },
  });

  // Instagram
  const gallery = await prisma.instagram_gallery.create({
    data: {
      image_url: "https://picsum.photos/1000/1000",
      username: "fashion_store",
    },
  });

  await prisma.instagram_gallery_products.create({
    data: {
      gallery_id: gallery.id,
      product_id: products[0].id,
    },
  });

  // Pages
  const page = await prisma.pages.create({
    data: {
      title: "About Us",
      slug: "about-us",
      page_group: page_group.about_us,
    },
  });

  await prisma.page_sections.create({
    data: {
      page_id: page.id,
      title: "Our Story",
      section_type: page_section_type.content,
      content: "Seed content",
    },
  });

  await prisma.shop_settings.create({
    data: {
      shop_name: "Fashion Store",
      email: "support@example.com",
    },
  });

  console.log("✅ Done");
}

