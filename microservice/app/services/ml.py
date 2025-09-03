from ..models.schemas import User, Interviewer
from ..services.scoring import calculate_comprehensive_score
import numpy as np

def apply_ml_enhancement(user: User, interviewers: list[Interviewer]):
    enhanced_scores = []
    for interviewer in interviewers:
        base = calculate_comprehensive_score(user, interviewer)
        if user.interviewHistory:
            durations = [i.duration for i in user.interviewHistory]
            avg_duration = np.mean(durations)
            duration_compatibility = 1.0 - min(abs(avg_duration-30)/60,1.0)
            costs = [i.cost for i in user.interviewHistory]
            cost_sensitivity = 1.0 - min(np.std(costs)/100,1.0)
            ml_adj = (duration_compatibility+cost_sensitivity)/2
            enhanced = base['weighted_score']*(0.8+0.2*ml_adj)
        else:
            enhanced = base['weighted_score']
        enhanced_scores.append({
            'interviewer': interviewer,
            'base_score': base,
            'enhanced_score': enhanced,
            'final_score': enhanced
        })
    return enhanced_scores
