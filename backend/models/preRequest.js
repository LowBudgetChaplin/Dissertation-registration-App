import { Sequelize } from 'sequelize';
import db from '../config/database.js';
import { getRegistrationSessionById, getRegistrationSessionByprofessorId, verifyRegistrationSessionHasSlots } from './registrationSession.js';
import student from './student.js';
import { getUserById } from './user.js';

const preRequest = db.define('PreRequest', {
	preRequestId: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	studentId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	sessionId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	status: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	justification: {
		type: Sequelize.STRING,
		allowNull: true,
	},
});

export default preRequest;

export async function rejectPreRequest(id, justification) {
	try {
		let request = await getPreRequestById(id);
		if (request.dataValues.status != 'pending') throw new Error('Cannot edit non-pending PreRequest');

		request.status = 'rejected';
		request.justification = justification;
		return await request.save();
	} catch (e) {
		throw e;
	}
}

export async function acceptPreRequest(id) {
	try {
		let request = await getPreRequestById(id);
		if (request.dataValues.status != 'pending') throw new Error('Cannot edit non-pending PreRequest');

		let user = await getUserById(student, request.dataValues.studentId);
		let session = await getRegistrationSessionById(request.dataValues.sessionId);

		// verifica daca sesiunea de inregistrare mai are locuri
		if (await verifyRegistrationSessionHasSlots(session.dataValues.sessionId)) {
			session.currentStudents += 1;
			await session.save();
		}

		request.status = 'accepted';
		user.assignedprofessorId = session.dataValues.professorId;
		await user.save();
		return await request.save();
	} catch (e) {
		throw e;
	}
}

export async function getPreRequestsByStudentId(id) {
	return await preRequest.findAll({ where: { studentId: id } });
}

export async function getPreRequestsFromRegistrationSessionByprofessorId(id) {
	try {
		let session = await getRegistrationSessionByprofessorId(id);
		let requests = await getPreRequestsBySessionId(session.dataValues.sessionId);
		return requests;
	} catch (e) {
		throw e;
	}
}

export async function getPreRequestsBySessionId(id) {
	const requests = await preRequest.findAll({
		where: {
			sessionId: id,
		},
		include: [
			{
				model: student,
			},
		],
	});
	return requests;
}

export async function getPreRequestById(id) {
	const request = await preRequest.findByPk(id);
	if (!request) throw new Error('PreRequest not found');

	return request;
}

export async function createPreRequest(request) {
	const { studentId, sessionId, title } = request;

	let status = 'pending';
	let foundStudent;
	let foundSession;

	//verifica daca id-ul studentului si al sesiunii exista in db
	try {
		foundSession = (await getRegistrationSessionById(sessionId)).dataValues;
		foundStudent = (await getUserById(student, studentId)).dataValues;
	} catch (e) {
		throw e;
	}

	
	try {
		await verifyRegistrationSessionHasSlots(foundSession.sessionId);
	} catch (e) {
		throw e;
	}

	// verifica daca studentul are sau nu deja un profesor asignat
	if (foundStudent.assignedprofessorId) throw new Error('Student already has an assigned professor');
	
	//verifica daca studentul are deja un prerequest pentru profesor
	let duplicatePreRequest = await preRequest.findOne({
		where: {
			studentId: foundStudent.studentId,
			sessionId: foundSession.sessionId,
		},
	});
	if (duplicatePreRequest) throw new Error('Student already sent a prerequest to this session');

	try {
		return await preRequest.create({ studentId, sessionId, status, title });
	} catch (e) {
		throw e;
	}
}
