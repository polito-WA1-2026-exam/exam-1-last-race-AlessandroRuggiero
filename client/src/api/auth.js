import baseUrl from "./baseurl";

async function doLogin(email, password) {
    const response = await fetch(`${baseUrl}/sessions`, {
        method: "POST",
        body: JSON.stringify({
            username: email,
            password: password,
        }),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        throw new Error("Login failed");
    }
}

async function doLogout() {
    const response = await fetch(`${baseUrl}/sessions/current`, {
        method: "DELETE",
        credentials: "include",
    });

    if (response.ok) {
        return true;
    } else {
        throw new Error("Logout failed");
    }
}

async function checkSession() {
    const response = await fetch(`${baseUrl}/sessions/current`, {
        credentials: "include",
    });
    if (response.ok) {
        return await response.json();
    } else {
        return null;
    }
}

export { doLogin, doLogout, checkSession };
