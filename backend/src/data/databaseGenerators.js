const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Interviewer = require('../models/Interviewer');
const RoutingHistory = require('../models/RoutingHistory');
const { query } = require('../config/database');

// Generate synthetic user data and save to database
async function generateSyntheticUsers(count = 100) {
  console.log(`$$$ Generating ${count} synthetic users...`);
  
  const demographics = ['White', 'Hispanic', 'Black', 'Asian', 'Other'];
  const educationLevels = ['High School', 'Bachelor', 'Master', 'PhD'];
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing'];
  
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const userData = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 65 }),
      gender: faker.person.sex(),
      demographic: demographics[Math.floor(Math.random() * demographics.length)],
      education: educationLevels[Math.floor(Math.random() * educationLevels.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      location: {
        city: faker.location.city(),
        state: faker.location.state(),
        country: 'USA'
      },
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

    try {
      const user = await User.create(userData);
      users.push(user);
      
      // Generate interview history for this user
      await generateInterviewHistory(user.id);
      
      if ((i + 1) % 10 === 0) {
        console.log(`$$$ Generated ${i + 1}/${count} users`);
      }
    } catch (error) {
      console.error(`$$$ Error creating user ${i + 1}:`, error.message);
    }
  }
  
  console.log(`$$$ Successfully generated ${users.length} users`);
  return users;
}

