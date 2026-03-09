Vibin_Ramakrishnan – Admin Panel (Frontend + Backend)
This project is a complete web-based admin system built for managing bulk file uploads and administrative data operations. It includes:
A React + Tailwind frontend
A Node.js (Express + AdminJS) backend
A PostgreSQL database with Prisma ORM

--Repository
GitHub: https://github.com/Ashish-More-2023/Vibin_Ramakrishnan.git

--Tech Stack
Frontend
React.js
Tailwind CSS
JavaScript
Vite

--Backend
Node.js
Express.js
AdminJS
Prisma ORM
PostgreSQL

--Project Structure



<img width="500" height="250" alt="image" src="https://github.com/user-attachments/assets/6d082c93-7248-4407-a96d-5331b267f43d" />





--Envs
-frontend:
VITE_API_URL=backend_url 

-backend:
DATABASE_URL=postgresql url 
ADMIN_EMAIL="vibin@iitg.ac.in" 
ADMIN_PASSWORD="admin123" 
SESSION_SECRET="SECRETKEY" 
PORT=5000 
FRONTEND_URL=frontend_url 
BACKEND_URL=backend_url 
UPLOAD_PAGE_USERNAME="admin"
UPLOAD_PAGE_PASSWORD="admin123"

--Backend Setup:




<img width="326" height="200" alt="image" src="https://github.com/user-attachments/assets/b8468712-4e5c-42c1-a145-62f04c2821e8" />






This will:
Install backend dependencies
Generate Prisma client
Apply database migrations
Create the initial admin user
Start the backend server

--Frontend Setup:




<img width="190" height="106" alt="image" src="https://github.com/user-attachments/assets/d4f588e7-1b17-47e7-a490-bb32dc3490f2" />





This generates production-ready static files in the dist/ folder.

--Why seed:admin
This script creates a default admin user inside the database using the values from:
ADMIN_EMAIL
ADMIN_PASSWORD

This ensures that the first admin account is ready immediately after deployment.
Without running this command, you cannot log in to AdminJS for the first time.

--Contact
For any kind of help:

Developer: Ashish More
Email: more.ananda@iitg.ac.in
Department / Roll Number: Energy/230151014
