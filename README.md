# 📑 RFP Vendor Comparison and Management System

This project is a full-stack application designed to automate the process of sending Requests for Proposals (RFPs), receiving proposals via email, parsing the structured data from those proposals, and generating AI-assisted comparison reports to select the best vendor.

## 1. Project Setup

This section guides you through getting the entire application running locally.

### 1.a. Prerequisites



* **Node.js:** Version 22.18.0
* **MongoDB:** A running instance (Atlas cluster) for the database.
* **Ollama:**  Installed and running locally, accessible at `http://localhost:11434`. This is used for AI parsing and scoring.
  


### 1.b. Installation Steps


The repository and installation of dependencies are done through:

#### Backend Setup

1.  The backend directory:
    ```bash
    cd backend
    ```
2.  Installed dependencies:
    ```bash
    npm install
    ```
3.  Created a `.env` file in the `backend` directory 

#### Frontend Setup

1.  The frontend directory:
    ```bash
    cd frontend
    ```
2.  Installed dependencies:
    ```bash
    npm install
    ```


### 1.c. How to Configure Email Sending/Receiving

Email configuration is handled entirely through the backend/.env file.

Note on Gmail Security: Since Gmail does not allow login with a normal password for third-party applications, you must use an App Password:

Go to your Google Account → Security.

Enable 2-Step Verification.

Go to App Passwords.

Create a new App (select "Mail" and "Other (NodeJS)").

Google will generate a 16-character password. This 16-character password should be used for EMAIL_PASS and INBOUND_EMAIL_PASS in your .env file.

### 1.d.  How to run everything locally
#### Start the Backend (API Server & Email Worker):

cd backend
npx nodemon server.js

(Nodemon is used here for automatic restarts upon saving changes, which is a key development convenience.)
#### Start the Frontend (React App):

cd frontend
npm run dev




## 2. Tech Stack
Frontend: React,Tailwind

Backend: MongoDb, Node.js,Express.js,

DB: MongoDb

Email Solution: SMTP, IMAP

## 3. API Documentation


/api/rfps/analyze-rfp : (POST) - To create RFPS

/api/rfps/: (GET) - To get All RFPS

/api/rfps/:id : (GET) - To get a specific RFPS

/api/rfps/:id/proposals : (GET) -  To list all proposals for a RFPS

/api/rfps/:id/compare : (POST) - To compare proposals of a RFPS.

/api/vendors/ : (POST) - To create Vendors

/api/vendors/ : (GET) - To list all vendors

/api/vendors/send : (POST) - To send proposals from vendors

/api/vendors/:id : (GET) - To get a individual vendor


/api/dashboard/summary :  (GET) - To get dashboard summary

/api/proposals/:id  :(GET) - To  get individual proposals


## 4. Designs & Assumptions
a. Key Design Decision - In this project I have used MVC Architecture which is favourable as it is efficient and easy to understand.For Scoring the best vendors i have tried to use a rating system on a 1-5 scale.

b.Assumptions - The Schemas are designed focusing on the important fields needed for the project.

## 5. AI Tools Usage
###  Configuring Ollama
The system relies on a local LLM solution to maintain cost-effectiveness and flexibility, as services like OpenAI and Anthropic are not entirely free.

Installation: Ollama was installed from the official website.

Model Pull: The model phi3 was pulled locally using the command:

```bash

ollama pull phi3
 ```

Testing: The model's availability was verified by running:

```bash

ollama run phi3
```