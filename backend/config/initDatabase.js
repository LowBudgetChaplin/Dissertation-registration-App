import mainRequest from '../models/mainRequest.js';
import preRequest from '../models/preRequest.js';
import professor from '../models/professor.js';
import registrationSession from '../models/registrationSession.js';
import student from '../models/student.js';

async function initDatabase() {
	// professor to Student - Many-to-One relationship
	professor.hasMany(student, { foreignKey: 'assignedprofessorId' });
	student.belongsTo(professor, { foreignKey: 'assignedprofessorId' });

	// Student to PreRequest - Many-to-One relationship
	student.hasMany(preRequest, { foreignKey: 'studentId' });
	preRequest.belongsTo(student, { foreignKey: 'studentId' });

	// RegistrationSession to PreRequest - Many-to-One relationship
	registrationSession.hasMany(preRequest, { foreignKey: 'sessionId' });
	preRequest.belongsTo(registrationSession, { foreignKey: 'sessionId' });

	// professor to RegistrationSession - Many-to-One relationship
	professor.hasMany(registrationSession, { foreignKey: 'professorId' });
	registrationSession.belongsTo(professor, { foreignKey: 'professorId' });

	// professor to MainRequest - Many-to-One relationship
	professor.hasMany(mainRequest, { foreignKey: 'professorId' });
	mainRequest.belongsTo(professor, { foreignKey: 'professorId' });

	// Student to MainRequest - One-to-One relationship
	student.hasOne(mainRequest, { foreignKey: 'studentId' });
	mainRequest.belongsTo(student, { foreignKey: 'studentId' });
}

export default initDatabase;
