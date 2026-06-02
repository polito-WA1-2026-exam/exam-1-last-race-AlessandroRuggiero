import { useState, useEffect } from "react";
import { doLogin, doLogout } from "../api/auth";
import { useNavigate } from "react-router";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { MetroDot, MetroConnector } from "./Metro";
import { PURPLE } from "../models/colors";

function LoginForm(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errormsg, setErrormsg] = useState("");

    const doSubmit = async (ev) => {
        ev.preventDefault();
        setErrormsg("");
        try {
            const user = await doLogin(username, password);
            props.doLogin(user);
        } catch (ex) {
            setErrormsg(ex.message);
        }
    };

    return (
        <Container className="py-5" style={{ maxWidth: "420px" }}>
            <div className="d-flex align-items-center mb-3">
                <MetroDot color={PURPLE} size="lg" />
                <MetroConnector color={PURPLE} vertical={false} />
                <MetroDot color={PURPLE} size="lg" />
                <MetroConnector color={PURPLE} vertical={false} />
                <MetroDot color={PURPLE} size="lg" />
            </div>
            <h1 className="fw-bold mb-1" style={{ letterSpacing: "-0.02em" }}>
                Sign In
            </h1>
            {errormsg && (
                <Alert variant="danger" className="py-2 mb-4">
                    {errormsg}
                </Alert>
            )}
            <Form onSubmit={doSubmit}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="fw-semibold">Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(ev) => setUsername(ev.target.value)}
                        autoComplete="username"
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
                <Button
                    type="submit"
                    className="fw-bold w-100"
                    style={{ backgroundColor: PURPLE, borderColor: PURPLE }}
                >
                    Log In
                </Button>
            </Form>
        </Container>
    );
}

function Logout({ doLogin }) {
    const navigate = useNavigate();

    useEffect(() => {
        doLogout().then(() => {
            doLogin({ id: undefined, email: undefined, name: undefined });
            navigate("/");
        });
    }, [doLogin, navigate]);

    return "Logging out...";
}

export { LoginForm, Logout };
