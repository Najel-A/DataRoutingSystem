from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class Location(BaseModel):
    city: str
    state: str
    country: str

class InterviewTranscript(BaseModel):
    title: str
    content: str
    summary: str
    keyPoints: List[str]
    duration: int
    interviewerNotes: str

class Interview(BaseModel):
    id: str
    date: str
    duration: int
    cost: float
    interviewer: str
    rating: int
    notes: str
    outcome: str
    transcript: Optional[InterviewTranscript] = None

class Metadata(BaseModel):
    averageInterviewTime: int
    averageInterviewCost: float
    totalInterviews: int
    lastInterviewDate: str

class Preferences(BaseModel):
    preferredLanguage: str
    preferredTime: str
    specialNeeds: Optional[str] = None

class User(BaseModel):
    id: str
    name: str
    email: str
    age: int
    gender: str
    demographic: str
    education: str
    industry: str
    location: Location
    interviewHistory: List[Interview]
    metadata: Metadata
    preferences: Preferences

class Interviewer(BaseModel):
    id: str
    name: str
    type: str
    specialization: str
    experience: int
    availability: bool
    currentLoad: int
    maxLoad: int
    rating: float
    languages: List[str]
    costPerHour: float

class RoutingRequest(BaseModel):
    user: User
    requirements: Dict[str, Any]
    availableInterviewers: List[Interviewer]

class RoutingResponse(BaseModel):
    interviewerId: str
    reason: str
    score: float
    confidence: float
    alternatives: List[Dict[str, Any]]
