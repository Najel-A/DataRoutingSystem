const { v4: uuidv4 } = require('uuid');

// In-memory storage for users and routing data
let users = [];
let routingHistory = [];
let activeInterviewers = [];

// Generate synthetic user data
function generateSyntheticUsers(count = 100) {
  const demographics = ['White', 'Hispanic', 'Black', 'Asian', 'Other'];
  const educationLevels = ['High School', 'Bachelor', 'Master', 'PhD'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing'];
  
  for (let i = 0; i < count; i++) {
    const user = {
      id: uuidv4(),
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: Math.floor(Math.random() * 50) + 18,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      demographic: demographics[Math.floor(Math.random() * demographics.length)],
      education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      location: {
        city: `City ${Math.floor(Math.random() * 20) + 1}`,
        state: `State ${Math.floor(Math.random() * 10) + 1}`,
        country: 'USA'
      },
      interviewHistory: generateInterviewHistory(),
      metadata: {
        averageInterviewTime: Math.floor(Math.random() * 60) + 15, // minutes
        averageInterviewCost: Math.floor(Math.random() * 200) + 50, // dollars
        totalInterviews: Math.floor(Math.random() * 10) + 1,
        lastInterviewDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      preferences: {
        preferredLanguage: Math.random() > 0.8 ? 'Spanish' : 'English',
        preferredTime: Math.random() > 0.5 ? 'Morning' : 'Afternoon',
        specialNeeds: Math.random() > 0.9 ? 'Accessibility required' : null
      }
    };
    users.push(user);
  }
}

// Generate interview history for each user
function generateInterviewHistory() {
  const count = Math.floor(Math.random() * 5) + 1;
  const history = [];
  
  for (let i = 0; i < count; i++) {
    const interview = {
      id: uuidv4(),
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      duration: Math.floor(Math.random() * 60) + 15,
      cost: Math.floor(Math.random() * 200) + 50,
      interviewer: `Interviewer ${Math.floor(Math.random() * 20) + 1}`,
      rating: Math.floor(Math.random() * 5) + 1,
      notes: `Interview ${i + 1} notes for user`,
      outcome: Math.random() > 0.5 ? 'Successful' : 'Needs follow-up',
      transcript: generateInterviewTranscript(i + 1)
    };
    history.push(interview);
  }
  
  return history;
}

// Generate realistic interview transcripts
function generateInterviewTranscript(interviewNumber) {
  const transcriptTemplates = [
    {
      title: "Technical Skills Assessment",
      content: `Interviewer: "Good morning! Thank you for joining us today. Let's start with your technical background. Can you walk me through your experience with [technology]?"

Candidate: "Absolutely. I've been working with [technology] for about [X] years. In my previous role at [Company], I was responsible for [specific task]. One project that stands out is when I [specific achievement]."

Interviewer: "That's impressive. How do you approach debugging complex issues?"

Candidate: "I follow a systematic approach. First, I [methodology]. Then I [process]. I've found that [insight] helps me identify the root cause more efficiently."

Interviewer: "Great methodology. Any questions about our technical stack or the role?"

Candidate: "Yes, I'm curious about [specific question]. Also, how does the team handle [process]?"`
    },
    {
      title: "Behavioral Interview",
      content: `Interviewer: "Welcome! Today we'll focus on behavioral questions. Tell me about a time when you had to work with a difficult team member."

Candidate: "I had a situation where a colleague and I had conflicting approaches to a project. I [action taken]. We ended up [outcome]. I learned that [lesson learned]."

Interviewer: "Excellent example. How do you handle tight deadlines?"

Candidate: "I prioritize tasks based on [criteria]. I also [strategy]. For instance, when [specific situation], I [action] which resulted in [positive outcome]."

Interviewer: "That shows good time management. What motivates you in your work?"

Candidate: "I'm motivated by [motivation]. I particularly enjoy [aspect] because [reason]. I'm always looking to [growth area]."`
    },
    {
      title: "Cultural Fit Assessment",
      content: `Interviewer: "Thanks for coming in! Let's talk about our company culture. How do you prefer to collaborate with others?"

Candidate: "I thrive in collaborative environments. I believe in [philosophy]. In my experience, [example of collaboration]."

Interviewer: "That aligns well with our values. How do you handle feedback?"

Candidate: "I welcome constructive feedback. I see it as [perspective]. When I received feedback about [area], I [response] and [result]."

Interviewer: "Perfect. What does work-life balance mean to you?"

Candidate: "I believe in [philosophy]. I've found that [strategy] helps me maintain [balance]. I'm also [additional insight]."

Interviewer: "Great perspective. Any questions about our company culture?"`
    },
    {
      title: "Problem-Solving Session",
      content: `Interviewer: "Let's work through a scenario together. Imagine you're tasked with [scenario]. How would you approach this?"

Candidate: "First, I'd [initial step]. Then I'd [analysis]. Based on that, I'd [strategy]. I'd also consider [factors]."

Interviewer: "Interesting approach. What if [constraint]?"

Candidate: "That would change my approach. I'd [modified strategy]. I might also [alternative approach] to ensure [goal]."

Interviewer: "Good thinking. How would you measure success?"

Candidate: "I'd track [metrics]. I'd also [evaluation method]. The key indicators would be [specific measures]."

Interviewer: "Excellent framework. Any other considerations?"

Candidate: "I'd also think about [additional factors] and [long-term implications]."`
    },
    {
      title: "Leadership Discussion",
      content: `Interviewer: "Tell me about your leadership experience. How do you motivate a team?"

Candidate: "I believe in [leadership philosophy]. I've led teams by [approach]. For example, when [situation], I [action] which resulted in [outcome]."

Interviewer: "How do you handle conflict within your team?"

Candidate: "I address conflicts [method]. I've found that [strategy] works well. In one instance, [specific example]."

Interviewer: "What's your approach to delegation?"

Candidate: "I delegate based on [criteria]. I ensure [process]. I've learned that [insight] leads to better outcomes."

Interviewer: "How do you develop your team members?"

Candidate: "I focus on [development approach]. I provide [support]. I've seen team members grow in [areas] through [methods]."`
    }
  ];

  const template = transcriptTemplates[Math.floor(Math.random() * transcriptTemplates.length)];
  
  // Add some variation to make transcripts more realistic
  const variations = [
    "The candidate showed strong communication skills throughout the interview.",
    "There were some technical gaps that we discussed further.",
    "The candidate demonstrated excellent problem-solving abilities.",
    "We had a good discussion about career goals and aspirations.",
    "The candidate asked thoughtful questions about the role and company.",
    "There were some areas where additional experience would be beneficial.",
    "The candidate showed enthusiasm and cultural fit.",
    "We discussed potential challenges and how to address them."
  ];

  const additionalNotes = variations[Math.floor(Math.random() * variations.length)];
  
  return {
    title: template.title,
    content: template.content,
    summary: `Interview ${interviewNumber} focused on ${template.title.toLowerCase()}. ${additionalNotes}`,
    keyPoints: [
      "Candidate demonstrated relevant experience",
      "Good communication and interpersonal skills",
      "Showed interest in the role and company",
      "Asked appropriate questions about the position"
    ],
    duration: Math.floor(Math.random() * 45) + 30, // 30-75 minutes
    interviewerNotes: `Overall positive impression. Candidate shows potential for the role. ${Math.random() > 0.5 ? 'Recommended for next round.' : 'Would benefit from additional experience in specific areas.'}`
  };
}

// Initialize active interviewers
function initializeInterviewers() {
  const interviewerTypes = ['Senior', 'Junior', 'Specialist', 'General'];
  const specializations = ['Technical', 'Behavioral', 'Cultural', 'Leadership'];
  
  for (let i = 0; i < 25; i++) {
    const interviewer = {
      id: uuidv4(),
      name: `Interviewer ${i + 1}`,
      type: interviewerTypes[Math.floor(Math.random() * interviewerTypes.length)],
      specialization: specializations[Math.floor(Math.random() * specializations.length)],
      experience: Math.floor(Math.random() * 15) + 1,
      availability: Math.random() > 0.3, // 70% available
      currentLoad: Math.floor(Math.random() * 5),
      maxLoad: 8,
      rating: (Math.random() * 2) + 3, // 3-5 rating
      languages: Math.random() > 0.8 ? ['English', 'Spanish'] : ['English'],
      costPerHour: Math.floor(Math.random() * 100) + 50
    };
    activeInterviewers.push(interviewer);
  }
}

// Getter functions for data access
function getUsers() {
  return users;
}

function getRoutingHistory() {
  return routingHistory;
}

function getActiveInterviewers() {
  return activeInterviewers;
}

// Add routing decision to history
function addRoutingDecision(routingDecision) {
  routingHistory.push(routingDecision);
}

// Update interviewer load
function updateInterviewerLoad(interviewerId, increment = 1) {
  const interviewer = activeInterviewers.find(i => i.id === interviewerId);
  if (interviewer) {
    interviewer.currentLoad += increment;
    if (interviewer.currentLoad >= interviewer.maxLoad) {
      interviewer.availability = false;
    }
  }
}

module.exports = {
  generateSyntheticUsers,
  initializeInterviewers,
  getUsers,
  getRoutingHistory,
  getActiveInterviewers,
  addRoutingDecision,
  updateInterviewerLoad
};
