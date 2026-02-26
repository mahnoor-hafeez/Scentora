export const API_BASE = import.meta.env.VITE_API_URL || '';

export const CATEGORIES = ['Men', 'Women'];
export const SUB_CATEGORIES = ['Perfumes', 'Body Mists'];
export const FRAGRANCE_TYPES = {
  Men: {
    Perfumes: ['Eau de Parfum (EDP)', 'Eau de Toilette (EDT)', 'Woody Scents', 'Musky Scents', 'Citrus & Fresh'],
    'Body Mists': ['Daily Wear Mists', 'Sport & Active Mists', 'Fresh & Cool Variants'],
  },
  Women: {
    Perfumes: ['Floral', 'Fruity', 'Oriental', 'Sweet & Gourmand', 'Luxury Designer Scents'],
    'Body Mists': ['Light Everyday Mists', 'Floral Mist Collection', 'Sweet & Refreshing Variants'],
  },
};

export const ORDER_STATUSES = ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
