/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { CategoryName, PrismaClient, PrivilegesName } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { hash } from 'crypto';
const prisma = new PrismaClient();

async function hashPass(pass: string){
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    
    return bcrypt.hash(pass, rounds);
}

async function main() {

    const readP = PrivilegesName.READ;
    const postP = PrivilegesName.POST;
    const patchP = PrivilegesName.PATCH;
    const putP = PrivilegesName.PUT;
    const deleteP = PrivilegesName.DELETE;

    const foodC = CategoryName.FOOD;
    const toolC = CategoryName.TOOL;
    const schoolC = CategoryName.SCHOOL;
    const pharmacyC = CategoryName.PHARMACY;
    const technologyC = CategoryName.TECHNOLOGY;

    // Roles
    const rolesData = [
    { name: 'MASTER', privileges: [readP, postP, patchP, putP, deleteP], categories: [foodC, toolC, schoolC, pharmacyC, technologyC] },
    { name: 'ADMIN', privileges: [readP, postP, patchP, putP], categories: [foodC, toolC, schoolC] },
    { name: 'MODERATOR', privileges: [readP, patchP, putP], categories: [technologyC, schoolC, pharmacyC] },
    { name: 'EDITOR', privileges: [readP, postP, patchP], categories: [foodC, schoolC] },
    { name: 'SELLER', privileges: [readP, postP], categories: [technologyC, toolC] },
    { name: 'VIEWER', privileges: [readP], categories: [foodC, pharmacyC] },
    { name: 'INTERN', privileges: [readP], categories: [foodC, technologyC] },
    ];

    const roles: Record<string, any> = {};
    for (const r of rolesData) {
    const role = await prisma.role.upsert({
        where: { name: r.name },
        update: {},
        create: r,
    });
        roles[r.name] = role;
    }

    // Users
    const usersData = [
    { email: 'admin@example.com', password: hashPass("admin"), roleName: 'MASTER' },
    { email: 'alice@example.com', password: hashPass("elice"), roleName: 'ADMIN' },
    { email: 'bob@example.com', password: hashPass("bob"), roleName: 'MODERATOR' },
    { email: 'charlie@example.com', password: hashPass("charlie"), roleName: 'EDITOR' },
    { email: 'diana@example.com', password: hashPass("diana"), roleName: 'SELLER' },
    { email: 'eve@example.com', password: hashPass("eve"), roleName: 'VIEWER' },
    { email: 'frank@example.com', password: hashPass("frank"), roleName: 'INTERN' },
    { email: 'grace@example.com', password: hashPass("grace"), roleName: 'SELLER' },
    { email: 'heidi@example.com', password: hashPass("heidi"), roleName: 'ADMIN' },
    { email: 'ivan@example.com', password: hashPass("ivan"), roleName: 'MODERATOR' },
    ];

    for (const u of usersData) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
            email: u.email,
            password: await u.password, 
            role_id: roles[u.roleName].id,
            },
        });
    }

    await prisma.product.createMany({
    data: [
            // FOOD
            { name: 'Apple', brand: 'Don Soto', category: foodC, unitPrice: 120, stock: 30 },
            { name: 'Banana', brand: 'Tropical Fresh', category: foodC, unitPrice: 90, stock: 45 },
            { name: 'Rice', brand: 'Molino del Sol', category: foodC, unitPrice: 350, stock: 60 },
            { name: 'Olive Oil', brand: 'La Toscana', category: foodC, unitPrice: 1800, stock: 25 },
            { name: 'Milk', brand: 'La Serenísima', category: foodC, unitPrice: 500, stock: 40 },
            { name: 'Bread', brand: 'Campo Verde', category: foodC, unitPrice: 250, stock: 80 },

            // TOOL
            { name: 'Screwdriver', brand: 'Stanley', category: toolC, unitPrice: 950, stock: 50 },
            { name: 'Hammer', brand: 'Bahco', category: toolC, unitPrice: 1700, stock: 25 },
            { name: 'Drill', brand: 'Bosch', category: toolC, unitPrice: 12000, stock: 10 },
            { name: 'Measuring Tape', brand: 'Truper', category: toolC, unitPrice: 600, stock: 70 },
            { name: 'Pliers', brand: 'Irwin', category: toolC, unitPrice: 850, stock: 40 },
            { name: 'Wrench', brand: 'Craftsman', category: toolC, unitPrice: 1100, stock: 35 },

            // SCHOOL
            { name: 'Book', brand: 'Rivadavia', category: schoolC, unitPrice: 300, stock: 100 },
            { name: 'Notebook', brand: 'Gloria', category: schoolC, unitPrice: 280, stock: 120 },
            { name: 'Pencil', brand: 'Faber-Castell', category: schoolC, unitPrice: 80, stock: 500 },
            { name: 'Eraser', brand: 'Maped', category: schoolC, unitPrice: 60, stock: 400 },
            { name: 'Backpack', brand: 'Totto', category: schoolC, unitPrice: 4500, stock: 20 },
            { name: 'Marker Set', brand: 'Sharpie', category: schoolC, unitPrice: 850, stock: 90 },

            // PHARMACY
            { name: 'Pills', brand: 'Bayer', category: pharmacyC, unitPrice: 600, stock: 200 },
            { name: 'Vitamin C', brand: 'Redoxon', category: pharmacyC, unitPrice: 950, stock: 100 },
            { name: 'Bandages', brand: 'Curitas', category: pharmacyC, unitPrice: 300, stock: 150 },
            { name: 'Thermometer', brand: 'Omron', category: pharmacyC, unitPrice: 2500, stock: 40 },
            { name: 'Alcohol Gel', brand: 'Aseptic', category: pharmacyC, unitPrice: 700, stock: 80 },
            { name: 'Cough Syrup', brand: 'Tosfree', category: pharmacyC, unitPrice: 1200, stock: 60 },

            // TECHNOLOGY
            { name: 'Mouse', brand: 'Logitech', category: technologyC, unitPrice: 8000, stock: 15 },
            { name: 'Keyboard', brand: 'Redragon', category: technologyC, unitPrice: 15000, stock: 20 },
            { name: 'Monitor', brand: 'Samsung', category: technologyC, unitPrice: 95000, stock: 10 },
            { name: 'Headphones', brand: 'Sony', category: technologyC, unitPrice: 18000, stock: 30 },
            { name: 'USB Drive', brand: 'Kingston', category: technologyC, unitPrice: 2500, stock: 100 },
            { name: 'Webcam', brand: 'Logitech', category: technologyC, unitPrice: 22000, stock: 12 },
            ],
        });
    }

main()
    .then(() => console.log('Seed completed'))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
