import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0 // Ensures the amount is not negative
    },
    timestamp: {
        type: Date,
        
    }
});

const History = mongoose.model("History", historySchema);

export default History;
