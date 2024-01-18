import cors from 'cors';
import express from 'express';
import initDatabase from './config/initDatabase.js';
import accountRoutes from './routes/accountRoutes.js';
import mainRequestRoutes from './routes/mainRequestRoutes.js';
import preRequestRoutes from './routes/preRequestRoutes.js';
import registerSessionRoutes from './routes/registerSessionRoutes.js';

// configurare server
let port =8080;
let app = express();
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(
	cors
	({
		origin: '*',
	})
);

// initiliazare db
initDatabase();

//routers
app.use('/api', accountRoutes);
app.use('/api', registerSessionRoutes);
app.use('/api', preRequestRoutes);
app.use('/api', mainRequestRoutes);

// start the server
app.listen(port, () => {
	console.log("The server is listening on port: " + port);
});
