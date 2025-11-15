# Concall-Analyser

A Go backend with React frontend for analyzing earnings call transcripts and extracting FY26 guidance.

## Features

- 📊 Fetch and process earnings call transcripts from BSE
- 🔍 Search concalls by company name
- 📄 List all concalls with pagination
- 🤖 AI-powered guidance extraction using Google Gemini
- 💾 MongoDB storage for processed data

## Frontend Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Setup

1. **Install frontend dependencies and build:**
   ```bash
   ./setup-frontend.sh
   ```
   
   Or manually:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Run the Go server:**
   ```bash
   go run cmd/main.go
   ```

3. **Access the application:**
   - Frontend: http://localhost:8080
   - API endpoints: http://localhost:8080/api/*

### Development Mode

For frontend development with hot-reload:

```bash
cd frontend
npm start
```

This runs the React dev server on http://localhost:3000 (proxies API calls to :8080)

## API Endpoints

- `GET /api/list_concalls?page=1&limit=10` - List all concalls with pagination
- `GET /api/find_concalls?name=CompanyName&page=1&limit=10` - Search concalls by company name
- `GET /api/fetch_concalls?from=YYYY-MM-DD&to=YYYY-MM-DD` - Fetch and process new concalls

## Project Structure

```
Concall-Analyser/
├── cmd/
│   └── main.go              # Main server entry point
├── frontend/
│   ├── build/               # Production build (generated)
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service
│   │   └── App.js           # Main app component
│   └── package.json
├── internal/
│   ├── controller/          # HTTP handlers
│   ├── usecase/             # Business logic
│   ├── db/                  # Database layer
│   └── domain/              # Domain models
└── config/                  # Configuration

```

## Improvements (Future)

- Analytics -> Unique Users, Total Views (RENO - Kafka, WebSockets/SSE)
- Watchlist
- Other Growth Triggers
- Sorting & filtering
- Login Flow
- Top searches for the week
- Database updates 