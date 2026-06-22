# Exam #1: "Last Race"

## Student: s358751 Ruggiero Alessandro

## React Client Application Routes

- Route `/`: Home page. Shows the game description and "How to Play" instructions. Displays a "Log in to Play" button for unauthenticated users, or a "Start a game" button for authenticated users.
- Route `/login`: Login page. Contains the login form, on success redirects to `/`.
- Route `/logout`: Logout page. Clears the session and redirects to `/login` (or an optional `returnTo` location from router state).
- Route `/play`: New game setup page. Shows the full Tunnelbana metro network map so the player can study it. A "Ready" button opens a confirmation modal, then creates a new game and navigates to `/play/:id`.
- Route `/play/:id`: Active game page. `:id` is the numeric game ID. Cycles through three phases: route picking (90-second timer), event reveal (one stop at a time), and final score. If the game is already finished (answer already submitted or answer not submitted in time) it jumps directly to the results.
- Route `/leaderboard`: Leaderboard page. Shows the top 10 users with the best completed games ranked by coins, with player name, route, date, time taken, and coin score. Hovering a route shows the full station-by-station path in a popover.

## API Server

### Authentication

- POST `/api/sessions`
    - request body:
        ```json
        { "email": "string", "password": "string" }
        ```
    - response body: the logged-in user (401 on wrong credentials, 422 on missing fields)
        ```json
        { "id": number, "email": "string", "username": "string" }
        ```
- GET `/api/sessions/current`
    - request parameters: none (uses the session cookie)
    - response body: the current user (401 if not authenticated)
        ```json
        { "id": number, "email": "string", "username": "string" }
        ```
- DELETE `/api/sessions/current`
    - request parameters: none
    - response body: empty (logs the user out)

### Game (all require authentication)

- GET `/api/network`
    - request parameters: none
    - response body:
        ```json
        {
            "connections": [
                {
                    "id": "number",
                    "station1": "string",
                    "station2": "string",
                    "line": "string"
                }
            ],
            "lines": ["string"],
            "stations": ["string"]
        }
        ```
- POST `/api/games`
    - request parameters: none
    - response body: the new game
        ```json
        {
            "id": number,
            "startStation": "string",
            "endStation": "string",
            "userId": number,
            "startTime": number,
            "status": "active",
            "coins": 0,
            "answer": null
        }
        ```
- GET `/api/games/:id`
    - request parameters: `id` (game id, integer ≥ 1)
    - response body: the game (404 if not found / not owned; an `active` game past the time limit is reported as `lost`)
        ```json
        {
            "id": number,
            "startStation": "string",
            "endStation": "string",
            "userId": number,
            "startTime": number,
            "status": "string",
            "coins": number,
            "answer": [number] | null
        }
        ```
- POST `/api/games/:id/answer`
    - request parameters: `id` (game id)
    - request body: the ordered list of selected connection ids
        ```json
        { "connections": [number] }
        ```
    - response body: (409 if already completed or over the time limit)
        ```json
        {
            "status": "won" | "lost",
            "coins": number,
            "happenedEvents": [{ "id": number, "description": "string", "effect": number }],
            "answer": [number]
        }
        ```
- GET `/api/leaderboard`
    - request parameters: `count` (optional query, integer 1 to 250, default 10)
    - response body: ranked array of best won games from best to worst
        ```json
        [{
            "username": "string",
            "userId": number,
            "coins": number,
            "answer": [number],
            "startStation": "string",
            "endStation": "string",
            "startTime": number,
            "endTime": number
        }]
        ```

## Database Tables

- Table `users` - registered users with authentication credentials. Columns: `id` (PK), `email` (unique), `username`, `salt` and `hash` (scrypt-hashed password credentials).
- Table `lines` - metro lines of the network. Columns: `id` (PK), `color` (the line identifier/color).
- Table `stations` - metro stations. Columns: `id` (PK), `name` (unique station name).
- Table `connections` - connections linking two stations on a line. Columns: `id` (PK), `line_id` (FK to `lines`), `station1_id` and `station2_id` (FK to `stations`).
- Table `events` - the random events that can occur during a journey. Columns: `id` (PK), `description` (text shown to the player), `effect` (coin delta, positive or negative, -4 to 4).
- Table `games` - game sessions an their current state. Columns: `id` (PK), `status` (`active`/`won`/`lost`), `start_station_id` and `end_station_id` (FK to `stations`), `user_id` (FK to `users`), `start_time` and `end_time` (epoch timestamps, `end_time` is `NULL` while game is in `active` state), `coins` (final score), `answer` (JSON-encoded ordered list of the chosen connection ids, `NULL` until submitted). An index `idx_games_leaderboard` on `(user_id, status, coins)` speeds up leaderboard queries.

