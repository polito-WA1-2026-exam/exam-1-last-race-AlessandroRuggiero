import { useContext } from "react"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { Link, useNavigate } from 'react-router'

import UserContext from "../contexts/UserContext"

function Header() {
  const user = useContext(UserContext)
  const destination = user.id ? '/home' : '/'

  return (
    <Navbar bg="light" expand="sm" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to={destination} className="fw-bold fs-4">
          LastRace
        </Navbar.Brand>
        <Nav className="ms-auto align-items-center gap-2">
          {user.username ? <UserInfo name={user.username} /> : <LoginButton />}
        </Nav>
      </Container>
    </Navbar>
  )
}

function LoginButton() {
  const navigate = useNavigate()
  return <Button variant="outline-primary" onClick={() => navigate('/login')}>Log In</Button>
}

function UserInfo({ name }) {
  return (
    <>
      <Navbar.Text>{name}</Navbar.Text>
      <Button as={Link} to="/logout" variant="outline-danger" size="sm">Logout</Button>
    </>
  )
}

export default Header