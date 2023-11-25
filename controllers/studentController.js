import mongoose from "mongoose";
import { Student } from "../models/studentModel.js";

const addTeacher = async (req, res) => {
    const teacher = new mongoose.Types.ObjectId(req.params.teacher);
    console.log(teacher);
    const {email} = req.params;
    const student = await Student.findOne({"email": email}).exec();
    student.teacher = teacher;
    student.save();

    const studentUpdated = await Student.findOne({"email": email})
    .populate("teacher", "firstName lastName email");

    res.status(200).send({Student: studentUpdated});

};

const getStudents = async (req, res) => {
    const students =  await Student.find({})
    .populate("teacher","firstName lastName email","Teacher");
    res.status(200).send({Students: students});
};

const createStudent = async (req, res) => {
    try {
        const student = req.body;
        await Student.create(student);
        res.status(201).send({message: "Student created"});

    } catch (error) {
        res.status(400).send({message: "params not correct", error: error});
    }
};

const getStudentsByEmail = async (req, res) => {
    try {
        const {email} = req.params;
        const student = await Student.findOne({"email": email}).exec();
        if (student)
        {
            res.status(200).send({Student: student});
        }
        else
        {
            res.status(404).send({message:"Student not found"});
        }

    } catch (error) {
        res.status(500).send({message: "server error", error: error})
    }
}

const updateStudent = async (req, res) => {
    try {
        
        const {email} = req.params;
        const student = await Student.findOneAndUpdate({"email":email}, req.body);
        if (student)
        {
            const updatedStudent = await Student.findOne({"email": email});
            res.status(200).send({Student: updatedStudent});
        }
        else
        {
            res.status(404).send({message:"Student not found"});
        } 

    } catch (error) {

        res.status(500).send({message: "server error", error: error})
    }
}

const removeStudent = async (req, res) => {
    try {
        
        const {email} = req.params;
        const student = await Student.findOne({"email": email}).exec();
        if (student)
        {
            await student.deleteOne({"email": email});
            res.status(200).send({message: "Student removed"});
        }
        else
        {
            res.status(404).send({message:"Student not found"});
        } 

    } catch (error) {

        res.status(500).send({message: "server error", error: error})
    }
}

export {
    getStudents,
    getStudentsByEmail,
    createStudent,
    updateStudent,
    removeStudent,
    addTeacher
}