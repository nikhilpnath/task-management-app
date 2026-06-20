import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const PORT = env.PORT;

// Connect to MongoDB Database
connectDB();

// Start the Express Server
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT}`);
});
