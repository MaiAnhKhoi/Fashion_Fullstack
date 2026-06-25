export interface ShopSettingResponse {
  shopName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  googleMapUrl: string | null;
  googleMapEmbed: string | null;
  social: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    twitter: string | null;
    youtube: string | null;
    tiktok: string | null;
  };
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
  };
}
