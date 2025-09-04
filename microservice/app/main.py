from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import routing, health
from .core.config import get_settings
import uvicorn

settings = get_settings()

app = FastAPI(
    title="User Routing Microservice",
    description="Advanced routing algorithms for user-interviewer matching",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(routing.router, tags=["Routing"])
app.include_router(health.router, tags=["Health"])

@app.get("/")
async def root():
    return {"message": "User Routing Microservice", "status": "active"}

# Debug: Print registered routes on startup
@app.on_event("startup")
async def print_routes():
    import logging
    logger = logging.getLogger(__name__)
    logger.info("Registered routes:")
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            logger.info(f"  {list(route.methods)} {route.path}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