// Generate interview history for a user
async function generateInterviewHistory(userId) {
  const count = Math.floor(Math.random() * 5) + 1;
  
  for (let i = 0; i < count; i++) {
    const interviewData = {
      user_id: userId,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      duration: Math.floor(Math.random() * 60) + 15,
      cost: Math.floor(Math.random() * 200) + 50,
      interviewer_name: faker.person.fullName(),
      rating: Math.floor(Math.random() * 5) + 1,
      notes: `Interview ${i + 1} notes for user`,
      outcome: Math.random() > 0.5 ? 'Successful' : 'Needs follow-up',
      transcript: generateInterviewTranscript(i + 1)
    };

    try {
      await query(
        `INSERT INTO interviews (id, user_id, date, duration, cost, interviewer_name, rating, notes, outcome, transcript)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          uuidv4(),
          interviewData.user_id,
          interviewData.date,
          interviewData.duration,
          interviewData.cost,
          interviewData.interviewer_name,
          interviewData.rating,
          interviewData.notes,
          interviewData.outcome,
          JSON.stringify(interviewData.transcript)
        ]
      );
    } catch (error) {
      console.error('$$$ Error creating interview history:', error.message);
    }
  }
}

// Generate realistic interview transcripts using Faker
function generateInterviewTranscript(interviewNumber) {
  const interviewTypes = [
    "Technical Skills Assessment",
    "Behavioral Interview", 
    "Cultural Fit Assessment",
    "Problem-Solving Session",
    "Leadership Discussion",
    "Case Study Interview",
    "System Design Interview",
    "Product Management Interview"
  ];

  const title = faker.helpers.arrayElement(interviewTypes);
  
  // Generate dynamic content based on interview type
  const content = generateDynamicTranscriptContent(title);
  
  // Generate realistic summary using faker
  const summary = generateInterviewSummary(title, interviewNumber);
  
  // Generate dynamic key points
  const keyPoints = generateKeyPoints();
  
  // Generate realistic interviewer notes
  const interviewerNotes = generateInterviewerNotes();
  
  return {
    title: title,
    content: content,
    summary: summary,
    keyPoints: keyPoints,
    duration: faker.number.int({ min: 30, max: 90 }), // 30-90 minutes
    interviewerNotes: interviewerNotes
  };
}

// Generate dynamic transcript content based on interview type
function generateDynamicTranscriptContent(interviewType) {
  const interviewerName = faker.person.fullName();
  const candidateName = faker.person.firstName();
  const companyName = faker.company.name();
  const technology = faker.helpers.arrayElement(['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Science', 'DevOps']);
  const projectName = faker.company.buzzPhrase();
  
  const templates = {
    "Technical Skills Assessment": `Interviewer: "${faker.lorem.sentence({ min: 8, max: 15 })} Can you walk me through your experience with ${technology}?"

Candidate: "${faker.lorem.sentences(2)} In my previous role at ${faker.company.name()}, I was responsible for ${faker.lorem.words(3)}. One project that stands out is when I ${faker.lorem.sentence({ min: 6, max: 12 })}"

Interviewer: "${faker.lorem.sentence({ min: 8, max: 15 })} How do you approach debugging complex issues?"

Candidate: "${faker.lorem.sentences(2)} I follow a systematic approach. First, I ${faker.lorem.words(4)}. Then I ${faker.lorem.words(3)}. I've found that ${faker.lorem.sentence({ min: 5, max: 10 })}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} Any questions about our technical stack?"

Candidate: "${faker.lorem.sentences(2)} I'm curious about ${faker.lorem.words(3)}. Also, how does the team handle ${faker.lorem.words(2)}?"`,

    "Behavioral Interview": `Interviewer: "${faker.lorem.sentence({ min: 8, max: 15 })} Tell me about a time when you had to work with a difficult team member."

Candidate: "${faker.lorem.sentences(2)} I had a situation where a colleague and I had conflicting approaches to ${faker.lorem.words(2)}. I ${faker.lorem.words(3)}. We ended up ${faker.lorem.sentence({ min: 4, max: 8 })}. I learned that ${faker.lorem.sentence({ min: 5, max: 10 })}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} How do you handle tight deadlines?"

Candidate: "${faker.lorem.sentences(2)} I prioritize tasks based on ${faker.lorem.words(3)}. I also ${faker.lorem.words(2)}. For instance, when ${faker.lorem.sentence({ min: 4, max: 8 })}, I ${faker.lorem.words(2)} which resulted in ${faker.lorem.sentence({ min: 4, max: 8 })}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} What motivates you in your work?"

Candidate: "${faker.lorem.sentences(2)} I'm motivated by ${faker.lorem.words(2)}. I particularly enjoy ${faker.lorem.words(2)} because ${faker.lorem.sentence({ min: 4, max: 8 })}. I'm always looking to ${faker.lorem.words(3)}"`,

    "Cultural Fit Assessment": `Interviewer: "${faker.lorem.sentence({ min: 8, max: 15 })} How do you prefer to collaborate with others?"

Candidate: "${faker.lorem.sentences(2)} I thrive in ${faker.lorem.words(2)} environments. I believe in ${faker.lorem.words(3)}. In my experience, ${faker.lorem.sentence({ min: 5, max: 10 })}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} How do you handle feedback?"

Candidate: "${faker.lorem.sentences(2)} I welcome ${faker.lorem.words(2)} feedback. I see it as ${faker.lorem.words(2)}. When I received feedback about ${faker.lorem.words(2)}, I ${faker.lorem.words(2)} and ${faker.lorem.sentence({ min: 4, max: 8 })}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} What does work-life balance mean to you?"

Candidate: "${faker.lorem.sentences(2)} I believe in ${faker.lorem.words(3)}. I've found that ${faker.lorem.words(2)} helps me maintain ${faker.lorem.words(2)}. I'm also ${faker.lorem.sentence({ min: 4, max: 8 })}"`,

    "Problem-Solving Session": `Interviewer: "${faker.lorem.sentence({ min: 8, max: 15 })} Imagine you're tasked with ${faker.lorem.words(3)}. How would you approach this?"

Candidate: "${faker.lorem.sentences(2)} First, I'd ${faker.lorem.words(3)}. Then I'd ${faker.lorem.words(2)}. Based on that, I'd ${faker.lorem.words(3)}. I'd also consider ${faker.lorem.words(2)}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} What if ${faker.lorem.words(2)}?"

Candidate: "${faker.lorem.sentences(2)} That would change my approach. I'd ${faker.lorem.words(3)}. I might also ${faker.lorem.words(2)} to ensure ${faker.lorem.words(2)}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} How would you measure success?"

Candidate: "${faker.lorem.sentences(2)} I'd track ${faker.lorem.words(2)}. I'd also ${faker.lorem.words(2)}. The key indicators would be ${faker.lorem.words(3)}"`,

    "Leadership Discussion": `Interviewer: "${faker.lorem.sentence({ min: 8, max: 15 })} How do you motivate a team?"

Candidate: "${faker.lorem.sentences(2)} I believe in ${faker.lorem.words(3)}. I've led teams by ${faker.lorem.words(2)}. For example, when ${faker.lorem.sentence({ min: 4, max: 8 })}, I ${faker.lorem.words(2)} which resulted in ${faker.lorem.sentence({ min: 4, max: 8 })}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} How do you handle conflict within your team?"

Candidate: "${faker.lorem.sentences(2)} I address conflicts by ${faker.lorem.words(2)}. I've found that ${faker.lorem.words(2)} works well. In one instance, ${faker.lorem.sentence({ min: 5, max: 10 })}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} What's your approach to delegation?"

Candidate: "${faker.lorem.sentences(2)} I delegate based on ${faker.lorem.words(2)}. I ensure ${faker.lorem.words(2)}. I've learned that ${faker.lorem.sentence({ min: 5, max: 10 })}"`,

    "Case Study Interview": `Interviewer: "${faker.lorem.sentence({ min: 8, max: 15 })} Let's work through a case study about ${faker.lorem.words(3)}. How would you approach this?"

Candidate: "${faker.lorem.sentences(2)} I'd start by ${faker.lorem.words(3)}. Then I'd ${faker.lorem.words(2)} to understand ${faker.lorem.words(2)}. Based on that analysis, I'd ${faker.lorem.words(3)}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} What factors would you consider?"

Candidate: "${faker.lorem.sentences(2)} I'd look at ${faker.lorem.words(3)}, ${faker.lorem.words(2)}, and ${faker.lorem.words(2)}. I'd also consider ${faker.lorem.sentence({ min: 4, max: 8 })}"

Interviewer: "${faker.lorem.sentence({ min: 6, max: 12 })} How would you measure the success of your solution?"

Candidate: "${faker.lorem.sentences(2)} I'd track ${faker.lorem.words(2)} and ${faker.lorem.words(2)}. I'd also monitor ${faker.lorem.words(2)} to ensure ${faker.lorem.sentence({ min: 4, max: 8 })}"`
  };

  return templates[interviewType] || templates["Technical Skills Assessment"];
}

// Generate dynamic interview summary
function generateInterviewSummary(interviewType, interviewNumber) {
  const outcomes = [
    "showed strong technical skills and problem-solving abilities",
    "demonstrated excellent communication and interpersonal skills", 
    "displayed good cultural fit and alignment with company values",
    "showed potential but would benefit from additional experience",
    "asked thoughtful questions about the role and company culture",
    "demonstrated leadership qualities and team collaboration skills",
    "showed analytical thinking and structured approach to problems",
    "displayed enthusiasm and genuine interest in the position"
  ];

  const challenges = [
    "some technical gaps that we discussed further",
    "areas where additional experience would be beneficial", 
    "questions about specific technical implementations",
    "discussion about career goals and growth opportunities",
    "exploration of how they handle challenging situations",
    "evaluation of their problem-solving methodology"
  ];

  const outcome = faker.helpers.arrayElement(outcomes);
  const challenge = faker.helpers.arrayElement(challenges);
  
  return `Interview ${interviewNumber} focused on ${interviewType.toLowerCase()}. The candidate ${outcome}. We also discussed ${challenge}.`;
}

// Generate dynamic key points
function generateKeyPoints() {
  const basePoints = [
    "Candidate demonstrated relevant experience",
    "Good communication and interpersonal skills", 
    "Showed interest in the role and company",
    "Asked appropriate questions about the position"
  ];

  const additionalPoints = [
    "Strong technical foundation in relevant areas",
    "Good problem-solving and analytical skills",
    "Positive attitude and cultural fit",
    "Clear career goals and motivation",
    "Experience with relevant tools and technologies",
    "Good examples of past achievements",
    "Shows potential for growth and development",
    "Demonstrated leadership qualities"
  ];

  // Select 3-5 random points
  const selectedPoints = faker.helpers.arrayElements(additionalPoints, { min: 1, max: 3 });
  return [...basePoints.slice(0, 2), ...selectedPoints];
}

// Generate realistic interviewer notes
function generateInterviewerNotes() {
  const impressions = [
    "Overall positive impression",
    "Strong candidate with good potential", 
    "Solid technical background",
    "Good cultural fit",
    "Shows enthusiasm and motivation",
    "Demonstrates strong problem-solving skills"
  ];

  const recommendations = [
    "Recommended for next round",
    "Would benefit from additional experience in specific areas",
    "Strong candidate for the role",
    "Good fit for the team and company culture",
    "Shows potential but needs more experience",
    "Excellent candidate with strong technical skills"
  ];

  const concerns = [
    "Some areas need further discussion",
    "Would like to see more examples of leadership",
    "Technical skills could be stronger in certain areas",
    "Good candidate but may need more experience",
    "Shows promise but has room for growth"
  ];

  const impression = faker.helpers.arrayElement(impressions);
  const recommendation = faker.helpers.arrayElement(recommendations);
  const concern = Math.random() > 0.7 ? faker.helpers.arrayElement(concerns) : null;

  let notes = `${impression}. ${recommendation}.`;
  if (concern) {
    notes += ` ${concern}.`;
  }

  return notes;
}

// Initialize active interviewers in database
async function initializeInterviewers() {
  console.log('$$$ Initializing interviewers...');
  
  const interviewerTypes = ['Senior', 'Junior', 'Specialist', 'General'];
  const specializations = ['Technical', 'Behavioral', 'Cultural', 'Leadership'];
  
  const interviewers = [];
  
  for (let i = 0; i < 25; i++) {
    const interviewerData = {
      name: faker.person.fullName(),
      type: interviewerTypes[Math.floor(Math.random() * interviewerTypes.length)],
      specialization: specializations[Math.floor(Math.random() * specializations.length)],
      experience: faker.number.int({ min: 1, max: 15 }),
      availability: Math.random() > 0.3, // 70% available
      current_load: faker.number.int({ min: 0, max: 5 }),
      max_load: 8,
      rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      languages: Math.random() > 0.8 ? ['English', 'Spanish'] : ['English'],
      cost_per_hour: faker.number.int({ min: 50, max: 150 })
    };

    try {
      const interviewer = await Interviewer.create(interviewerData);
      interviewers.push(interviewer);
    } catch (error) {
      console.error(`$$$ Error creating interviewer ${i + 1}:`, error.message);
    }
  }
  
  console.log(`$$$ Successfully initialized ${interviewers.length} interviewers`);
  return interviewers;
}

// Clear all data from database
async function clearAllData() {
  console.log('$$$ Clearing all data from database...');
  
  try {
    await query('DELETE FROM routing_history');
    await query('DELETE FROM interviews');
    await query('DELETE FROM interviewers');
    await query('DELETE FROM users');
    
    console.log('$$$ All data cleared successfully');
  } catch (error) {
    console.error('$$$ Error clearing data:', error.message);
    throw error;
  }
}

// Initialize all synthetic data
async function initializeSyntheticData(userCount = 100) {
  console.log('$$$ Initializing synthetic data...');
  
  try {
    // Clear existing data
    await clearAllData();
    
    // Generate users and their interview history
    const users = await generateSyntheticUsers(userCount);
    
    // Initialize interviewers
    const interviewers = await initializeInterviewers();
    
    console.log('$$$ Synthetic data initialization completed successfully');
    console.log(`$$$ Generated: ${users.length} users, ${interviewers.length} interviewers`);
    
    return { users, interviewers };
  } catch (error) {
    console.error('$$$ Error initializing synthetic data:', error.message);
    throw error;
  }
}

module.exports = {
  generateSyntheticUsers,
  initializeInterviewers,
  generateInterviewHistory,
  clearAllData,
  initializeSyntheticData
};
