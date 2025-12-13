import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      email: 'admin@restaurant.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+1234567890',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create chef user
  const chefPassword = await bcrypt.hash('chef123', 10);
  const chef = await prisma.user.upsert({
    where: { email: 'chef@restaurant.com' },
    update: {},
    create: {
      email: 'chef@restaurant.com',
      passwordHash: chefPassword,
      firstName: 'Chef',
      lastName: 'Master',
      role: 'CHEF',
      phone: '+1234567891',
    },
  });
  console.log('✅ Chef user created:', chef.email);

  // Create categories
  const categories = [
    { name: 'Appetizers', description: 'Start your meal right', displayOrder: 1, icon: 'utensils' },
    { name: 'Main Course', description: 'Delicious main dishes', displayOrder: 2, icon: 'plate' },
    { name: 'Desserts', description: 'Sweet endings', displayOrder: 3, icon: 'cake' },
    { name: 'Beverages', description: 'Refreshing drinks', displayOrder: 4, icon: 'coffee' },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name },
    });
    
    const cat = existing || await prisma.category.create({
      data: category,
    });
    createdCategories.push(cat);
    console.log('✅ Category created:', cat.name);
  }

  // Create menu items
  const menuItems = [
    {
      name: 'Classic Burger',
      description: 'Juicy beef patty with fresh vegetables and special sauce',
      categoryId: createdCategories[1].id,
      price: 12.99,
      preparationTime: 15,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      calories: 650,
      allergens: JSON.stringify(['gluten', 'dairy']),
      dietaryTags: JSON.stringify([]),
      spiceLevel: 1,
      isFeatured: true,
    },
    {
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomatoes, and basil on crispy crust',
      categoryId: createdCategories[1].id,
      price: 15.99,
      preparationTime: 20,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500',
      calories: 850,
      allergens: JSON.stringify(['gluten', 'dairy']),
      dietaryTags: JSON.stringify(['vegetarian']),
      spiceLevel: 0,
      isFeatured: true,
    },
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing and croutons',
      categoryId: createdCategories[0].id,
      price: 8.99,
      preparationTime: 10,
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500',
      calories: 350,
      allergens: JSON.stringify(['dairy', 'eggs']),
      dietaryTags: JSON.stringify(['vegetarian']),
      spiceLevel: 0,
    },
    {
      name: 'Spicy Chicken Wings',
      description: 'Crispy wings tossed in our signature hot sauce',
      categoryId: createdCategories[0].id,
      price: 10.99,
      preparationTime: 18,
      imageUrl: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500',
      calories: 580,
      allergens: JSON.stringify([]),
      dietaryTags: JSON.stringify([]),
      spiceLevel: 4,
    },
    {
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten center',
      categoryId: createdCategories[2].id,
      price: 7.99,
      preparationTime: 12,
      imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500',
      calories: 450,
      allergens: JSON.stringify(['gluten', 'dairy', 'eggs']),
      dietaryTags: JSON.stringify(['vegetarian']),
      spiceLevel: 0,
      isFeatured: true,
    },
    {
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice',
      categoryId: createdCategories[3].id,
      price: 4.99,
      preparationTime: 5,
      imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500',
      calories: 120,
      allergens: JSON.stringify([]),
      dietaryTags: JSON.stringify(['vegan', 'vegetarian']),
      spiceLevel: 0,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
    console.log('✅ Menu item created:', item.name);
  }

  // Create tables
  const tables = [
    { tableNumber: '1', capacity: 2, status: 'AVAILABLE', floorSection: 'Main Floor' },
    { tableNumber: '2', capacity: 4, status: 'AVAILABLE', floorSection: 'Main Floor' },
    { tableNumber: '3', capacity: 4, status: 'AVAILABLE', floorSection: 'Main Floor' },
    { tableNumber: '4', capacity: 6, status: 'AVAILABLE', floorSection: 'Main Floor' },
    { tableNumber: '5', capacity: 2, status: 'AVAILABLE', floorSection: 'Patio' },
    { tableNumber: '6', capacity: 8, status: 'AVAILABLE', floorSection: 'Main Floor' },
  ];

  for (const table of tables) {
    await prisma.table.create({
      data: table as any,
    });
    console.log('✅ Table created:', table.tableNumber);
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
