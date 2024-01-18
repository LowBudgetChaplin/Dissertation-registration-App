import express from 'express';
import { verifyprofessor, verifyStudent, verifyToken } from '../middleware/authMiddleware.js';
import { acceptPreRequest, createPreRequest, getPreRequestsByStudentId, getPreRequestsFromRegistrationSessionByprofessorId, rejectPreRequest, getPreRequestsBySessionId } from '../models/preRequest.js';

const preRequestRoutes = express.Router();


// accept a prerequest
preRequestRoutes.route('/prerequest/accept').put(verifyprofessor, async (req, res) => {
	// returns the preRequest data
	const requestId = req.body.id;
	
	if (!requestId) return res.status(400).json('Bad Request');
	
	try {
		let request = await acceptPreRequest(requestId);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// reject a prerequest
preRequestRoutes.route('/prerequest/reject').put(verifyprofessor, async (req, res) => {
	const { requestId, justification } = req.body;
	if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await rejectPreRequest(requestId, justification);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// returneaza toate preRequest-urile pt un id de student
preRequestRoutes.route('/prerequest/student/:studentId').get(verifyStudent, async (req, res) => {
	//returneaza toate preRequest-urile penru un id de student
	const studentId = req.params.studentId;
	if (!studentId) return res.status(400).json('Bad Request');

	try {
		let requests = await getPreRequestsByStudentId(studentId);
		return res.status(200).json(requests);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

//returneaza toate preRequest-urile penru un id de profesor
preRequestRoutes.route('/prerequest/professor/:professorId').get(verifyprofessor, async (req, res) => {
	const professorId = req.params.professorId;
	if (!professorId) return res.status(400).json('Bad Request');

	try {
		let requests = await getPreRequestsFromRegistrationSessionByprofessorId(professorId);
		return res.status(200).json(requests);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});


// get - preRequest in functie de session id
preRequestRoutes.route('/prerequest/:sessionId').get(verifyprofessor, async (req, res) => {
	//returneaza toate preRequest-urile penru un session id
    const sessionId = req.params.sessionId;
    if (!sessionId) return res.status(400).json('Bad Request');

    try {
        let requests = await getPreRequestsBySessionId(sessionId);
        return res.status(200).json(requests);
    } catch (e) {
        console.warn(e.stack);
        return res.status(500).json(e.message);
    }
});


// get - preRequest in functie de id
preRequestRoutes.route('/prerequest/:id').get(verifyToken, async (req, res) => {
	// returneaza the preRequest data


	const id = req.params.id;
	if (!id) return res.status(400).json('Bad Request');

	try {
		let request = await getPreRequestById(id);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// create preRequest
preRequestRoutes.route('/prerequest').post(verifyStudent, async (req, res) => {
	// returneaza the preRequest data
	const { studentId, sessionId, title } = req.body;

	// check malformed request
	if (!studentId || !sessionId || !title) return res.status(400).json('Bad Request');

	try {
		const session = await createPreRequest({ studentId, sessionId, title });
		return res.status(200).json(session);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

export default preRequestRoutes;
