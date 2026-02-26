import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const categories = [
  {
    name: 'Men',
    subCategories: [
      { name: 'Perfumes', fragranceTypes: ['Eau de Parfum (EDP)', 'Eau de Toilette (EDT)', 'Woody Scents', 'Musky Scents', 'Citrus & Fresh'] },
      { name: 'Body Mists', fragranceTypes: ['Daily Wear Mists', 'Sport & Active Mists', 'Fresh & Cool Variants'] },
    ],
  },
  {
    name: 'Women',
    subCategories: [
      { name: 'Perfumes', fragranceTypes: ['Floral', 'Fruity', 'Oriental', 'Sweet & Gourmand', 'Luxury Designer Scents'] },
      { name: 'Body Mists', fragranceTypes: ['Light Everyday Mists', 'Floral Mist Collection', 'Sweet & Refreshing Variants'] },
    ],
  },
];

// Men's Body Mists: 7 images in backend/uploads/ — MB_1.jpg … MB_7.jpg (assign by order; swap to interchange).
// Index → Product: 0: Sport Body Mist  1: Gym Fresh Mist  2: Daily Wear Mist  3: Office Ready Mist
//  4: Fresh & Cool Mist  5: Arctic Breeze Mist  6: Urban Fresh Mist
const MEN_BODY_MISTS_IMAGES = [
  '/uploads/MB_1.jpg', '/uploads/MB_2.jpg', '/uploads/MB_3.jpg', '/uploads/MB_4.jpg',
  '/uploads/MB_5.jpg', '/uploads/MB_6.jpg', '/uploads/MB_7.jpg',
];

// Men's Perfumes: 17 images in backend/uploads/ — MP_1.jpg … MP_17.jpg. Assign by order; swap entries to interchange.
// Index → Product: 0: Classic Woody EDP  1: Citrus Fresh EDT  2: Midnight Oud EDP  3: Sandalwood & Cedar EDT
//  4: Musk Intense EDP  5: Noir Musk EDT  6: Midnight Musk EDP  7: White Musk EDT  8: Fresh Citrus EDT
//  9: Ocean Breeze EDT  10: Lime & Ginger EDP  11: Signature EDP  12: Executive EDT  13: Tobacco & Leather EDP
// 14: Pine & Juniper EDP  15: Ice Cool EDT  16: Night Out EDP
const MEN_PERFUMES_IMAGES = [
  '/uploads/MP_1.jpg', '/uploads/MP_2.jpg', '/uploads/MP_3.jpg', '/uploads/MP_4.jpg',
  '/uploads/MP_5.jpg', '/uploads/MP_6.jpg', '/uploads/MP_7.jpg', '/uploads/MP_8.jpg',
  '/uploads/MP_9.jpg', '/uploads/MP_10.jpg', '/uploads/MP_11.jpg', '/uploads/MP_12.jpg',
  '/uploads/MP_13.jpg', '/uploads/MP_14.jpg', '/uploads/MP_15.jpg', '/uploads/MP_16.jpg',
  '/uploads/MP_17.jpg',
];

