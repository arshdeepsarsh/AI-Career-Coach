// AI Career Coach Application JavaScript

// Application data from the provided JSON
const appData = {
  "sampleResumeData": {
    "name": "John Smith",
    "email": "john.smith@email.com",
    "phone": "+1 (555) 123-4567",
    "skills": ["Python", "React", "Node.js", "Machine Learning", "Data Analysis", "JavaScript", "MongoDB", "AWS"],
    "experience": [
      {
        "title": "Senior Software Developer",
        "company": "Tech Solutions Inc",
        "duration": "2021-2024",
        "description": "Led development of ML-powered applications using Python and React"
      },
      {
        "title": "Full Stack Developer",
        "company": "StartupCorp",
        "duration": "2019-2021",
        "description": "Built web applications using MERN stack and implemented CI/CD pipelines"
      }
    ],
    "education": [
      {
        "degree": "Master of Science in Computer Science",
        "school": "University of Technology",
        "year": "2019"
      }
    ],
    "resumeScore": 85
  },
  "careerRecommendations": [
    {
      "role": "AI/ML Engineer",
      "match": 92,
      "description": "Perfect fit based on your Python and ML skills",
      "skills": ["Python", "Machine Learning", "TensorFlow", "PyTorch"],
      "salaryRange": "$120k - $180k"
    },
    {
      "role": "Full Stack Developer",
      "match": 88,
      "description": "Great match for your React and Node.js experience",
      "skills": ["React", "Node.js", "JavaScript", "MongoDB"],
      "salaryRange": "$100k - $150k"
    },
    {
      "role": "Data Scientist",
      "match": 85,
      "description": "Your analytical skills and Python expertise fit well",
      "skills": ["Python", "Data Analysis", "Statistics", "SQL"],
      "salaryRange": "$110k - $170k"
    }
  ],
  "jobListings": [
    {
      "title": "Senior AI Engineer",
      "company": "TechCorp",
      "location": "Remote",
      "salary": "$140k - $170k",
      "match": 94,
      "requirements": ["Python", "Machine Learning", "5+ years experience"],
      "type": "Full-time"
    },
    {
      "title": "Full Stack Developer",
      "company": "Innovation Labs",
      "location": "San Francisco, CA",
      "salary": "$120k - $150k",
      "match": 89,
      "requirements": ["React", "Node.js", "JavaScript", "3+ years experience"],
      "type": "Full-time"
    },
    {
      "title": "Data Scientist",
      "company": "DataTech",
      "location": "New York, NY",
      "salary": "$130k - $160k",
      "match": 87,
      "requirements": ["Python", "Data Analysis", "ML", "PhD preferred"],
      "type": "Full-time"
    }
  ],
  "skillGaps": [
    {
      "skill": "TensorFlow",
      "importance": "High",
      "recommendation": "Complete TensorFlow Developer Certificate",
      "courses": ["TensorFlow in Practice Specialization", "Deep Learning with TensorFlow"]
    },
    {
      "skill": "Docker",
      "importance": "Medium", 
      "recommendation": "Learn containerization for better deployment",
      "courses": ["Docker Mastery", "Kubernetes Fundamentals"]
    }
  ],
  "coachingTips": [
    {
      "title": "Optimize Your Resume for ATS",
      "content": "Use standard section headers and include relevant keywords from job descriptions",
      "category": "Resume"
    },
    {
      "title": "Prepare for Technical Interviews",
      "content": "Practice coding problems and explain your thought process clearly",
      "category": "Interview"
    },
    {
      "title": "Build a Strong Portfolio",
      "content": "Showcase 3-5 projects that demonstrate your key skills",
      "category": "Portfolio"
    },
    {
      "title": "Network Effectively",
      "content": "Attend industry events and engage with professionals on LinkedIn",
      "category": "Networking"
    }
  ]
};

// Application state
let currentSection = 'home';
let resumeUploaded = false;

// DOM Elements
const navbarToggle = document.getElementById('navbar-toggle');
const navbarMenu = document.getElementById('navbar-menu');
const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const uploadProgress = document.getElementById('upload-progress');
const loadingOverlay = document.getElementById('loading-overlay');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFileUpload();
    initializeFilters();
    initializeTipCategories();
    
    // Show home section by default
    showSection('home');
    
    // Populate sections with data
    populateAnalysisSection();
    populateRecommendationsSection();
    populateJobsSection();
    populateCoachingTips();
    updateProgressTracking();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
    }
    
    // Brand click - go to home
    const navbarBrand = document.querySelector('.navbar-brand h2');
    if (navbarBrand) {
        navbarBrand.addEventListener('click', function() {
            navigateToSection('home');
            navbarMenu.classList.remove('active');
        });
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.navbar-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            navigateToSection(sectionId);
            
            // Close mobile menu
            navbarMenu.classList.remove('active');
        });
    });
    
    // Update active nav link
    updateActiveNavLink('home');
}

