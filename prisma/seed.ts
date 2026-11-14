import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in env');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  //Create admin account
  const passwordHash = await argon2.hash('12345678');
  await prisma.user.create({
    data: {
      email: 'admin@account.com',
      name: 'Admin',
      passwordHash,
      role: 'ADMIN',
    }
  });

  //Create categories
  const catPizza = await prisma.category.create({ data: { name: 'Pizza' } });
  const catHamburger = await prisma.category.create({ data: { name: 'Hamburger' } });
  const catChicken = await prisma.category.create({ data: { name: 'Chicken' } });
  const catSandwich = await prisma.category.create({ data: { name: 'Sandwich' } });
  const catDessert = await prisma.category.create({ data: { name: 'Dessert' } });
  const catDrink = await prisma.category.create({ data: { name: 'Drink' } });

  //Create menu items
  await prisma.menuItem.createMany({
    data: [
      //Pizza
      {
        name: 'Margherita Pizza',
        description:
          'A timeless Italian favorite featuring tangy tomato sauce, gooey mozzarella, and fresh aromatic basil leaves.',
        price: 119000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622087/Margherita_Pizza.jpg',
        categoryId: catPizza.id,
        isAvailable: true,
      },
      {
        name: 'Pepperoni Pizza',
        description:
          'Classic crispy crust topped with rich tomato sauce, melted mozzarella cheese, and savory, slightly spicy pepperoni slices.',
        price: 149000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622084/Pepperoni_Pizza.jpg',
        categoryId: catPizza.id,
        isAvailable: true,
      },
      {
        name: 'Seafood Pizza',
        description:
          'Loaded with tender shrimp, squid, crab sticks, and melted mozzarella over a creamy mayonnaise and tomato base.',
        price: 179000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622085/Seafood_Pizza.webp',
        categoryId: catPizza.id,
        isAvailable: true,
      },
      {
        name: 'Four Cheese Pizza',
        description:
          'A rich, creamy delight loaded with a melted blend of four signature cheeses: mozzarella, parmesan, gorgonzola, and cheddar.',
        price: 165000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622086/Four_Cheese_Pizza.jpg',
        categoryId: catPizza.id,
        isAvailable: true,
      },
      //Hamburger
      {
        name: 'Classic Cheeseburger',
        description:
          'Juicy grilled beef patty topped with melted cheddar cheese, fresh lettuce, ripe tomatoes, pickles, and house burger sauce in a toasted brioche bun.',
        price: 89000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622085/Cheeseburger.jpg',
        categoryId: catHamburger.id,
        isAvailable: true,
      },
      {
        name: 'Bacon BBQ Burger',
        description:
          'Savory grilled beef patty layered with crispy smoked bacon, cheddar cheese, crunchy onion rings, and smoky BBQ sauce.',
        price: 109000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622084/Bacon_BBQ_Burger.jpg',
        categoryId: catHamburger.id,
        isAvailable: true,
      },
      {
        name: 'Crispy Chicken Burger',
        description:
          'Golden-fried crispy chicken breast served with shredded lettuce, tangy pickles, and creamy mayonnaise on a soft toasted bun.',
        price: 85000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622086/Crispy_Chicken_Burger.jpg',
        categoryId: catHamburger.id,
        isAvailable: true,
      },
      {
        name: 'Double Beef Burger',
        description:
          'Two flame-grilled beef patties stacked with double cheddar cheese, caramelized onions, pickles, and signature sauce for hearty appetites.',
        price: 129000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622086/Double_Beef_Burger.jpg',
        categoryId: catHamburger.id,
        isAvailable: true,
      },
      {
        name: 'Mushroom Swiss Burger',
        description:
          'Juicy grilled beef patty topped with sautéed garlic mushrooms, melted Swiss cheese, and creamy peppercorn mayo in a toasted brioche bun.',
        price: 105000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622084/Mushroom_Swish_Burger.jpg',
        categoryId: catHamburger.id,
        isAvailable: true,
      },
      //Chicken
      {
        name: 'Classic Crispy Fried Chicken',
        description:
          'Two pieces of golden, crunchy bone-in chicken marinated in savory herbs and spices.',
        price: 79000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622086/Fried_Chicken.jpg',
        categoryId: catChicken.id,
        isAvailable: true,
      },
      {
        name: 'Honey Butter Chicken',
        description:
          'Six pieces of crunchy bite-sized chicken tossed in a rich, sweet-and-savory honey butter glaze.',
        price: 89000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622087/Honey_Butter_Chicken.jpg',
        categoryId: catChicken.id,
        isAvailable: true,
      },
      {
        name: 'Buffalo Chicken Wings',
        description:
          'Six crispy fried chicken wings coated in tangy, spicy Buffalo sauce, served with a side of cool ranch dip.',
        price: 95000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622084/Buffalo_Chicken_Wings.jpg',
        categoryId: catChicken.id,
        isAvailable: true,
      },
      {
        name: 'Crispy Chicken Tenders',
        description:
          'Five tender strips of golden-breaded chicken breast served with ketchup.',
        price: 75000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622085/Chicken_Tenders.jpg',
        categoryId: catChicken.id,
        isAvailable: true,
      },
      //Sandwich
      {
        name: 'Classic Club Sandwich',
        description:
          'Three layers of toasted white bread stacked with grilled chicken breast, crispy bacon, fried egg, fresh lettuce, tomatoes, and mayonnaise.',
        price: 59000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622085/Club_Sandwich.jpg',
        categoryId: catSandwich.id,
        isAvailable: true,
      },
      {
        name: 'Grilled Chicken Sandwich',
        description:
          'Tender grilled chicken breast, fresh lettuce, tomatoes, and garlic herb mayo served on toasted bread.',
        price: 55000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622086/Grilled_Chicken_Sandwich.jpg',
        categoryId: catSandwich.id,
        isAvailable: true,
      },
      {
        name: 'Ham & Cheese Toastie',
        description:
          'Smoked ham and gooey melted cheddar cheese pressed inside buttery, golden-toasted sandwich bread.',
        price: 39000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622086/Ham_and_Cheese_Toastie.jpg',
        categoryId: catSandwich.id,
        isAvailable: true,
      },
      //Dessert
      {
        name: 'Caramel Flan',
        description:
          'Smooth, velvety egg custard topped with a layer of rich, bittersweet caramel sauce.',
        price: 25000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622085/Caramel_Flan.png',
        categoryId: catDessert.id,
        isAvailable: true,
      },
      {
        name: 'Strawberry Panna Cotta',
        description:
          'Silky, creamy vanilla pudding served in a small cup and topped with sweet strawberry sauce.',
        price: 29000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622085/Strawberry_Panna_Cotta.jpg',
        categoryId: catDessert.id,
        isAvailable: true,
      },
      //Drink
      {
        name: 'Coca Cola',
        description: '',
        price: 15000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622086/Coca_Cola.webp',
        categoryId: catDrink.id,
        isAvailable: true,
      },
      {
        name: 'Pepsi',
        description: '',
        price: 15000,
        imageUrl:
          'https://res.cloudinary.com/alnxedqa/image/upload/v1794622084/Pepsi.jpg',
        categoryId: catDrink.id,
        isAvailable: true,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