// Women's Perfumes: 26 images — assign by ORDER. To interchange images, SWAP two paths in this array.
// Index → Product (same order as Women's Perfumes in sampleProducts below):
//  0: Floral Dream EDP      1: Sweet Gourmand Parfum  2: Rose Garden EDP        3: Jasmine Nights EDP
//  4: Peony Blush EDP       5: Violet & Iris EDP      6: Lily of the Valley EDP 7: Berry Bliss EDP
//  8: Peach Paradise EDP     9: Apple Blossom EDP     10: Mango Tango EDP      11: Oriental Nights EDP
// 12: Velvet Oud EDP       13: Spice Route EDP       14: Vanilla Dream EDP    15: Caramel Kiss EDP
// 16: Chocolate Rose EDP   17: Honey & Almond EDP    18: Designer Icon EDP    19: Haute Couture EDP
// 20: Signature Femme EDP  21: Velvet Rose EDP       22: Cherry Blossom EDP   23: Moonlight Oriental EDP
// 24: Spiced Vanilla EDP   25: Golden Oud EDP
const WOMEN_PERFUMES_IMAGES = [
  '/uploads/WM_1.jpg', '/uploads/WM_2.jpg', '/uploads/WM_3.jpg', '/uploads/WM_4.png',
  '/uploads/WM_5.jpg', '/uploads/WM_6.jpg', '/uploads/WM_7.jpg', '/uploads/WM_8.jpg',
  '/uploads/WM_9.jpg', '/uploads/WM_10.jpg', '/uploads/WM_11.jpg', '/uploads/WM_12.jpg',
  '/uploads/WM_13.jpg', '/uploads/WM_14.jpg', '/uploads/WM_15.jpg', '/uploads/WM_16.jpg',
  '/uploads/WM_17.jpg', '/uploads/WM_18.jpg', '/uploads/WM_19.jpg', '/uploads/WM_20.jpg',
  '/uploads/WM_26.jpg', '/uploads/WM_22.jpg', '/uploads/WM_23.jpg', '/uploads/WM_24.jpg',
  '/uploads/WM_25.jpg', '/uploads/WM_21.jpg',
];

// Women's Body Mists: 10 images in backend/uploads/ — WB_1.jpg, WB_2.png, WB_3.jpg, WB_4.png, WB_5–10.jpg (swap to interchange).
// Index → Product: 0: Everyday Floral Mist  1: Rose Water Mist  2: Lavender Calm Mist  3: Light Everyday Mist
//  4: Morning Dew Mist  5: Sweet Vanilla Mist  6: Citrus Splash Mist  7: Coconut Dream Mist
//  8: Peony Spray Mist  9: Tropical Escape Mist
const WOMEN_BODY_MISTS_IMAGES = [
  '/uploads/WB_1.jpg', '/uploads/WB_2.png', '/uploads/WB_3.jpg', '/uploads/WB_4.png',
  '/uploads/WB_5.jpg', '/uploads/WB_6.jpg', '/uploads/WB_7.jpg', '/uploads/WB_8.jpg',
  '/uploads/WB_9.jpg', '/uploads/WB_10.jpg',
];

