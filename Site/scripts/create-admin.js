const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    // Get MongoDB URL from environment or ask user
    const mongoUrl = process.env.MONGODB_URL || await question('MongoDB URL: ');

    // Get admin credentials
    const username = await question('Admin Username: ');
    const password = await question('Admin Password: ');

    if (!username || !password) {
      console.error('Username and password are required!');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('\nConnecting to MongoDB...');
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db('verification_bot');

    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ username });
    if (existingAdmin) {
      console.log('\n❌ Admin with this username already exists!');
      await client.close();
      process.exit(1);
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    console.log('Creating admin account...');
    await db.collection('admins').insertOne({
      username: username,
      password: hashedPassword,
      role: 'admin',
      created_at: new Date()
    });

    console.log('\n✅ Admin account created successfully!');
    console.log(`Username: ${username}`);
    console.log('You can now login to the dashboard with these credentials.');

    await client.close();
    rl.close();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

createAdmin();
