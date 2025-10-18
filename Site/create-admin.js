const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const readline = require('readline');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    console.log('\n=== Create Admin Account ===\n');

    // Get credentials
    const username = await question('Admin Username: ');
    const password = await question('Admin Password: ');

    if (!username || !password) {
      console.error('\n❌ Username and password are required!');
      process.exit(1);
    }

    if (!process.env.MONGODB_URL) {
      console.error('\n❌ MONGODB_URL not found in .env file!');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...');
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    const db = client.db('verification_bot');

    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ username });
    if (existingAdmin) {
      console.log('\n❌ Admin with this username already exists!');
      await client.close();
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    console.log('💾 Creating admin account...');
    await db.collection('admins').insertOne({
      username: username,
      password: hashedPassword,
      role: 'admin',
      created_at: new Date()
    });

    console.log('\n✅ Admin account created successfully!');
    console.log(`📝 Username: ${username}`);
    console.log('🔗 You can now login to the dashboard with these credentials.\n');

    await client.close();
    rl.close();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

createAdmin();
