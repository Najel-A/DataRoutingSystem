from fastapi import APIRouter, HTTPException
from ..models.schemas import RoutingRequest, RoutingResponse
from ..services.ml import apply_ml_enhancement
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/test")
async def test_route():
    """Test route to verify router is working"""
    return {"message": "Routing router is working!", "status": "ok"}

@router.post("/route", response_model=RoutingResponse)
async def route_user(request: RoutingRequest):
    try:
        logger.info(f"Routing request for user: {request.user.id}")
        if not request.availableInterviewers:
            raise HTTPException(status_code=400, detail="No available interviewers")
        scores = apply_ml_enhancement(request.user, request.availableInterviewers)
        scores.sort(key=lambda x: x['final_score'], reverse=True)
        top = scores[0]
        reason_parts = []
        s = top['base_score']['scores']
        if s['language_match']>0.8: reason_parts.append("Excellent language match")
        if s['specialization_match']>0.8: reason_parts.append("Perfect specialization alignment")
        if s['load_balance']>0.8: reason_parts.append("Optimal workload distribution")
        if s['cost_efficiency']>0.8: reason_parts.append("Cost-effective option")
        reason = "; ".join(reason_parts) if reason_parts else "Best overall match"
        alternatives = [
            {
                "interviewerId": sc['interviewer'].id,
                "name": sc['interviewer'].name,
                "score": sc['final_score'],
                "reason": f"Alternative {i+1} with {sc['final_score']:.2f} score"
            }
            for i, sc in enumerate(scores[1:4])
        ]
        return RoutingResponse(
            interviewerId=top['interviewer'].id,
            reason=reason,
            score=top['final_score'],
            confidence=top['base_score']['confidence'],
            alternatives=alternatives
        )
    except Exception as e:
        logger.error(f"Error in routing: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Routing error: {str(e)}")
