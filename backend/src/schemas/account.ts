import mongoose from "mongoose";


const accountSchema = new mongoose.Schema({
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
     },
     balance: {
        type: Number,
        required: true,
     },
     credits:{
      type: Number,
      default: 0
     }
})

const Account = mongoose.model("Account", accountSchema);

export default Account;