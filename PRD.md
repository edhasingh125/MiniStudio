# MiniStudio - Product Requirements Document (PRD)

## 1. Project Overview

MiniStudio is a web-based graphic design editor inspired by Canva. It enables authenticated users to create, edit, save, manage, and download simple graphic designs using an interactive canvas powered by Fabric.js.

The project demonstrates full-stack web development using the MERN stack and implements authentication, CRUD operations, and real-time canvas editing.

---

## 2. Problem Statement

Many lightweight design tools either require installation or lack simple cloud-based design management.

MiniStudio solves this problem by allowing users to:

- Create designs online
- Edit designs using an interactive canvas
- Save designs to the cloud
- Reload previous designs
- Rename and delete saved work

---

## 3. Target Users

- Students
- Beginner designers
- Content creators
- Anyone needing a lightweight online design editor

---

## 4. Functional Requirements

### User Authentication

- Register
- Login
- JWT authentication
- Protected routes

### Design Editor

- Add text
- Add rectangles
- Add circles
- Upload images
- Change text color
- Change font
- Change font size
- Delete selected objects
- Undo / Redo
- Center selected objects

### Design Management

- Save design
- Load saved design
- Rename design
- Delete design

### Export

- Download design as PNG

---

## 5. Non-functional Requirements

- Responsive interface
- Fast loading
- Secure authentication
- Persistent cloud storage
- Easy-to-use interface

---

## 6. Tech Stack

Frontend

- React
- Axios
- Fabric.js

Backend

- Node.js
- Express.js
- JWT
- bcrypt

Database

- MongoDB
- Mongoose

---

## 7. Future Scope

- Multiple pages
- Templates
- Team collaboration
- Layers panel
- AI-powered design suggestions
- Real-time collaboration