import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import UserContext from "../contexts/UserContext";
import { BLUE } from "../constants/colors";
import "../styles/header.css";

function Header() {
    const user = useContext(UserContext);

    return (
        <Navbar style={{ backgroundColor: BLUE }} expand="sm" className="py-3" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-5 text-white">
                    LastRace
                </Navbar.Brand>
                <Nav className="ms-auto align-items-center gap-2">
                    {user.username ? <LoggedInNav name={user.username} /> : <LoginButton />}
                </Nav>
            </Container>
        </Navbar>
    );
}

function LoggedInNav({ name }) {
    return (
        <div className="d-flex align-items-center gap-2">
            <Link to="/leaderboard" className="nav-pill px-3 py-1 text-decoration-none fw-medium">
                Leaderboard
            </Link>
            <div className="nav-pill d-flex align-items-center px-3 py-1 gap-2">
                <span className="fw-medium">{name}</span>
                <span className="nav-separator">|</span>
                <Link to="/logout" className="nav-signout text-decoration-none">
                    Sign out
                </Link>
            </div>
        </div>
    );
}

function LoginButton() {
    const navigate = useNavigate();
    return (
        <button className="nav-pill nav-pill-login fw-semibold px-3 py-1" onClick={() => navigate("/login")}>
            Log In
        </button>
    );
}

export default Header;
