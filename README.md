An AI-powered web app built with Next.js and Express.js that helps users compose professional emails based on prompts. Emails can then be sent via Nodemailer using the user's email address.
🚀 Features

    ✨ Compose emails using AI based on natural language prompts

    📩 Send composed emails via SMTP using Nodemailer

    🧠 Smart subject and body generation

    🔒 Authentication system with secure sessions

    📁 MongoDB backend for storing user data and emails

    🌐 Responsive frontend built with Next.js (App Router)

🛠️ Tech Stack

    Frontend: Next.js (React), Tailwind CSS

    Backend: Express.js, Node.js

    Database: MongoDB + Mongoose

    AI: OpenAI API (or whichever LLM used)

    Email: Nodemailer

    Auth: JWT or NextAuth (mention what you used)

🧪 Getting Started
1. Clone the Repo

git clone https://github.com/ayoeze191/MailAi.git
cd email-ai

2. Install Dependencies

npm install

3. Setup Environment Variables

Create a .env.local file in the root and add:

NEXT_PUBLIC_BASE_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=your_mongo_uri
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
JWT_SECRET=your_jwt_secret

4. Run the App

npm run dev
