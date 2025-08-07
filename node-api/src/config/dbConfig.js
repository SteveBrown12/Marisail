
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const ENVIRONMENT = process?.env;

// Add debug logging
console.log('=== Database Configuration ===');
console.log('Host:', ENVIRONMENT.DB_HOST);
console.log('User:', ENVIRONMENT.DB_USER);
console.log('Database:', ENVIRONMENT.DB_NAME);
console.log('Password:', ENVIRONMENT.DB_PASS ? 'SET' : 'NOT SET');

const db_connection = mysql.createPool({
  host: ENVIRONMENT.DB_HOST,
  user: ENVIRONMENT.DB_USER,
  password: ENVIRONMENT.DB_PASS,
  database: ENVIRONMENT.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});


const testConnection = async () => {
  let testConn;
  try {
    console.log('🔄 Testing database db_connection...');
    
    testConn = await db_connection.getConnection();
    
    // Test basic query
    const [result] = await testConn.query('SELECT 1 as test, NOW() as timestamp');
    
    // Check current database
    const [dbResult] = await testConn.query('SELECT DATABASE() as current_db');
    
    console.log('✅ Database db_connection successful!');
    console.log('📊 Connection test result:', result[0]);
    console.log('🗄️  Current database:', dbResult[0].current_db);
    
    return true;
  } catch (error) {
    console.error('❌ Database db_connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    return false;
  } finally {
    if (testConn) {
      testConn.release();
      console.log('🔌 Test db_connection released');
    }
  }
};

// Test db_connection on startup
testConnection().then((success) => {
  if (success) {
    console.log('🚀 Database ready for use');
  } else {
    console.log('⚠️  Database db_connection issues detected');
  }
});

// Optional: Add db_connection event listeners
db_connection.on('db_connection', () => {
  console.log('🔗 New database db_connection established');
});

db_connection.on('error', (err) => {
  console.error('💥 Database db_connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Database db_connection lost, will reconnect...');
  }
});


export default db_connection;

// Export test function for manual testing
export { testConnection };