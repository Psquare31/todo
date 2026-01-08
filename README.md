Two-User Todo (Vite + React + Express + MongoDB)

Overview
- Small todo app for two users. No authentication.
- Each user has their own column (desktop) or stacked layout (mobile).
- Todos support subtasks; users can add/delete/mark complete.
- Minimalist soothing theme: creme / olive / beige.

Setup
1. Install dependencies for server and client:

```powershell
cd "c:\Coding\WebDEv\Overnight projects\Todo List\server"
npm install

cd "c:\Coding\WebDEv\Overnight projects\Todo List\client"
npm install
```

2. Start MongoDB locally (or set `MONGO_URI` env var). Copy `.env.example` to `.env` in the `server` folder if needed.

3. Run server and client in separate terminals:

```powershell
# Terminal 1
cd "c:\Coding\WebDEv\Overnight projects\Todo List\server"
npm run dev

# Terminal 2
cd "c:\Coding\WebDEv\Overnight projects\Todo List\client"
npm run dev
```

API
- GET `/api/todos?user=1|2` - list todos for user
- POST `/api/todos` { user, title, subtasks? }
- PUT `/api/todos/:id` { ...updates }
- DELETE `/api/todos/:id`

Files changed/created
- [server/index.js](server/index.js)
- [server/models/Todo.js](server/models/Todo.js)
- [client/src/App.jsx](client/src/App.jsx)
- [client/src/components/TodoList.jsx](client/src/components/TodoList.jsx)
- [client/src/components/TodoItem.jsx](client/src/components/TodoItem.jsx)
- [client/src/styles.css](client/src/styles.css)

Next steps
- If you want, I can add a single `npm start` root script to run both concurrently.
- I can also add simple seed data or Docker config.

Hosting guide (MongoDB Atlas + Render or GCP Cloud Run)

1) Create a free MongoDB Atlas cluster
- Sign up at https://www.mongodb.com/cloud/atlas and create a free (Shared) cluster.
- Create a database user and whitelist your IP (or 0.0.0.0/0 for testing).
- In Atlas, click Connect → Connect Your Application and copy the connection string. Replace `<password>` and the default DB name with `two_user_todos`.

2) Option A — Single-container deploy to GCP Cloud Run (recommended free tier)
- I added a `Dockerfile` at the repo root that builds the client and runs the server.
- Build and test locally (you need Docker and gcloud installed):

```powershell
# build locally
docker build -t two-user-todo:local .
# run locally (expose port 4000)
docker run -p 4000:4000 -e MONGO_URI="<your-mongo-uri>" two-user-todo:local
```

- Deploy to Cloud Run:

```powershell
# set project
gcloud config set project YOUR_PROJECT_ID
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/two-user-todo
gcloud run deploy two-user-todo --image gcr.io/YOUR_PROJECT_ID/two-user-todo --platform managed --region us-central1 --allow-unauthenticated --set-env-vars MONGO_URI="<your-mongo-uri>"
```

3) Option B — Render (easy GitHub-based deploy)
- Push your repo to GitHub.
- In Render, create a new Web Service and connect your GitHub repo.
- Set the build command (root) to:

```
npm --prefix server run build:client
```

- Set the start command to:

```
node server/index.js
```

- In Render service settings, add an environment variable `MONGO_URI` with your Atlas connection string.

Notes & tips
- I included `server/scripts/build-client.js` and `server/package.json` script `build:client` which installs and builds the client then copies `dist` into `server/public` so the Node server will serve the static files.
- For CI/CD: both Render and Cloud Run will rebuild on each push when configured with GitHub.
- If you want, I can add a simple GitHub Actions workflow to build the Docker image and push to Google Container Registry / Render automatically.