// All products use images: [] — add files to backend/uploads/ and reference in DB later. Total: 60.
const sampleProducts = [
  // ——— MEN'S PERFUMES (14) ———
  { title: 'Classic Woody EDP', description: 'Rich woody and musky fragrance for men. Long-lasting and elegant.', price: 49.99, stock: 50, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Woody Scents' },
  { title: 'Citrus Fresh EDT', description: 'Bright citrus and fresh notes. Perfect for daily wear.', price: 34.99, stock: 80, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Citrus & Fresh' },
  { title: 'Midnight Oud EDP', description: 'Deep oud and sandalwood. Bold and sophisticated.', price: 89.99, stock: 30, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Woody Scents' },
  { title: 'Sandalwood & Cedar EDT', description: 'Warm sandalwood with cedar and vetiver. Timeless masculine scent.', price: 54.99, stock: 65, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Woody Scents' },
  { title: 'Musk Intense EDP', description: 'Clean, sensual musk. Stays close to the skin all day.', price: 64.99, stock: 45, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Musky Scents' },
  { title: 'Noir Musk EDT', description: 'Dark musk with leather and tonka. Confident and lasting.', price: 52.99, stock: 70, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Musky Scents' },
  { title: 'Midnight Musk EDP', description: 'Warm musk with amber and vanilla. Evening wear.', price: 69.99, stock: 35, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Musky Scents' },
  { title: 'White Musk EDT', description: 'Soft, clean musk. Everyday elegance.', price: 38.99, stock: 90, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Musky Scents' },
  { title: 'Fresh Citrus EDT', description: 'Lemon, bergamot, and green herbs. Crisp and energizing.', price: 42.99, stock: 85, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Citrus & Fresh' },
  { title: 'Ocean Breeze EDT', description: 'Marine notes with citrus and mint. Refreshing summer scent.', price: 44.99, stock: 75, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Citrus & Fresh' },
  { title: 'Lime & Ginger EDP', description: 'Zesty lime with spicy ginger. Bold and fresh.', price: 48.99, stock: 60, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Citrus & Fresh' },
  { title: 'Signature EDP', description: 'Eau de Parfum concentration. Long-lasting blend of citrus and woods.', price: 79.99, stock: 42, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Eau de Parfum (EDP)' },
  { title: 'Executive EDT', description: 'Professional daytime EDT. Clean and polished.', price: 55.99, stock: 58, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Eau de Toilette (EDT)' },
  { title: 'Tobacco & Leather EDP', description: 'Bold tobacco, leather, and birch. Statement scent.', price: 76.99, stock: 35, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Woody Scents' },
  { title: 'Pine & Juniper EDP', description: 'Forest-inspired. Pine, juniper, and cedar.', price: 61.99, stock: 44, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Woody Scents' },
  { title: 'Ice Cool EDT', description: 'Mint, eucalyptus, and citrus. Ultra-fresh.', price: 39.99, stock: 80, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Citrus & Fresh' },
  { title: 'Night Out EDP', description: 'Evening EDP with depth and longevity.', price: 74.99, stock: 38, category: 'Men', subCategory: 'Perfumes', fragranceType: 'Eau de Parfum (EDP)' },
  // ——— MEN'S BODY MISTS (6) ———
  { title: 'Sport Body Mist', description: 'Light, energizing mist for active lifestyles.', price: 14.99, stock: 100, category: 'Men', subCategory: 'Body Mists', fragranceType: 'Sport & Active Mists' },
  { title: 'Gym Fresh Mist', description: 'Post-workout freshness. Citrus and mint.', price: 12.99, stock: 120, category: 'Men', subCategory: 'Body Mists', fragranceType: 'Sport & Active Mists' },
  { title: 'Daily Wear Mist', description: 'Subtle everyday scent. Never overpowering.', price: 11.99, stock: 150, category: 'Men', subCategory: 'Body Mists', fragranceType: 'Daily Wear Mists' },
  { title: 'Office Ready Mist', description: 'Clean, professional body mist for the workplace.', price: 15.99, stock: 88, category: 'Men', subCategory: 'Body Mists', fragranceType: 'Daily Wear Mists' },
  { title: 'Fresh & Cool Mist', description: 'Ice-cool freshness in a spray.', price: 13.49, stock: 105, category: 'Men', subCategory: 'Body Mists', fragranceType: 'Fresh & Cool Variants' },
  { title: 'Arctic Breeze Mist', description: 'Mint and frozen citrus. Ultra-cool.', price: 14.49, stock: 92, category: 'Men', subCategory: 'Body Mists', fragranceType: 'Fresh & Cool Variants' },
  { title: 'Urban Fresh Mist', description: 'City-ready fresh body mist.', price: 12.99, stock: 90, category: 'Men', subCategory: 'Body Mists', fragranceType: 'Daily Wear Mists' },
  // ——— WOMEN'S PERFUMES (22) ———
  { title: 'Floral Dream EDP', description: 'Delicate floral bouquet with a soft, feminine finish.', price: 54.99, stock: 45, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Floral' },
  { title: 'Sweet Gourmand Parfum', description: 'Warm vanilla and caramel. A comforting, sweet scent.', price: 44.99, stock: 60, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Sweet & Gourmand' },
  { title: 'Rose Garden EDP', description: 'Turkish rose, peony, and jasmine. Romantic and timeless.', price: 62.99, stock: 50, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Floral' },
  { title: 'Jasmine Nights EDP', description: 'Intoxicating jasmine with tuberose and gardenia.', price: 58.99, stock: 48, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Floral' },
  { title: 'Peony Blush EDP', description: 'Soft peony and rose. Fresh and feminine.', price: 52.99, stock: 65, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Floral' },
  { title: 'Violet & Iris EDP', description: 'Powdery violet and iris. Elegant and classic.', price: 56.99, stock: 42, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Floral' },
  { title: 'Lily of the Valley EDP', description: 'Green, dewy lily. Spring in a bottle.', price: 49.99, stock: 55, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Floral' },
  { title: 'Berry Bliss EDP', description: 'Blackberry, raspberry, and strawberry. Juicy and fun.', price: 48.99, stock: 70, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Fruity' },
  { title: 'Peach Paradise EDP', description: 'Ripe peach with apricot and nectarine.', price: 46.99, stock: 68, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Fruity' },
  { title: 'Apple Blossom EDP', description: 'Crisp apple with floral undertones. Fresh and sweet.', price: 44.99, stock: 75, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Fruity' },
  { title: 'Mango Tango EDP', description: 'Tropical mango with passion fruit. Vibrant and summery.', price: 50.99, stock: 52, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Fruity' },
  { title: 'Oriental Nights EDP', description: 'Amber, incense, and spices. Mysterious and alluring.', price: 68.99, stock: 40, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Oriental' },
  { title: 'Velvet Oud EDP', description: 'Oud, rose, and saffron. Luxe oriental.', price: 84.99, stock: 32, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Oriental' },
  { title: 'Spice Route EDP', description: 'Cinnamon, cardamom, and vanilla. Warm and exotic.', price: 59.99, stock: 45, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Oriental' },
  { title: 'Vanilla Dream EDP', description: 'Creamy vanilla with tonka and praline.', price: 47.99, stock: 80, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Sweet & Gourmand' },
  { title: 'Caramel Kiss EDP', description: 'Sweet caramel, toffee, and brown sugar.', price: 45.99, stock: 72, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Sweet & Gourmand' },
  { title: 'Chocolate Rose EDP', description: 'Dark chocolate and rose. Indulgent and romantic.', price: 54.99, stock: 48, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Sweet & Gourmand' },
  { title: 'Honey & Almond EDP', description: 'Warm honey with almond and heliotrope.', price: 49.99, stock: 55, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Sweet & Gourmand' },
  { title: 'Designer Icon EDP', description: 'Luxury designer-inspired blend. Timeless and chic.', price: 98.99, stock: 25, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Luxury Designer Scents' },
  { title: 'Haute Couture EDP', description: 'High-fashion fragrance. Exclusive and refined.', price: 112.99, stock: 20, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Luxury Designer Scents' },
  { title: 'Signature Femme EDP', description: 'Signature luxury scent. Unforgettable.', price: 89.99, stock: 30, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Luxury Designer Scents' },
  { title: 'Velvet Rose EDP', description: 'Deep velvety rose with patchouli.', price: 66.99, stock: 40, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Floral' },
  { title: 'Cherry Blossom EDP', description: 'Japanese cherry blossom and soft musk.', price: 53.99, stock: 50, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Floral' },
  { title: 'Moonlight Oriental EDP', description: 'Night-time oriental. Sensual and deep.', price: 72.99, stock: 34, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Oriental' },
  { title: 'Spiced Vanilla EDP', description: 'Vanilla with cinnamon and clove. Winter warmth.', price: 52.99, stock: 52, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Sweet & Gourmand' },
  { title: 'Golden Oud EDP', description: 'Luxury oud with saffron and rose.', price: 108.99, stock: 18, category: 'Women', subCategory: 'Perfumes', fragranceType: 'Luxury Designer Scents' },
  // ——— WOMEN'S BODY MISTS (8) ———
  { title: 'Everyday Floral Mist', description: 'Light floral mist for a subtle, refreshing touch.', price: 12.99, stock: 120, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Floral Mist Collection' },
  { title: 'Rose Water Mist', description: 'Delicate rose water spray. Hydrating and fragrant.', price: 13.99, stock: 100, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Floral Mist Collection' },
  { title: 'Lavender Calm Mist', description: 'Soothing lavender for relaxation.', price: 11.99, stock: 115, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Floral Mist Collection' },
  { title: 'Light Everyday Mist', description: 'Barely-there scent for daily wear.', price: 10.99, stock: 140, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Light Everyday Mists' },
  { title: 'Morning Dew Mist', description: 'Fresh, clean morning mist.', price: 10.49, stock: 130, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Light Everyday Mists' },
  { title: 'Sweet Vanilla Mist', description: 'Sweet vanilla and cotton. Cozy and comforting.', price: 13.49, stock: 95, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Sweet & Refreshing Variants' },
  { title: 'Citrus Splash Mist', description: 'Zesty citrus body mist. Instant refresh.', price: 11.99, stock: 110, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Sweet & Refreshing Variants' },
  { title: 'Coconut Dream Mist', description: 'Tropical coconut with a hint of vanilla.', price: 14.99, stock: 85, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Sweet & Refreshing Variants' },
  { title: 'Peony Spray Mist', description: 'Fresh peony body mist. Soft and pretty.', price: 12.49, stock: 105, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Floral Mist Collection' },
  { title: 'Tropical Escape Mist', description: 'Mango, coconut, and hibiscus body mist.', price: 13.99, stock: 88, category: 'Women', subCategory: 'Body Mists', fragranceType: 'Sweet & Refreshing Variants' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scentora');

    const existingAdmin = await User.findOne({ role: 'Admin' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@scentora.com',
        password: 'admin123',
        role: 'Admin',
      });
      console.log('Admin user created: admin@scentora.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }

    let seller = await User.findOne({ email: 'seller@scentora.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Demo Seller',
        email: 'seller@scentora.com',
        password: 'seller123',
        role: 'Seller',
        isApproved: true,
      });
      console.log('Demo seller created: seller@scentora.com / seller123');
    }

    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(categories);
      console.log('Default categories seeded.');
    } else {
      console.log('Categories already exist.');
    }

    const forceProducts = process.argv.includes('--force');
    const productCount = await Product.countDocuments();
    if (productCount === 0 || forceProducts) {
      if (forceProducts && productCount > 0) {
        await Product.deleteMany({});
        console.log('Cleared existing products.');
      }
      let menPerfumesImageIndex = 0;
      let menBodyMistsImageIndex = 0;
      let womenPerfumesImageIndex = 0;
      let womenBodyMistsImageIndex = 0;
      await Product.insertMany(
        sampleProducts.map((p) => {
          const isMenPerfume = p.category === 'Men' && p.subCategory === 'Perfumes';
          const isMenBodyMist = p.category === 'Men' && p.subCategory === 'Body Mists';
          const isWomenPerfume = p.category === 'Women' && p.subCategory === 'Perfumes';
          const isWomenBodyMist = p.category === 'Women' && p.subCategory === 'Body Mists';
          let images = [];
          if (isMenPerfume && menPerfumesImageIndex < MEN_PERFUMES_IMAGES.length) {
            images = [MEN_PERFUMES_IMAGES[menPerfumesImageIndex++]];
          } else if (isMenBodyMist && menBodyMistsImageIndex < MEN_BODY_MISTS_IMAGES.length) {
            images = [MEN_BODY_MISTS_IMAGES[menBodyMistsImageIndex++]];
          } else if (isWomenPerfume && womenPerfumesImageIndex < WOMEN_PERFUMES_IMAGES.length) {
            images = [WOMEN_PERFUMES_IMAGES[womenPerfumesImageIndex++]];
          } else if (isWomenBodyMist && womenBodyMistsImageIndex < WOMEN_BODY_MISTS_IMAGES.length) {
            images = [WOMEN_BODY_MISTS_IMAGES[womenBodyMistsImageIndex++]];
          }
          return { ...p, sellerId: seller._id, images };
        })
      );
      console.log(`Seeded ${sampleProducts.length} products (images: [] — add files to backend/uploads/ and update DB later).`);
    } else {
      console.log('Products already exist. To re-seed, run: npm run seed -- --force');
    }
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
