const { PrismaClient } = require('../netlify/functions/generated/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Note: process.env is natively available in Netlify Functions, 
// so require('dotenv').config() is usually not needed in production.

let prisma;

if (!global.prisma) {
    // 1. Create the pool only once
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    // 2. Create the adapter
    const adapter = new PrismaPg(pool);

    // 3. Initialize PrismaClient
    global.prisma = new PrismaClient({ 
        adapter,
        // Optional: helpful for debugging Netlify logs
        log: ['error', 'warn'], 
    });
}

prisma = global.prisma;

module.exports = prisma;