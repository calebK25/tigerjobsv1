
interface ParsedResume {
  skills: string[];
  experience: string[];
  education: string[];
  summary: string;
}

/**
 * A resume text parser that extracts skills, experience, and education
 */
export const parseResumeText = (text: string): ParsedResume => {
  if (!text || typeof text !== 'string') {
    console.error('Invalid resume text:', text);
    return {
      skills: [],
      experience: [],
      education: [],
      summary: 'Invalid resume text provided.'
    };
  }

  console.log('Parsing resume text, length:', text.length);
  
  const skills = extractSkills(text);
  const experience = extractExperience(text);
  const education = extractEducation(text);
  
  return {
    skills,
    experience,
    education,
    summary: generateSummary(text, skills),
  };
};

const extractSkills = (text: string): string[] => {
  // Comprehensive list of technical and soft skills
  const commonSkills = [
    // Programming languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'php', 'swift', 'kotlin',
    
    // Frontend
    'react', 'angular', 'vue', 'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material-ui', 
    'redux', 'webpack', 'vite', 'next.js', 'svelte',
    
    // Backend
    'node.js', 'express', 'django', 'flask', 'spring', 'asp.net', 'laravel', 'ruby on rails',
    
    // Database
    'sql', 'mysql', 'postgresql', 'mongodb', 'firebase', 'supabase', 'dynamodb', 'redis', 'oracle',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible',
    
    // Mobile
    'android', 'ios', 'react native', 'flutter', 'xamarin', 'ionic',
    
    // AI/ML
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'nlp', 'computer vision',
    
    // Software practices
    'git', 'github', 'agile', 'scrum', 'jira', 'kanban', 'tdd', 'bdd', 'rest api', 'graphql',
    
    // Soft skills
    'leadership', 'communication', 'teamwork', 'problem solving', 'critical thinking', 'time management', 
    'project management', 'adaptability', 'creativity', 'collaboration', 'presentation'
  ];
  
  // Find skills in resume
  const foundSkills = commonSkills.filter(skill => 
    new RegExp(`\\b${skill}\\b`, 'i').test(text.toLowerCase())
  );
  
  // Also look for capitalized versions (e.g., JavaScript, TypeScript)
  const capitalizedSkills = ['JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js'];
  capitalizedSkills.forEach(skill => {
    if (text.includes(skill) && !foundSkills.includes(skill.toLowerCase())) {
      foundSkills.push(skill.toLowerCase());
    }
  });
  
  // Look for additional domain-specific skills based on context
  const textLower = text.toLowerCase();
  
  // Software Development domains
  if (textLower.includes('software') || textLower.includes('developer') || textLower.includes('engineer')) {
    ['algorithms', 'data structures', 'object-oriented', 'functional programming', 'microservices', 'system design']
      .forEach(skill => {
        if (textLower.includes(skill) && !foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      });
  }
  
  // Finance/Business domains
  if (textLower.includes('finance') || textLower.includes('business') || textLower.includes('analyst')) {
    ['excel', 'financial analysis', 'tableau', 'power bi', 'forecasting', 'budgeting', 'accounting']
      .forEach(skill => {
        if (textLower.includes(skill) && !foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      });
  }
  
  // Marketing domains
  if (textLower.includes('marketing') || textLower.includes('seo') || textLower.includes('content')) {
    ['seo', 'sem', 'social media', 'content strategy', 'analytics', 'copywriting', 'brand management']
      .forEach(skill => {
        if (textLower.includes(skill) && !foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      });
  }
  
  console.log('Found skills:', foundSkills);
  return [...new Set(foundSkills)]; // Remove duplicates
};

const extractExperience = (text: string): string[] => {
  const lines = text.split('\n');
  
  // Look for job titles, companies, or experience sections
  const jobTitleKeywords = [
    'Engineer', 'Developer', 'Manager', 'Director', 'Specialist', 'Analyst', 
    'Designer', 'Architect', 'Consultant', 'Intern', 'Lead'
  ];
  
  // Look for experience section headers
  const experienceSections = lines.filter(line => 
    /experience|work|employment|history/i.test(line) && 
    line.length < 30 && 
    /^[A-Z\s]+$/.test(line.trim())
  );
  
  // Find job title lines
  const jobLines = lines.filter(line => {
    const containsJobKeyword = jobTitleKeywords.some(keyword => 
      new RegExp(`\\b${keyword}\\b`, 'i').test(line)
    );
    
    const looksLikeJobTitle = (
      containsJobKeyword && 
      line.length < 100 &&
      !line.includes('•') && 
      !line.includes('*') && 
      !line.trim().startsWith('-')
    );
    
    return looksLikeJobTitle;
  });
  
  // Look for company names (often come after or before job titles)
  const companyLines = lines.filter(line => {
    const companyIndicators = ['Inc', 'LLC', 'Ltd', 'Corporation', 'Company', 'GmbH'];
    const hasCompanyIndicator = companyIndicators.some(indicator => 
      new RegExp(`\\b${indicator}\\b`).test(line)
    );
    
    const looksLikeCompany = (
      (hasCompanyIndicator || /^[A-Za-z\s,\.]+$/.test(line.trim())) &&
      line.length < 50 &&
      !line.includes('•') && 
      !line.includes('*') && 
      !line.trim().startsWith('-')
    );
    
    return looksLikeCompany;
  });
  
  // Extract job responsibilities (often follow job titles and are bullet points)
  const bulletPoints = lines.filter(line => 
    (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) &&
    line.length > 10 &&
    line.length < 200
  );
  
  // Create a comprehensive experience collection
  const experienceItems = [
    ...experienceSections,
    ...jobLines,
    ...companyLines,
    ...bulletPoints.slice(0, 10) // Limit to first 10 bullet points to avoid overwhelming
  ];
  
  return experienceItems;
};

const extractEducation = (text: string): string[] => {
  const lines = text.split('\n');
  
  // Look for education keywords
  const educationKeywords = [
    'Bachelor', 'Master', 'PhD', 'BS', 'MS', 'BA', 'MA', 'B.S.', 'M.S.',
    'University', 'College', 'School', 'Institute', 'Degree', 'Education',
    'Major', 'Minor', 'Graduated', 'GPA'
  ];
  
  // Find education section lines
  const educationLines = lines.filter(line => {
    const containsEducationKeyword = educationKeywords.some(keyword => 
      new RegExp(`\\b${keyword}\\b`, 'i').test(line)
    );
    
    return containsEducationKeyword && line.length < 150;
  });
  
  return educationLines;
};

const generateSummary = (text: string, skills: string[]): string => {
  const wordCount = text.split(/\s+/).length;
  const topSkills = skills.slice(0, 5).join(', ');
  
  // Look for common major/field indicators
  const fields = [
    'Computer Science', 'Engineering', 'Business', 'Marketing', 'Finance', 
    'Data Science', 'Design', 'Healthcare', 'Education', 'Psychology'
  ];
  
  const textLower = text.toLowerCase();
  const detectedFields = fields.filter(field => 
    textLower.includes(field.toLowerCase())
  );
  
  let fieldInfo = '';
  if (detectedFields.length > 0) {
    fieldInfo = ` in ${detectedFields[0]}`;
  }
  
  return `Resume contains approximately ${wordCount} words${fieldInfo} and highlights expertise in ${topSkills || 'various technologies'}.`;
};

/**
 * Calculate job relevance score based on resume content
 */
export const getRelevanceScore = (jobDescription: string, resumeText: string): number => {
  if (!resumeText || !jobDescription) {
    console.warn('Missing inputs for relevance scoring:', { 
      hasResumeText: !!resumeText, 
      hasJobDescription: !!jobDescription 
    });
    return 50; // Default middle score
  }

  try {
    const parsedResume = parseResumeText(resumeText);
    
    // Count matching skills
    const jobDescriptionLower = jobDescription.toLowerCase();
    const matchingSkills = parsedResume.skills.filter(skill => 
      jobDescriptionLower.includes(skill.toLowerCase())
    );
    
    const skillCount = matchingSkills.length;
    const totalSkills = parsedResume.skills.length;
    
    // Calculate skill match ratio with protection against division by zero
    const skillMatchRatio = totalSkills > 0 ? skillCount / totalSkills : 0;
    
    // Calculate keyword match score from experience and education
    let keywordMatchCount = 0;
    
    // Get important keywords from job description
    const jobWords = jobDescription.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => word.length > 3) // Only words longer than 3 characters
      .filter(word => !['and', 'the', 'this', 'that', 'with', 'from', 'have'].includes(word)); // Remove common words
    
    // Count matches to experience and education
    [...parsedResume.experience, ...parsedResume.education].forEach(item => {
      const itemWords = item.toLowerCase().split(/\s+/);
      jobWords.forEach(jobWord => {
        if (itemWords.some(word => word.includes(jobWord) || jobWord.includes(word))) {
          keywordMatchCount++;
        }
      });
    });
    
    const keywordMatchScore = Math.min(30, keywordMatchCount * 2); // Cap at 30
    
    // Calculate base score from skills (scale: 0-60)
    const skillScore = Math.min(60, skillMatchRatio * 70);
    
    // Combine scores
    let totalScore = skillScore + keywordMatchScore;
    
    // Add bonus for high skill matches
    if (skillCount > 3) {
      totalScore += 10;
    }
    
    console.log('Relevance calculation:', {
      jobTitle: jobDescription.substring(0, 30) + '...',
      skillCount,
      totalSkills,
      skillMatchRatio,
      skillScore,
      keywordMatchCount,
      keywordMatchScore,
      totalScore
    });
    
    // Ensure score stays within 0-100 range and round to nearest integer
    return Math.round(Math.min(100, Math.max(0, totalScore)));
  } catch (error) {
    console.error('Error calculating relevance score:', error);
    return 50; // Default middle score on error
  }
};
