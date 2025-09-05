# User Data Routing System

A prototype real-time user data routing system built with Node.js, FastAPI, and React. The system demonstrates generatation of synthetic data, routing algorithms, and lvie system design for interview scheduling and user management.

## Overview

### Core Functionality
- **Synthetic Data Generation**: Automatically generates 100+ realistic user profiles with comprehensive interview history
- **Intelligent Routing**: ML-powered algorithms that match users to optimal interviewers based on multiple criteria
- **Real-time Processing**: Live routing decisions with immediate feedback and system updates
- **Scalable Architecture**: Microservice-based design for high performance and reliability

### Advanced Routing Algorithm
- **Multi-factor Scoring**: Language compatibility, experience matching, specialization alignment
- **Load Balancing**: Intelligent workload distribution across available interviewers
- **Cost Optimization**: Cost-effective matching while maintaining quality standards
- **ML Enhancements**: Behavioral pattern analysis and predictive scoring

### Data Management
- **Rich User Profiles**: Demographics, education, industry, preferences, interview history
- **Interviewer Management**: Type classification, specialization, availability tracking
- **Performance Metrics**: Comprehensive analytics and real-time monitoring
- **Historical Tracking**: Complete routing decision audit trail


## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ React Frontend  │    │  Node.js Backend │    │ Python FastAPI  │
│                 │    │                  │    │  Microservice   │
│  - Dashboard    │◄──►│  - User Mgmt     │◄──►│  - ML Routing   │
│  - User Mgmt    │    │  - Data Gen      │    │  - Algorithms   │
│  - Live Routing │    │  - API Gateway   │    │  - Scoring      │
│  - Analytics    │    │  - Fallback      │    │  - Optimization │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

The architecture follows a backend monolithic that utilizes a microservice to handle the routing of a user to an interviewer.

## Run Project Locally
### 1. Clone and Setup
```bash
git clone <repository-url>
cd DataRoutingSystem
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:3001`

### 3. Python Microservice Setup
```bash
cd microservice
pip install -r requirements.txt
python main.py
```
Microservice will run on `http://localhost:8000`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend will run on `http://localhost:3000`

## .env Setup

**Backend (.env)**
```env
PORT=3001
MICROSERVICE_URL=http://localhost:8000
```

**Microservice (.env)**
```env
PORT=8000
LOG_LEVEL=INFO
```

## API Endpoints

### Backend API
- `GET /api/health` - System health check
- `GET /api/users` - List users with pagination and search
- `GET /api/users/:id` - Get specific user details
- `POST /api/route` - Route user to interviewer
- `GET /api/routing-history` - View routing decisions
- `GET /api/interviewers` - List all interviewers
- `GET /api/stats` - System statistics and metrics

### Microservice API
- `GET /` - Service status
- `GET /health` - Health check
- `POST /route` - Advanced routing with ML scoring
- `GET /metrics` - Algorithm performance metrics

