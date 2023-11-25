import express from "express";

import * as studentController from "../controllers/studentController.js";

export const router = express.Router();

router.get("/", studentController.getStudents);

router.get("/:email", studentController.getStudentsByEmail);

router.post("/", studentController.createStudent);

router.put("/:email", studentController.updateStudent);

router.delete("/:email", studentController.removeStudent);

router.get("/:email/:teacher", studentController.addTeacher);