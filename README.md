# Fragments UI

This is the frontend React app for the Fragments project. It connects to the backend Fragments API running on AWS ECS and provides an intuitive UI for users to manage their content fragments.

---

## 🌟 Features

- 🔐 **Login via Amazon Cognito Hosted UI**
- 📄 **Create new fragments** (Text, JSON, Markdown, HTML, Images)
- 🔄 **Convert between compatible types** (e.g., Markdown → HTML, PNG → JPEG)
- 📝 **Edit and delete existing fragments**
- 🔍 **Search/filter fragments by type, size, and creation date**
- 🧲 **Drag-and-drop image upload**
- 📡 Connects directly to backend API hosted on AWS ECS

---

## ⚙️ Tech Stack

- **React 19**
- **Bootstrap + Bamboo.css**
- **OIDC Client TS** for authentication
- **React Email + Resend** for user invites (bonus)

---

## 🧑‍💻 Local Setup

  ```bash
  # Install dependencies
  npm install
  
  # Start the frontend dev server
  npm start
  ```

Make sure the backend service is running on ECS and accessible via its load balancer URL.

---

## 📁 Environment Variables

- REACT_APP_API_URL
- REACT_APP_COGNITO_CLIENT_ID
- REACT_APP_COGNITO_DOMAIN
- REACT_APP_COGNITO_REDIRECT_URI

---

## 🔗 Related Projects

👉 Frontend Repo: [fragments](https://github.com/sunchit03/fragments)

---

## 📄 License

MIT
