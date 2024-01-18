import bcrypt from 'bcrypt';


//functii utilizate pentru a ccesa atat conturile de profesori cat si de studenti din db


export async function createUser(model, user) {

	//verifica daca sunt userii se afla deja in db
	//daca sunt deja in db, nu mai pot fi adaugati din nou
	const duplicateUser = await model.findOne({ where: { email: user.email } });
	if (duplicateUser) throw new Error(`${model.name} already exists`);

	return await model.create(user);
}

export async function getUserById(model, id) {
	const user = await model.findByPk(id);
	if (!user) throw new Error(`${model.name} not found with id ${id}`);

	return user;
}

export async function getUserByEmailAndCheckPassword(model, email, password) {
	try {
		const user = await getUserByEmail(model, email);

		// verifica ca parola sa fie criptata in db
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) throw new Error(`${model.name} password does not match`);

		return user;
	} catch (e) {
		throw e;
	}
}

export async function getUserByEmail(model, email) {
	const user = await model.findOne({ where: { email } });
	if (!user) throw new Error(`${model.name} email not found`);

	return user;
}

export async function deleteUserById(model, id) {
	const user = await getUserById(model, id);
	await user.destroy();
}
