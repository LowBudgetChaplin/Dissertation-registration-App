import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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
            match: [/.+\@.+\..+/, "incorrect email"],
            unique: true
    },
    password: {

            type: String,
            required: true
    },
    teacher: {
        type: mongoose.Types.ObjectId, ref: "Teacher",
    }
},
{
        timestamps: true
}
);

export const Student = mongoose.model("Student",studentSchema);