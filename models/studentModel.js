import mongoose from "mongoose";

export const studentSchema = new mongoose.Schema(
    {
        firstName: {

            type: String,
            required: true
    },

    lastName: {

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
}
);

export const Student = mongoose.model("Student",studentSchema);