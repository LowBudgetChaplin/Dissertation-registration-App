import express from "express";

import * as teacherController from "../controllers/teacherController.js";

export const router = express.Router();

router.get("/", teacherController.getTeachers);

router.get("/:email", teacherController.getTeachersByEmail);

router.post("/", teacherController.createTeacher);

router.put("/:email", teacherController.updateTeacher);

router.delete("/:email", teacherController.removeTeacher);

router.get("/:email/:student", teacherController.addStudents);