# Research Opportunity Portal

A web-based application for managing research opportunities at the university. Faculty members can post, view, update, and manage research openings through this portal.

## GitHub Repository

GitHub Repository: https://github.com/Haris-bin-shakeel/research-opportunity-portal

## Demo Video

Demo Video: https://drive.google.com/file/d/1fkidkHOVr7vVjHQJYoWI9CNIOZTNIzRU/view?usp=drive_link

## Technologies Used

- **Backend:** Node.js with Express.js
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript (Vanilla)

## Project Structure

```
research-opportunity-portal/
├── backend/
│   ├── routes/
│   │   └── opportunities.js    # API routes for CRUD operations
│   ├── db.js                   # MySQL database connection
│   ├── server.js               # Express server setup
│   ├── .env                    # Environment variables (not in repo)
│   ├── .env.example            # Example env file
│   └── package.json
├── frontend/
│   ├── index.html              # Main HTML page
│   ├── style.css               # Stylesheet
│   └── script.js               # Frontend JavaScript
├── database/
│   └── schema.sql              # Database schema and sample data
├── postman/
│   └── Research_Opportunity_Portal.postman_collection.json
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or above)
- **MySQL** (v5.7 or above)
- **npm** (comes with Node.js)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Haris-bin-shakeel/research-opportunity-portal.git
cd research-opportunity-portal
```

### Step 2: Setup the Database

1. Open MySQL command line or MySQL Workbench
2. Run the schema file:

```sql
source database/schema.sql;
```

Or copy and paste the contents of `database/schema.sql` into your MySQL client and execute it.

### Step 3: Configure Environment Variables

1. Go to the `backend/` folder
2. Create a `.env` file (or copy from `.env.example`):

```bash
cd backend
cp .env.example .env
```

3. Open `.env` and update your MySQL password:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=research_portal
PORT=3000
```

### Step 4: Install Dependencies

```bash
cd backend
npm install
```

### Step 5: Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### Step 6: Open the Application

Open your browser and go to: `http://localhost:3000`

## API Endpoints

| Method | Endpoint                   | Description                        |
|--------|----------------------------|------------------------------------|
| POST   | `/api/opportunities`       | Create a new opportunity           |
| GET    | `/api/opportunities`       | Retrieve all opportunities         |
| GET    | `/api/opportunities/:id`   | Retrieve a specific opportunity    |
| PUT    | `/api/opportunities/:id`   | Update an existing opportunity     |
| DELETE | `/api/opportunities/:id`   | Delete an opportunity              |

## HTTP Status Codes Used

- `200 OK` – Successful retrieval, update, or deletion
- `201 Created` – Successfully created a new opportunity
- `400 Bad Request` – Missing or invalid input data
- `404 Not Found` – Opportunity with given ID does not exist
- `500 Internal Server Error` – Server-side error

## Testing with Postman

The exported Postman collection is included in the `postman/` folder. Import it into Postman to test all the API endpoints.

## Author

**Name:** Muhammad Haris
**Registration No:** 24P-0638
**Class:** BCS-5A
**Course:** Computer Networks (CN)
**University:** FAST NUCES, Peshawar
