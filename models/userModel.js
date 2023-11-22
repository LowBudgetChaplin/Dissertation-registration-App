import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    username: {

            type: String,
            required: true
    },
    email: {

            type: String,
            required: true,
            match: [/.+\@.+\..+/, "incorrect email"]
    },
    password: {

            type: String,
            required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}
);

export const User = mongoose.model("User",userSchema);
