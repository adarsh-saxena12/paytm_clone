import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    upiId: { 
        type: String, 
        unique: true 
    },
    upiPin: { 
        type: String
     }
})

// Auto-generate UPI ID before saving
userSchema.pre("save", function (next) {
    if (!this.upiId) {
      this.upiId = `${this.firstName}@paytm`; // Example: rahul@paytm
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;