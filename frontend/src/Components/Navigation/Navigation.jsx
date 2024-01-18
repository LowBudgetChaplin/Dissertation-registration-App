import toast, { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
	const navigate = useNavigate();
	return (
		<>
			<div>
				<Toaster position="bottom-right" reverseOrder={false} />
			</div>
			<div className="navContainer">
				
				<div className="navTitle">Dissertation registration</div>
				<div className="navButtons">
					<div className="logout"
						onClick={() => {
							if (localStorage.getItem('token') !== null)
							 {
								navigate('/login');
								localStorage.removeItem('token');
								toast.success('Logged out successfully!');
							}
						}}>
							Logout
					</div>
				</div>
			</div>
			<div className="outlet">
				<Outlet />
			</div>
		</>
	);
}

export default Navigation;
