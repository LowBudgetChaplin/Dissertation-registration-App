import { Sequelize } from 'sequelize';
import db from '../config/database.js';

const student = db.define('Student', {
	studentId: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	assignedprofessorId: {
		type: Sequelize.INTEGER,
		allowNull: true,
	},
});

export default student;

export async function checkIfStudentHasAssignedprofessor(studentId) {
	try {
		const student = await student.findByPk(studentId);

		return student && student.assignedprofessorId != null;
	} catch (e) {
		throw new Error('Student not found');
	}
}
