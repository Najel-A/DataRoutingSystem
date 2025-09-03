from fastapi import APIRouter
from datetime import datetime
from ..services.scoring import feature_weights

router = APIRouter()

@router.get("/")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "routing-microservice"
    }

@router.get("/metrics")
async def get_metrics():
    return {
        "feature_weights": feature_weights,
        "service_version": "1.0.0",
        "ml_enhancements": True,
        "scoring_algorithm": "comprehensive_weighted_scoring"
    }
