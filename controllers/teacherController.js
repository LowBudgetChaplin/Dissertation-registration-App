import {Teacher} from "../models/teacherModel.js";
import {Student} from "../models/studentModel.js";
import {User} from "../models/userModel.js";
import mongoose from "mongoose";

const addStudents = async (req, res) => {
    const student = new mongoose.Types.ObjectId(req.params.student);
    console.log(student);
    const {email} = req.params;
    const teacher = await Teacher.findOne({"email": email}).exec();
    if (!teacher.students.includes(student))
    {
        teacher.students.push(student);
    }
    teacher.save();

    const teacherUpdated = await Teacher.findOne({"email": email})
    .populate("students",'firstName lastName email');

    res.status(200).send({Teacher: teacherUpdated});

};

const getTeachers = async (req, res) => {
    const teachers =  await Teacher.find({})
    .populate("students", "firstName lastName email");
    res.status(200).send({Teachers: teachers});
};

const createTeacher = async (req, res) => {
    try {
        const teacher = req.body;
        await Teacher.create(teacher);
        res.status(201).send({message: "Teacher created"});

    } catch (error) {
        res.status(404).send({message: "params not correct", error: error});
    }
};

const getTeachersByEmail = async (req, res) => {
    try {
        const {email} = req.params;
        const teacher = await Teacher.findOne({"email": email}).exec();
        if (teacher)
        {
            res.status(200).send({teacher: teacher});
        }
        else
        {
            res.status(404).send({message:"teacher not found"});
        }

    } catch (error) {
        res.status(500).send({message: "server error", error: error})
    }
}

const updateTeacher = async (req, res) => {
    try {
        
        const {email} = req.params;
        const teacher = await Teacher.findOneAndUpdate({"email":email}, req.body);
        if (teacher)
        {
            const updatedTeacher = await Teacher.findOne({"email": email});
            res.status(200).send({teacher: updatedTeacher});
        }
        else
        {
            res.status(404).send({message:"teacher not found"});
        } 

    } catch (error) {

        res.status(500).send({message: "server error", error: error})
    }
}

const removeTeacher = async (req, res) => {
    try {
        
        const {email} = req.params;
        const teacher = await Teacher.findOne({"email": email}).exec();
        if (teacher)
        {
            await teacher.deleteOne({"email": email});
            res.status(200).send({message: "teacher removed"});
        }
        else
        {
            res.status(404).send({message:"teacher not found"});
        } 

    } catch (error) {

        res.status(500).send({message: "server error", error: error})
    }
}

export {
    getTeachers,
    getTeachersByEmail,
    createTeacher,
    updateTeacher,
    removeTeacher,
    addStudents
}