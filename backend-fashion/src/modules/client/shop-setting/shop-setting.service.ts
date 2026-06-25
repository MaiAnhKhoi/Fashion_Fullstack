import prisma from "@/config/prisma.config";
import { ShopSettingResponse } from "./shop-setting.response";

const handleGetShopSetting = async (): Promise<ShopSettingResponse | null> => {
  const setting = await prisma.shop_settings.findFirst();

  if (!setting) return null;

  return {
    shopName: setting.shop_name,
    logoUrl: setting.logo_url,
    faviconUrl: setting.favicon_url,
    address: setting.address,
    phone: setting.phone,
    email: setting.email,
    googleMapUrl: setting.google_map_url,
    googleMapEmbed: setting.google_map_embed,
    social: {
      facebook: setting.facebook_url,
      instagram: setting.instagram_url,
      linkedin: setting.linkedin_url,
      twitter: setting.twitter_url,
      youtube: setting.youtube_url,
      tiktok: setting.tiktok_url,
    },
    seo: {
      metaTitle: setting.meta_title,
      metaDescription: setting.meta_description,
      metaKeywords: setting.meta_keywords,
    },
  };
};

export { handleGetShopSetting };
