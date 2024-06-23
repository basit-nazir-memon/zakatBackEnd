const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String},
    avatar: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Viewer", "Editor", "Admin"], default: "Viewer" },
    blocked: { type: Boolean, default: false },
    gender: { type: String, enum: ["Male", "Female"] },
    phone: { type: String},
    createdAt: { type: Date, default: Date.now},
    address: {
        city: { type: String },
        country: { type: String }
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;