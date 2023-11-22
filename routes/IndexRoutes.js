import express from "express";

import {router as teachersRouter} from './teachers.js';

export const router = express.Router();

router.use("/teachers", teachersRouter);