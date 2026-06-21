import { useState, useEffect } from "react";
import { doLogin, doLogout } from "../api/auth";
import { useNavigate, useLocation } from "react-router";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { MetroDot, MetroConnector } from "../components/Metro";
import { BLUE } from "../constants/colors";
import "../styles/panels.css";

function LoginForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errormsg, setErrormsg] = useState("");

    const doSubmit = async (ev) => {
        ev.preventDefault();
        setErrormsg("");
        try {
            const user = await doLogin(email, password);
            props.doLogin(user);
        } catch (ex) {
            setErrormsg(ex.message);
        }
    };

    return (
        <Container className="py-5" style={{ maxWidth: "420px" }}>
            <div className="d-flex align-items-center mb-3">
                <MetroDot color={BLUE} size="lg" />
                <MetroConnector color={BLUE} vertical={false} />
                <MetroDot color={BLUE} size="lg" />
                <MetroConnector color={BLUE} vertical={false} />
                <MetroDot color={BLUE} size="lg" />
            </div>
            <h1 className="lr-title mb-1">
                Sign In
            </h1>
            {errormsg && (
                <Alert variant="danger" className="py-2 mb-4">
                    {errormsg}
                </Alert>
            )}
            <Form onSubmit={doSubmit}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        autoComplete="email"
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="password">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        autoComplete="current-password"
                    />
                </Form.Group>
                <Button type="submit" className="fw-bold w-100" style={{ backgroundColor: BLUE, borderColor: BLUE }}>
                    Log In
                </Button>
            </Form>
        </Container>
    );
}

function Logout({ doLogin }) {
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        doLogout().then(() => {
            doLogin({ id: undefined, email: undefined, username: undefined });
            navigate(state?.returnTo ?? "/");
        });
    }, [doLogin, navigate, state]);

    return "Logging out...";
}

export { LoginForm, Logout };
