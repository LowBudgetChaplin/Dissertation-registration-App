import express from 'express';
import { uploadprofessor, uploadStudent } from '../config/multer.js';
import { verifyprofessor, verifyStudent, verifyToken } from '../middleware/authMiddleware.js';
import { acceptMainRequest, createMainRequest, getMainRequestById, getMainRequestByStudentId, getMainRequestsByprofessorId, rejectMainRequest, updateMainRequestWithprofessorFile, updateMainRequestWithStudentFile } from '../models/mainRequest.js';

const mainRequestRoutes = express.Router();



// accepta mainrequest
mainRequestRoutes.route('/mainrequest/accept').put(verifyprofessor, async (req, res) => {
	// returneaza the mainRequest data
	const { requestId } = req.body;

	if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await acceptMainRequest(requestId);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// reject mainrequest
mainRequestRoutes.route('/mainrequest/reject').put(verifyprofessor, async (req, res) => {
	const { requestId } = req.body;
	if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await rejectMainRequest(requestId);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// get mainRequest dupa id-ul studentului
mainRequestRoutes.route('/mainrequest/student/:studentId').get(async (req, res) => {
	// returneaza main reguest-ul dupa id-ul studentului
	const studentId = req.params.studentId;
	if (!studentId) return res.status(400).json('Bad Request');

	try {
		let request = await getMainRequestByStudentId(studentId);
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// get all mainRequests dupa id-ul profesorului
mainRequestRoutes.route('/mainrequest/professor/:professorId').get(verifyprofessor, async (req, res) => {
	// returneaza main reguest-ul dupa id-ul profesorului
	const professorId = req.params.professorId;
	if (!professorId) return res.status(400).json('Bad Request');

	try {
		let requests = await getMainRequestsByprofessorId(professorId);
		return res.status(200).json(requests);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// get mainRequest by id
mainRequestRoutes.route('/mainrequest/:requestId').get(verifyToken, async (req, res) => {
	// returneaza main reguest-ul
	const requestId = req.params.requestId;
	if (!requestId) return res.status(400).json('Bad Request');

	try {
		let request = await getMainRequestById(requestId);
		return res.status(200).json(request);
	} catch (e) {
		// console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

// create main request
mainRequestRoutes.route('/mainrequest').post(uploadStudent.single('file'), verifyStudent, async (req, res) => {
	// returneaza mainRequest data
	const { studentId, professorId } = req.body;

	let studentFilePath = req.file.path;
	if (!studentId || !professorId || !req.file) return res.status(400).json('Bad Request');

	try {
		let request = await createMainRequest({ studentFilePath, studentId, professorId });
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

mainRequestRoutes.route('/mainrequest/uploadStudentFile/:mainRequestId').put(uploadStudent.single('file'), async (req, res) => {
	// update mainRequest cu path-ul cererii semnate de student

	let studentFilePath = req.file.path;
	const id = req.params.mainRequestId;

	if (!req.file) return res.status(400).json('Bad Request');

	try {
		let request = await updateMainRequestWithStudentFile({ studentFilePath, id });
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

mainRequestRoutes.route('/mainrequest/uploadprofessorFile/:mainRequestId').put(uploadprofessor.single('file'), async (req, res) => {
	// update mainRequest cu path-ul cererii semnate de profesor



	let professorFilePath = req.file.path;
	const id = req.params.mainRequestId;

	if (!req.file) return res.status(400).json('Bad Request');

	try {
		let request = await updateMainRequestWithprofessorFile({ professorFilePath, id });
		return res.status(200).json(request);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

mainRequestRoutes.route('/mainrequest/downloadStudentFile/:mainRequestId').get(async (req, res) => {
	// returneaza mainRequest data
	const id = req.params.mainRequestId;
	if (!id) return res.status(400).json('Bad Request');

	try {
		let request = await getMainRequestById(id);
		return res.download(request.studentFilePath);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

mainRequestRoutes.route('/mainrequest/downloadprofessorFile/:mainRequestId').get(async (req, res) => {

	const id = req.params.mainRequestId;
	if (!id) return res.status(400).json('Bad Request');

	try {
		let request = await getMainRequestById(id);
		return res.download(request.professorFilePath);
	} catch (e) {
		console.warn(e.stack);
		return res.status(500).json(e.message);
	}
});

export default mainRequestRoutes;
