import express from 'express';
import { verifyprofessor, verifyStudent } from '../middleware/authMiddleware.js';
import { createRegistrationSession, getAllActiveRegistrationSessions, getAllRegistrationSessionByprofessorId, getRegistrationSessionById } from '../models/registrationSession.js';

const registerSessionRoutes = express.Router();

registerSessionRoutes.route('/registration-session/').get(verifyStudent, async (req, res) => {

	try {
		const sessions = await getAllActiveRegistrationSessions();
		return res.status(200).json(sessions);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

registerSessionRoutes.route('/registration-sessionId/:sessionId').get(async (req, res) => {
	//returnează un array pentru id-ul profesorului
	try {
		const session = await getRegistrationSessionById(req.params.sessionId);
		return res.status(200).json(session);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

registerSessionRoutes.route('/registration-session/:professorId').get(verifyprofessor, async (req, res) => {
	//returnează un array pentru id-ul profesorului
	try {
		const sessions = await getAllRegistrationSessionByprofessorId(req.params.professorId);
		return res.status(200).json(sessions);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

registerSessionRoutes.route('/registration-session/create').post(verifyprofessor, async (req, res) => {

	let { professorId, startTime, endTime, maxStudents } = req.body;
	if (!professorId || !startTime || !endTime || !maxStudents) return res.status(400).json('Bad Request');

	const today = new Date().getTime();

	// validitatea startTime-lui si endTime-lui
	if (!(startTime < endTime || endTime < today)) return res.status(400).json('Bad request: date problem');

	// verifica ca minimul de studenti sa fie cel putin 1 dintr-o sesiune de inscriere
	if (maxStudents < 0) return res.status(400).json('Bad request: incorrect max students');

	try {
		const session = await createRegistrationSession({ professorId, startTime, endTime, maxStudents });
		return res.status(201).json(session);
	} catch (e) {
		return res.status(500).json(e.message);
	}
});

export default registerSessionRoutes;
