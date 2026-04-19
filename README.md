# Sentinel - Frontend

This is the **frontend** of the Sentinel Safety App, designed to provide a secure and user-friendly interface for managing guardians, tracking live locations, and enabling safety features.

---

## 📌 Features
- **User Authentication**
  - Sign Up and Sign In pages
  - Clean UI for login/registration

- **Dashboard**
  - Central hub for accessing app features

- **Guardian Management**
  - Add, remove, and manage trusted guardians
  - `manage-guardians.js` handles guardian logic

- **Live Location Tracking**
  - Interactive map (`map.html`)
  - Supports real-time GPS tracking (requires backend integration)

- **Live Monitoring**
  - Placeholder for live video/audio streaming
  - To be integrated with device camera and backend services

- **User Profile**
  - Profile management page (`profilepage.html`)

- **Responsive Design**
  - Mobile-first layout with `responsive.css`
  - Works across devices

---

## 📂 Project Structure
```
Sentinel-Frontend/
├── index.html              # Main dashboard
├── signup.html             # User registration page
├── sign in.html            # User login page
├── profilepage.html        # Profile management
├── live.html               # Live monitoring (placeholder)
├── map.html                # Map with live GPS
├── guardians.html          # Guardian management
├── script.js               # General JS logic
├── manage-guardians.js     # Guardian management logic
├── map_script.js           # Map functionality
├── style.css               # Global styles
├── responsive.css          # Mobile-friendly styles
├── signstyle.css           # Signup page styles
├── signinstyle.css         # Login page styles
├── guradianstyle.css       # Guardians page styles
└── sentinel_icon.png       # App icon
```

---

## ⚙️ Setup Instructions
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/Sentinel-Frontend.git
   cd Sentinel-Frontend
   ```

2. Open `index.html` in your browser to explore the app.

---

## 🔗 Backend Integration 
This is a **frontend-only implementation**. To make it fully functional:
- Connect authentication forms to a backend (e.g., Flask, Node.js, or Firebase).
- Hook the map to live GPS data from the wearable device (via APIs).
- Enable real-time video/audio streaming on `live.html`.
- Store guardian and profile data in a secure database.
- you can access the backend code here - https://github.com/rehanhub-06/sentinal_app.be.git

---

## 📌 Tech Stack
- **HTML5**
- **CSS3** (Responsive, Mobile-First)
- **JavaScript (Vanilla JS)**
- **Leaflet.js** (for maps)

---

## 📷 Preview
<img width="392" height="850" alt="Screenshot 2026-03-13 100221" src="https://github.com/user-attachments/assets/34baa419-ab9f-4fb3-8ea8-977289103670" />  <img width="1899" height="936" alt="Screenshot 2026-03-13 100111" src="https://github.com/user-attachments/assets/e3e18501-63ac-462d-afc0-9dc17d3c1e47" />




