require("dotenv").config();
const app = require("./app");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5000;
connectDB()
    .then(() =>
        app.listen(PORT, () =>
            console.log(`TalentBridge API running on port ${PORT}`),
        ),
    )
    .catch((err) => {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    });
