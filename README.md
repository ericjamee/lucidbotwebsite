# Lucid Bot Website

A modern chatbot solution built with React and .NET.

## Project Structure

- **Frontend**: React application with TypeScript and Tailwind CSS
- **Backend**: .NET 8 API with OpenAI integration

## Development Setup

### Frontend
```bash
cd Frontend/chatbot-client
npm install
npm start
```

### Backend
```bash
cd Backend/ChatbotApi
dotnet restore
dotnet run
```

## Production Deployment

The backend is deployed on Azure at https://lucidbotapp-f4hegdgqb8bpbvht.eastus-01.azurewebsites.net/

## Environment Configuration

- Frontend: Set `REACT_APP_API_URL` to point to your backend API
- Backend: Update CORS settings in `appsettings.json` to allow your frontend origins

## Features

- Chat interface with support for sending and receiving messages
- Integration with OpenAI API for AI-powered responses
- Markdown-style formatting support for responses
- Typing indicator animation
- Responsive design with Tailwind CSS

## Technologies Used

- Backend:
  - .NET 8
  - Azure.AI.OpenAI SDK
  - ASP.NET Core Web API

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Axios for API calls
  - Heroicons 