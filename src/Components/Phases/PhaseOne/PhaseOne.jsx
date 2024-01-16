import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { url } from '../../Constants';
import './PhaseOne.css';

function PhaseOne() {
	const [professors, setprofessors] = useState([]);
	const [selectedSession, setSelectedSession] = useState();
	const [studentId, setStudentId] = useState();
	const [title, setTitle] = useState();
	const [isAccepted, setIsAccepted] = useState(false);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');

		if (storedToken) {
			const headers = {
				headers: {
					Authorization: `Bearer ${storedToken}`,
				},
			};

			//gets all sessions
			axios
				.get('http://localhost:8080/api/registration-session', headers)
				.then((res) => {
					setprofessors(res.data.map((professor) => professor));
				})
				.catch((err) => {
					toast.error(err.response.data);
				});

			//gets the current student logged in
			axios
				.post('http://localhost:8080/api/validate-token', { token: localStorage.getItem('token') })
				.then((res) => {
					setStudentId(res.data.userId);

					axios
						.get(`${url}/prerequest/student/${res.data.userId}`, headers)
						.then((res) => {
							res.data.map((prereq) => {
								if (prereq.status === 'accepted') {
									setIsAccepted(true);
								}
							});
						})
						.catch((err) => {
							toast.error(err.response.data);
						});
				})
				.catch((err) => {
					toast.error(err.response.data);
				});
		}
	}, []);

	const handleSubmit = () => {
		const storedToken = localStorage.getItem('token');
		const headers = {
			headers: {
				Authorization: `Bearer ${storedToken}`,
			},
		};
		const sessionId = parseInt(selectedSession);
		axios
			.post('http://localhost:8080/api/prerequest', { studentId, sessionId, title }, headers)
			.then(() => {
				toast.success('Request sent');
			})
			.catch((err) => {
				toast.error(err.response.data);
			});
	};

	return (
		<div>
			{isAccepted ? (
				<div>You were accepted! Upload the request for your professor to evaluate</div>
			) : (
				<div className="phaseOneContainer">
					<div className="textPhaseOne">
						<div>Choose professor</div>
					</div>
					<select
						className="dropdownprofessors"
						onChange={(e) => {
							setSelectedSession(e.target.value);
						}}
					>
						{professors.map((professor) => (
							<option key={professor.sessionId} value={professor.sessionId}>
								{'Session ' + professor.sessionId + ' professor ' + professor.professor.name}
							</option>
						))}
					</select>
					<div className="textPhaseOne">Title:</div>
					<input className="dropdownprofessors" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
					<button className="submitBtn" onClick={handleSubmit}>
						Submit
					</button>
				</div>
			)}
		</div>
	);
}

export default PhaseOne;
