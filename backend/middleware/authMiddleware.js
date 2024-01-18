import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config/const.js';

export const verifyToken = (req, res, next) => {
	// verifica header-ul sa aiba authorization field
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json('Authorization header not provided');
	}

	// verifica existenta token-ului
	const token = authHeader.split(' ')[1];
	if (!token) {
		return res.status(401).json('No token provided');
	}

	// verifica token-ul
	jwt.verify(token, JWT_KEY, (err, decodedToken) => {
		if (err) {
			return res.status(401).json('Invalid token');
		}
		req.decodedToken = decodedToken;
		next();
	});
};

// verifica daca token-ul este al studentului
export const verifyStudent = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.decodedToken.role === 'Student') {
			next();
		} else {
			return res.status(403).json('Forbidden');
		}
	});
};

// verifica daca token-ul este al profesorului
export const verifyprofessor = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.decodedToken.role === 'professor') {
			next();
		} else {
			return res.status(403).json('Forbidden');
		}
	});
};
