import connection from "./config/dbConfig.js"; // Import the MySQL connection pool

// Test database connection
async function testDatabaseConnection() {
  try {
    // Get a connection from the pool to test the connection
    const conn = await connection.getConnection();

    // Release the connection immediately (no queries are executed)
    conn.release();

    console.log("✅ Connected to the database successfully.");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
  } finally {
    // Close the connection pool
    await connection.end();
    console.log("Connection pool closed.");
  }
}

// Run the connection test
testDatabaseConnection();