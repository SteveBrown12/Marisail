import db_connection from "./config/dbConfig.js"; 

// Test database connection
async function testDatabaseConnection() {
  try {
    // Get a connection from the pool to test
    const conn = await db_connection.getConnection();

    // Immediately release the connection (no queries needed for this test)
    conn.release();

    console.log("✅ Connected to the database successfully.");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  }

}

testDatabaseConnection();
