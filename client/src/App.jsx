import { useNavigate, Routes, Route, Outlet } from "react-router";
import "./App.css";
import { useEffect, useState } from "react";
import UserContext from "./contexts/UserContext";
import { checkSession } from "./api/auth";
import { LoginForm, Logout } from "./pages/Auth";
import Header from "./components/Header";
import Home from "./pages/Home";
import NewGame from "./pages/game/NewGame";
import PlayGame from "./pages/game/PlayGame";
import LeaderBoard from "./pages/LeaderBoard";

function App() {
    const navigate = useNavigate();

    // get login session
    const [user, setUser] = useState({
        id: undefined,
        email: undefined,
        name: undefined,
    });

    useEffect(() => {
        checkSession()
            .then((result) => {
                if (result) {
                    console.log("Session check successful: " + JSON.stringify(result));
                    setUser({
                        id: result.id,
                        email: result.email,
                        username: result.username,
                    });
                }
            })
            .catch(() => {
                console.log("Session check failed");
            });
    }, []);

    // Login action handler
    const doLogin = (newUser) => {
        setUser({
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
        });
        navigate("/");
    };

    return (
        <>
            <UserContext.Provider value={user}>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index path="/" element={<Home />} />
                        <Route path="login" element={<LoginForm doLogin={doLogin} />} />
                        <Route path="logout" element={<Logout doLogin={doLogin} />} />
                        <Route path="play" element={<NewGame />} />
                        <Route path="play/:id" element={<PlayGame />} />
                        <Route path="leaderboard" element={<LeaderBoard />} />
                    </Route>
                </Routes>
            </UserContext.Provider>
        </>
    );
}

function MainLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default App;
