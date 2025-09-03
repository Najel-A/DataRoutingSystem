from ..models.schemas import User, Interviewer
import numpy as np

feature_weights = {
    'language_match': 0.25,
    'experience_match': 0.20,
    'specialization_match': 0.20,
    'load_balance': 0.15,
    'cost_efficiency': 0.10,
    'rating_match': 0.10
}

def calculate_language_match(user: User, interviewer: Interviewer) -> float:
    user_lang = user.preferences.preferredLanguage.lower()
    interviewer_langs = [lang.lower() for lang in interviewer.languages]
    if user_lang in interviewer_langs:
        return 1.0
    elif 'english' in interviewer_langs and user_lang != 'english':
        return 0.7
    return 0.0

def calculate_experience_match(user: User, interviewer: Interviewer) -> float:
    education_map = {'High School': 1, 'Bachelor': 2, 'Master': 3, 'PhD': 4}
    user_level = education_map.get(user.education, 2)
    if interviewer.experience <= 3:
        interviewer_level = 1
    elif interviewer.experience <= 7:
        interviewer_level = 2
    elif interviewer.experience <= 12:
        interviewer_level = 3
    else:
        interviewer_level = 4
    diff = abs(user_level - interviewer_level)
    return {0:1.0,1:0.8,2:0.6}.get(diff,0.3)

def calculate_specialization_match(user: User, interviewer: Interviewer) -> float:
    industry_specialization_map = {
        'Technology': ['Technical','General'],
        'Healthcare': ['Specialist','General'],
        'Finance': ['Specialist','General'],
        'Education': ['Cultural','Leadership'],
        'Manufacturing': ['Technical','General']
    }
    if user.industry in industry_specialization_map:
        if interviewer.specialization in industry_specialization_map[user.industry]:
            return 1.0
        elif interviewer.specialization == 'General':
            return 0.7
        return 0.4
    return 0.5

def calculate_load_balance(interviewer: Interviewer) -> float:
    ratio = interviewer.currentLoad / interviewer.maxLoad
    if ratio <= 0.3: return 1.0
    elif ratio <= 0.6: return 0.8
    elif ratio <= 0.8: return 0.6
    return 0.3

def calculate_cost_efficiency(user: User, interviewer: Interviewer) -> float:
    user_avg_cost = user.metadata.averageInterviewCost
    est_cost = interviewer.costPerHour
    if est_cost <= user_avg_cost*0.8: return 1.0
    elif est_cost <= user_avg_cost: return 0.8
    elif est_cost <= user_avg_cost*1.2: return 0.6
    return 0.3

def calculate_rating_match(user: User, interviewer: Interviewer) -> float:
    avg_rating = np.mean([i.rating for i in user.interviewHistory]) if user.interviewHistory else 3.0
    diff = abs(avg_rating - interviewer.rating)
    if diff <= 0.5: return 1.0
    elif diff <= 1.0: return 0.8
    elif diff <= 1.5: return 0.6
    return 0.4

def calculate_comprehensive_score(user: User, interviewer: Interviewer):
    scores = {
        'language_match': calculate_language_match(user, interviewer),
        'experience_match': calculate_experience_match(user, interviewer),
        'specialization_match': calculate_specialization_match(user, interviewer),
        'load_balance': calculate_load_balance(interviewer),
        'cost_efficiency': calculate_cost_efficiency(user, interviewer),
        'rating_match': calculate_rating_match(user, interviewer)
    }
    weighted = sum(scores[f]*feature_weights[f] for f in scores)
    confidence = min(1.0, len(user.interviewHistory)/5.0)
    return {'scores': scores, 'weighted_score': weighted, 'confidence': confidence}
