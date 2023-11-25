import express from "express";

import {router as teachersRouter} from './teachers.js';

import {router as studentRouter} from './students.js';

export const router = express.Router();

router.use("/teachers", teachersRouter);

router.use("/students", studentRouter);