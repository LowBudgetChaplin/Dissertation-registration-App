import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { url } from '../../Constants.js';
import './PhaseTwo.css';

function PhaseTwo() {
	const [isAccepted, setIsAccepted] = useState(false);
	const [acceptedSession, setAcceptedSession] = useState();
	const [isMainReqAccepted, setIsMainReqAccepted] = useState(false);
	const [idStudentMainReq, setIdStudent] = useState();
	const [idProfessorMainReq, setIdProfessor] = useState();

	const [file, setFile] = useState(0);

	const onDrop = useCallback((acceptedFiles) => {
		setFile(acceptedFiles.at(0));
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => onDrop(acceptedFiles, 1),
		multiple: false,
	});

	const handleSubmit = () => {
		if (isMainReqAccepted?.studentFilePath !== null && isMainReqAccepted) {
			const formData = new FormData();
			formData.append('file', file);

			axios
				.put(`${url}mainrequest/uploadStudentFile/${isMainReqAccepted?.mainRequestId}`, formData, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'multipart/form-data',
					},
				})
				.catch((err) => {
					toast.error(err.response.data);
				});
		} else {
			const formData = new FormData();
			formData.append('file', file);
			console.log(idStudentMainReq);
			formData.append('studentId', idStudentMainReq);
			console.log(idProfessorMainReq);
			formData.append('professorId', idProfessorMainReq);

			axios
				.post(`${url}mainrequest`, formData, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'multipart/form-data',
					},
				})
				.catch((err) => {
					toast.error(err.response.data);
				});
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios
				.post(`${url}validate-token`, {
					token: localStorage.getItem('token'),
				})
				.catch((err) => {
					toast.error(err.response.data);
				});

				console.log(response);

			
			axios
				.get(`${url}/registration-sessionId/${acceptedSession}`, {
				})
				.then((session) => {
					
					console.log(session.data.professorId);
					setIdProfessor(session.data.professorId);

				})
				.catch((err) => {});
			
			axios
				.get(`${url}mainrequest/student/${response.data.userId}`)
				.then((res) => {
					setIsMainReqAccepted(res.data);
				})
				.catch((err) => {});


			axios
				.get(`${url}/prerequest/student/${response.data.userId}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				})
				.then((prerequests) => {
					prerequests.data.map((prerequest) => {
						if (prerequest.status == 'accepted') {
							console.log(prerequest);
							setIsAccepted(true);
							setAcceptedSession(prerequest.sessionId);

					axios
						.get(`${url}/registration-sessionId/${prerequest.sessionId}`, {
						})
						.then((session) => {
							
							console.log(session.data.professorId);
							setIdProfessor(session.data.professorId);

						})
						.catch((err) => {});

							setIdStudent(prerequest.studentId);

							console.log(idStudentMainReq);
						}
					});
				})
				.catch((err) => {
					toast.error(err.response.data);
				});
		};

		fetchData();
	}, []);

	return (
		<div>
			{isMainReqAccepted?.status === 'accepted' ? (<div>Your professor accepted your request paper. You can download it when its signed</div>) : isMainReqAccepted?.studentFileUpload !== null && isMainReqAccepted?.status === 'pending' ? (
				<div>You already sent the request</div>) : (
				<div className="phaseTwoContainer">
					{!isAccepted ? (
						<div>No request accepted</div>
					) : (
						<div className="phaseTwoWrapper">
							<div className="text">{`You were accepted at session ${acceptedSession}`}</div>
							<div className="text">Upload the dissertation request</div>
						

							<div className="thesisDrop">
								<section>
									<div className="uploadArea" {...getRootProps()}>
										<input {...getInputProps()} />
										<span>Click / Drag here the dissertation request</span>
									</div>
								</section>
							</div>

							<button onClick={handleSubmit}>Submit</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default PhaseTwo;
