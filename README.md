

## **📝 Blog Management System**  
A **full-stack blog management system** with **admin and user authentication**, allowing admins to manage blogs, categories, and user interactions while users can read, comment, and like/dislike comments.

---

## **🚀 Features**  
### **🔹 Admin Features:**  
✅ **CRUD Operations** for Blogs, Categories, and Users with Images  
✅ **Admin Dashboard** (Total Users, Blogs, Likes, Dislikes, and Comments)  
✅ **Login with Passport.js (Local Strategy)**  
✅ **OTP-Based Password Reset**  
✅ **Secure Authentication & Authorization**  

### **🔹 User Features:**  
✅ **User Registration & Login (Local & Google OAuth)**  
✅ **View Blogs by Category**  
✅ **Comment on Blogs (if logged in)**  
✅ **Like & Dislike Comments**  

---

## **🛠️ Tech Stack**  
- **Frontend:** EJS, Bootstrap  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB Atlas  
- **Authentication:** Passport.js (Local & Google OAuth)  
- **Other:** OTP-based email verification, Admin panel  

---

## **📂 Project Structure**  
```
📦 blog-management-system  
 ┣ 📂 config/           # Configuration files (DB, Passport)  
 ┣ 📂 models/           # Mongoose schemas  
 ┣ 📂 routes/           # Express routes (User, Admin, Blog, Category)  
 ┣ 📂 views/            # EJS templates for frontend  
 ┣ 📂 public/           # Static files (CSS, JS)  
 ┣ 📜 server.js         # Main entry file  
 ┗ 📜 README.md         # Project documentation  
```

---

## **⚡ Installation & Setup**  

1️⃣ **Clone the repository:**  
```sh
git clone https://github.com/your-username/blog-management-system.git
cd blog-management-system
```

2️⃣ **Install dependencies:**  
```sh
npm install
```

3️⃣ **Set up environment variables:**  
Create a `.env` file in the root and add:  
```
PORT=5000  
MONGO_URI=your_mongodb_atlas_url  
SESSION_SECRET=your_secret_key  
GOOGLE_CLIENT_ID=your_google_client_id  
GOOGLE_CLIENT_SECRET=your_google_client_secret  
EMAIL_USER=your_email  
EMAIL_PASS=your_email_password  
```

4️⃣ **Run the server:**  
```sh
npm start
```
Your app will be running at **http://localhost:5000** 🚀  

---

## **🔑 Admin Credentials**  
- **Default Admin Login:**  
  ```
  Email: admin@example.com  
  Password: admin123  
  ```

---

## **📸 Screenshots**  
(📌 Add relevant screenshots here)  

---

## **📩 Contributing**  
Contributions are welcome! Feel free to submit a pull request.  

---

## **📜 License**  
This project is licensed under the **MIT License**.  