## Main React Components

- `Header` (in `Header.jsx`): top navigation bar. Shows the name of the game (as a link that navigates to the home page). Denepending on the session state it displays the Log In button (if the user is not authenticated ) or the username, the Sign Out button and the Leaderboard button if the user is logged in.
- `NewGame` (in `pages/game/NewGame.jsx`): displays the full network map to study and a "Ready" modal that creates the game and routes to it.
- `PlayGame` (in `pages/game/PlayGame.jsx`): orchestrates an active game, fetching it when needed and switching between the route-picking, event-reveal, and results phases.
- `PickRoute` (in `pages/game/PickRoute.jsx`): route-picking phase. Runs the 90-second countdown and lets the player select and order the connection segments of their route.
- `DisplayEvents` (in `pages/game/DisplayEvents.jsx`): event-reveal. Replays the journey stop by stop, showing the random event and coin change at each station.
- `DisplayFinishedGame` (in `pages/game/DisplayFinishedGame.jsx`): final result screen showing win/loss outcome and the coin score.
- `LeaderBoard` (in `pages/LeaderBoard.jsx`): fetches and renders the ranked table of completed games, with a route preview popover per entry.
- `MetroMap` (in `components/MetroMap.jsx`): SVG map of the Stockholm Tunnelbana; can render with or without colored lines.
- `TicketFull` (in `components/Ticket.jsx`): boarding-pass style card used in the "Ready" modal and in `PickRoute`.
- `Metro` (in `components/Metro.jsx`): collection of reusable building blocks (`MetroDot`, `MetroConnector`, `MetroStop`, `ConnectionItem`, `RoutePreview`, `JourneyTrack`) for rendering metro-style lines, stops, and route segments.

## Screenshot

### Login

![Login page](./img/Screenshot%20from%202026-06-22%2018-59-31.png)

### Home / How to Play

![Home page with how-to-play instructions](./img/Screenshot%20from%202026-06-22%2018-40-15.png)

### Network map (study phase)

![Full Tunnelbana network map](./img/Screenshot%20from%202026-06-22%2018-42-48.png)

### Route picking phase

![Route picking phase](./img/Screenshot%20from%202026-06-22%2018-24-55.png)

### Event reveal

![Per-segment event reveal](./img/Screenshot%20from%202026-06-22%2019-03-18.png)

### Result (won)

![You won result screen](./img/Screenshot%20from%202026-06-22%2019-03-25.png)

### Result (lost)

![You lost result screen](./img/Screenshot%20from%202026-06-22%2018-25-18.png)

### Leaderboard

![Leaderboard](./img/Screenshot%20from%202026-06-22%2018-40-47.png)

## Users Credentials

| Username      | Email                             | Password               |
| ------------- | --------------------------------- | ---------------------- |
| Alessandro    | alessandro.ruggiero.dev@gmail.com | ale-password           |
| StudentMaster | s358751@studenti.polito.it        | studentMaster-password |
| Student       | s309582@studenti.polito.it        | student-password       |

## Use of AI Tools

Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.

- Github Copilot inline suggestions: very useful to speed up coding but it does not have a full understanding of the codebase.
  For this reason I accepted its output only if it was precisely what i wanted to write anyway, in any other cases i just ignored it, as it often leads to many inconsistencies.
- Claude Online Chat: I used Claude for help setting up the devcontainer and for fixing bugs in animations and CSS. Since it has no direct access to the codebase, its output always required adaptation, so I treated it as a starting point and integrated it in the codebase.
  It was also used to help me edit in bulk features of the SVG that forms the map as it is a tedious process.
