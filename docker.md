Here's the updated **`docker.md`** file with instructions for setting up both the **frontend (React + Vite)** and **backend (FastAPI)** using Docker.  

---

### **`docker.md` - Docker Setup Instructions**
```markdown
# Docker Setup Instructions (Full Stack: Frontend + Backend + MongoDB)

## 1️⃣ Prerequisites
Ensure you have **Docker** and **Docker Compose** installed on your system.

## 2️⃣ Setup Environment Variables
- Navigate to the `backend` directory and create a `.env` file:
   ```bash
   cp backend/.env.example backend/.env
   ```
- Update `.env` with the required values (e.g., database connection, API keys).

## 3️⃣ Build and Start the Containers
Run the following command from the **project root directory**:
   ```bash
   docker-compose up --build
   ```

## 4️⃣ Access the Application
- **Frontend (React) via Nginx:** [http://localhost:3000](http://localhost:3000)
- **Backend (FastAPI):**
  - **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
  - **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **MongoDB is running locally on port `27017`** (Accessible from the backend).

## 5️⃣ Stopping the Containers
To stop all services, run:
   ```bash
   docker-compose down
   ```

## 6️⃣ Viewing Logs
To monitor the logs of running containers:
   ```bash
   docker-compose logs -f
   ```

## 7️⃣ Notes
- The `uploads` directory in the backend is **persisted using a Docker volume**.
- The frontend is served using **Nginx** for optimal performance.
- If you make changes to the frontend or backend, restart the containers:
   ```bash
   docker-compose up --build
   ```
```