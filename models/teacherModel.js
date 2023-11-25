import mongoose, { Schema } from "mongoose";
import {Student} from "./studentModel.js";
import {ObjectId} from "mongodb";

const teacherSchema = new mongoose.Schema(
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
                isEmail: true,
                match: [/.+\@.+\..+/, "incorrect email"],
                unique: true
        },

        password: {

                type: String,
                required: true
        },

        students: [{
            type: mongoose.Types.ObjectId, ref: "Student",
            max: 12,
        }],
    },
    {
        timestamps: true
    }
);

export const Teacher = mongoose.model("Teacher",teacherSchema);
