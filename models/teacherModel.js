import mongoose, { Schema } from "mongoose";

const teacherSchema = new mongoose.Schema(
    {
        firstName: {

                type: String,
                errorMessage: 'Invalid firstName',
                required: true
        },

        lastName: {

                type: String,
                errorMEssage: 'Invalid lastName',
                required: true
        },
        email: {

                type: String,
                required: true,
                isEmail: true,
                errorMessage: 'Invalid email',
                match: [/.+\@.+\..+/, "incorrect email"]
        },

        password: {

                type: String,
                errorMessage: 'Invalid password',
                required: true
        },

        students: [{
            type: Schema.Types.ObjectId, ref: "Student"
        }],
    },
    {
        timestamps: true
    }
);

export const Teacher = mongoose.model("Teacher",teacherSchema);