function navigateToSection(sectionId) {
    // Check if user needs to upload resume first for restricted sections
    if (!resumeUploaded && (sectionId === 'analysis' || sectionId === 'recommendations' || sectionId === 'jobs')) {
        alert('Please upload your resume first to access this section.');
        navigateToSection('upload');
        return;
    }
    
    showSection(sectionId);
    updateActiveNavLink(sectionId);
    currentSection = sectionId;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.navbar-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// File upload functionality
function initializeFileUpload() {
    if (!uploadZone || !fileInput) return;
    
    // Click to upload
    uploadZone.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });
    
    // Drag and drop functionality
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (isValidFileType(file)) {
                handleFileUpload(file);
            } else {
                alert('Please upload a PDF, DOC, or DOCX file.');
            }
        }
    });
}

function isValidFileType(file) {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type) || file.name.toLowerCase().match(/\.(pdf|doc|docx)$/);
}

function handleFileUpload(file) {
    if (!isValidFileType(file)) {
        alert('Please upload a PDF, DOC, or DOCX file.');
        return;
    }
    
    // Show upload progress
    if (uploadProgress) {
        uploadProgress.style.display = 'block';
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            if (progressFill) progressFill.style.width = progress + '%';
            
            if (progress === 100) {
                clearInterval(interval);
                if (progressText) progressText.textContent = 'Upload complete! Analyzing resume...';
                
                setTimeout(() => {
                    simulateResumeAnalysis();
                }, 1000);
            }
        }, 200);
    }
}

function simulateResumeAnalysis() {
    // Show loading overlay
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    // Simulate AI analysis delay
    setTimeout(() => {
        resumeUploaded = true;
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
        
        // Navigate to analysis section
        navigateToSection('analysis');
        
        // Update progress tracking
        updateProgressTracking();
        
        // Show success message
        alert('Resume analysis complete! Check out your personalized recommendations.');
    }, 3000);
}

// Populate analysis section
function populateAnalysisSection() {
    const data = appData.sampleResumeData;
    
    // Update contact information
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userPhone = document.getElementById('user-phone');
    const resumeScore = document.getElementById('resume-score');
    
    if (userName) userName.textContent = data.name;
    if (userEmail) userEmail.textContent = data.email;
    if (userPhone) userPhone.textContent = data.phone;
    if (resumeScore) resumeScore.textContent = data.resumeScore;
    
    // Populate skills
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        skillsContainer.innerHTML = '';
        data.skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skillsContainer.appendChild(skillTag);
        });
    }
    
    // Populate experience timeline
    const experienceTimeline = document.getElementById('experience-timeline');
    if (experienceTimeline) {
        experienceTimeline.innerHTML = '';
        data.experience.forEach(exp => {
            const expItem = document.createElement('div');
            expItem.className = 'experience-item';
            expItem.innerHTML = `
                <div class="experience-title">${exp.title}</div>
                <div class="experience-company">${exp.company}</div>
                <div class="experience-duration">${exp.duration}</div>
                <div class="experience-description">${exp.description}</div>
            `;
            experienceTimeline.appendChild(expItem);
        });
    }
    
    // Populate education
    const educationDetails = document.getElementById('education-details');
    if (educationDetails) {
        educationDetails.innerHTML = '';
        data.education.forEach(edu => {
            const eduItem = document.createElement('div');
            eduItem.className = 'education-item';
            eduItem.innerHTML = `
                <div class="education-degree">${edu.degree}</div>
                <div class="education-school">${edu.school}</div>
                <div class="education-year">${edu.year}</div>
            `;
            educationDetails.appendChild(eduItem);
        });
    }
}

// Populate recommendations section
function populateRecommendationsSection() {
    const recommendationsGrid = document.getElementById('recommendations-grid');
    const skillGapsList = document.getElementById('skill-gaps-list');
    
    // Clear existing content
    if (recommendationsGrid) {
        recommendationsGrid.innerHTML = '';
        
        // Populate career recommendations
        appData.careerRecommendations.forEach(rec => {
            const recCard = document.createElement('div');
            recCard.className = 'recommendation-card';
            recCard.innerHTML = `
                <div class="recommendation-header">
                    <h3 class="recommendation-role">${rec.role}</h3>
                    <span class="match-percentage">${rec.match}% Match</span>
                </div>
                <p class="recommendation-description">${rec.description}</p>
                <div class="recommendation-skills">
                    <h4>Required Skills:</h4>
                    <div class="skills-container">
                        ${rec.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="recommendation-salary">${rec.salaryRange}</div>
            `;
            recommendationsGrid.appendChild(recCard);
        });
    }
    
    // Populate skill gaps
    if (skillGapsList) {
        skillGapsList.innerHTML = '';
        appData.skillGaps.forEach(gap => {
            const gapItem = document.createElement('div');
            gapItem.className = 'skill-gap-item';
            gapItem.innerHTML = `
                <div class="skill-gap-header">
                    <span class="skill-gap-name">${gap.skill}</span>
                    <span class="importance-badge importance-${gap.importance.toLowerCase()}">${gap.importance}</span>
                </div>
                <p class="skill-gap-recommendation">${gap.recommendation}</p>
                <div class="skill-gap-courses">
                    ${gap.courses.map(course => `<span class="course-tag">${course}</span>`).join('')}
                </div>
            `;
            skillGapsList.appendChild(gapItem);
        });
    }
}

