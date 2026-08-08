# MiniStudio - Low Level Design (LLD)

# 1. Folder Structure

MiniStudio

```
MiniStudio
│
├── client
│   ├── src
│   │   ├── components
│   │   │      ├── Login.jsx
│   │   │      ├── Register.jsx
│   │   │      ├── Editor.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   └── server.js
```

---

# 2. Frontend Component Design

## App.jsx

Responsibilities

- React Router setup
- Navigation
- Route protection

---

## Login.jsx

Responsibilities

- Collect email/password
- Send login request
- Store JWT token
- Redirect to editor

---

## Register.jsx

Responsibilities

- Create account
- Validate user input
- Send registration request

---

## Editor.jsx

Responsibilities

- Initialize Fabric Canvas
- Add Text
- Add Shapes
- Upload Images
- Save Design
- Load Design
- Rename Design
- Delete Design
- Undo / Redo
- Download PNG

State Variables

- designs
- color
- fontSize
- fontFamily

Hooks Used

- useState
- useEffect
- useRef

---

# 3. Backend Design

Routes

Authentication

POST /register

POST /login

Design APIs

GET /designs

POST /designs

PUT /designs/:id

DELETE /designs/:id

---

# 4. Controller Responsibilities

Auth Controller

- Register user
- Login user
- Generate JWT

Design Controller

- Create Design
- Get Designs
- Update Design
- Delete Design

---

# 5. Middleware

JWT Middleware

Responsibilities

- Read Authorization header
- Extract JWT
- Verify token
- Add user information to request
- Block unauthorized requests

---

# 6. Database Schema

Users

```
User

username

email

password
```

Design

```
Design

title

canvasData

user

createdAt

updatedAt
```

---

# 7. Authentication Sequence

User

↓

Login Page

↓

Axios POST /login

↓

Express Route

↓

Controller

↓

JWT Generated

↓

Frontend stores JWT

↓

Authorization Header

↓

Protected APIs

---

# 8. Save Design Sequence

Editor

↓

Canvas.toJSON()

↓

Axios POST

↓

JWT Middleware

↓

Controller

↓

Mongoose

↓

MongoDB

↓

Response

↓

Refresh Sidebar

---

# 9. Load Design Sequence

Sidebar

↓

Axios GET

↓

Backend

↓

MongoDB

↓

Canvas.loadFromJSON()

↓

Canvas Render

---

# 10. Technology Choices

React

Reason

Component based architecture

Fabric.js

Reason

Canvas object manipulation

MongoDB

Reason

Stores JSON naturally

JWT

Reason

Stateless authentication

Axios

Reason

Promise based HTTP client

Express

Reason

REST API framework

---

# 11. Error Handling

Frontend

- Try Catch
- Alert Messages
- Token Check

Backend

- Try Catch
- 400
- 401
- 404
- 500

---

# 12. Current Features

Authentication

JWT

Canvas Editing

Text

Rectangle

Circle

Image Upload

Font Change

Color Change

Font Size

Center Alignment

Undo

Redo

Download

Design CRUD

Save

Load

Rename

Delete

---

# 13. Future Enhancements

Templates

Layers

Real-time Collaboration

AI Design Suggestions

Version History

Cloud Deployment