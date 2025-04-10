// import express from 'express';
// import rootRouter from "./routes/index";
// import cors from 'cors';

// const app = express();
// app.use(express.json());
// app.use(cors());
// // This line is used in an Express.js application to register middleware. It tells Express to use rootRouter for handling requests that start with /api/v1.

// // rootRouter → Router (Middleware/Handler)

// app.use("/api/v1", rootRouter);


// app.listen(3000, () => {
//     console.log('Server is running on port http://localhot:3000');
// });

import express from "express";
import connectToDb from "./database/connectToDb";
import rootRouter from "./routes/index";
import cors from "cors"

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());


const startServer = async () => {
    try {
        await connectToDb();
        console.log("Database connected!");

        app.use("/api/v1", rootRouter);

        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit process if DB connection fails
    }
};

startServer();