// Populate jobs section
function populateJobsSection() {
    const jobsGrid = document.getElementById('jobs-grid');
    if (jobsGrid) {
        jobsGrid.innerHTML = '';
        
        appData.jobListings.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.innerHTML = `
                <div class="job-header">
                    <div>
                        <h3 class="job-title">${job.title}</h3>
                        <p class="job-company">${job.company}</p>
                    </div>
                    <span class="job-match">${job.match}% Match</span>
                </div>
                <div class="job-details">
                    <div class="job-detail-item">
                        <span>Location:</span>
                        <span>${job.location}</span>
                    </div>
                    <div class="job-detail-item">
                        <span>Salary:</span>
                        <span>${job.salary}</span>
                    </div>
                    <div class="job-detail-item">
                        <span>Type:</span>
                        <span>${job.type}</span>
                    </div>
                </div>
                <div class="job-requirements">
                    <h4>Requirements:</h4>
                    <div class="skills-container">
                        ${job.requirements.map(req => `<span class="skill-tag">${req}</span>`).join('')}
                    </div>
                </div>
                <div class="job-actions">
                    <button class="btn btn--primary" onclick="applyToJob('${job.title}')">Apply</button>
                    <button class="btn btn--outline" onclick="saveJob('${job.title}')">Save</button>
                </div>
            `;
            jobsGrid.appendChild(jobCard);
        });
    }
}

// Populate coaching tips
function populateCoachingTips(filterCategory = 'all') {
    const tipsGrid = document.getElementById('tips-grid');
    if (tipsGrid) {
        tipsGrid.innerHTML = '';
        
        const filteredTips = filterCategory === 'all' 
            ? appData.coachingTips 
            : appData.coachingTips.filter(tip => tip.category === filterCategory);
        
        filteredTips.forEach(tip => {
            const tipCard = document.createElement('div');
            tipCard.className = 'tip-card';
            tipCard.innerHTML = `
                <span class="tip-category">${tip.category}</span>
                <h3 class="tip-title">${tip.title}</h3>
                <p class="tip-content">${tip.content}</p>
            `;
            tipsGrid.appendChild(tipCard);
        });
    }
}

// Initialize filters
function initializeFilters() {
    const jobFilter = document.getElementById('job-filter');
    if (jobFilter) {
        jobFilter.addEventListener('change', function() {
            filterJobs(this.value);
        });
    }
}

function filterJobs(filterType) {
    const jobCards = document.querySelectorAll('.job-card');
    
    jobCards.forEach(card => {
        const matchElement = card.querySelector('.job-match');
        const locationElement = card.querySelector('.job-detail-item:nth-child(1) span:last-child');
        
        if (matchElement && locationElement) {
            const jobMatch = parseInt(matchElement.textContent);
            const jobLocation = locationElement.textContent;
            
            let shouldShow = true;
            
            if (filterType === 'remote' && !jobLocation.includes('Remote')) {
                shouldShow = false;
            } else if (filterType === 'high-match' && jobMatch < 90) {
                shouldShow = false;
            }
            
            card.style.display = shouldShow ? 'block' : 'none';
        }
    });
}

// Initialize tip categories
function initializeTipCategories() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter tips
            const category = this.getAttribute('data-category');
            populateCoachingTips(category);
        });
    });
}

// Job actions
function applyToJob(jobTitle) {
    alert(`Application submitted for ${jobTitle}! We'll redirect you to the company's application page.`);
}

function saveJob(jobTitle) {
    alert(`${jobTitle} has been saved to your profile!`);
}

// Progress tracking
function updateProgressTracking() {
    const statsElements = document.querySelectorAll('.stat-value');
    if (statsElements.length >= 3 && resumeUploaded) {
        statsElements[0].textContent = appData.sampleResumeData.resumeScore + '%';
        statsElements[1].textContent = appData.careerRecommendations.length.toString();
        statsElements[2].textContent = appData.jobListings.length.toString();
    }
}

// Handle window resize for responsive navigation
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navbarMenu) {
        navbarMenu.classList.remove('active');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (navbarToggle && navbarMenu && !navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
        navbarMenu.classList.remove('active');
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (navbarMenu) navbarMenu.classList.remove('active');
        if (loadingOverlay) loadingOverlay.classList.remove('active');
    }
});

// Touch events for better mobile experience
document.addEventListener('touchstart', function() {}, { passive: true });

// Make functions available globally
window.navigateToSection = navigateToSection;
window.applyToJob = applyToJob;
window.saveJob = saveJob;