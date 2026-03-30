let skillsData = [];

async function analyzeSkills() {
  const job = document.getElementById('jobInput').value.trim();
  const location = document.getElementById('locationInput').value.trim();

  
  document.getElementById('results').innerHTML = '';
  document.getElementById('error').style.display = 'none';
  document.getElementById('filters').style.display = 'none';


  if (!job) {
    showError('Please enter a job title to search.');
    return;
  }

  
  document.getElementById('loading').style.display = 'block';

  try {
    const query = location ? `${job} in ${location}` : job;
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=2`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        'X-RapidAPI-Key': CONFIG.API_KEY
      }
    });

    if (!response.ok) throw new Error('API request failed. Please try again.');

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      throw new Error('No job listings found. Try a different job title or location.');
    }

    skillsData = extractSkills(data.data);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('filters').style.display = 'flex';

    renderSummary(job, location, data.data.length);
    renderSkills();

  } catch (error) {
    document.getElementById('loading').style.display = 'none';
    showError(error.message || 'Something went wrong. Please try again.');
  }
}

function extractSkills(jobs) {
  const skillKeywords = [
    'python', 'javascript', 'java', 'sql', 'excel', 'react', 'node.js',
    'aws', 'azure', 'docker', 'kubernetes', 'git', 'html', 'css',
    'machine learning', 'data analysis', 'communication', 'leadership',
    'project management', 'agile', 'scrum', 'typescript', 'mongodb',
    'postgresql', 'tableau', 'power bi', 'r', 'tensorflow', 'figma',
    'photoshop', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin',
    'linux', 'rest api', 'graphql', 'problem solving', 'teamwork'
  ];

  const skillCount = {};

  jobs.forEach(job => {
    const text = `${job.job_description || ''} ${job.job_title || ''}`.toLowerCase();
    skillKeywords.forEach(skill => {
      if (text.includes(skill)) {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      }
    });
  });

  return Object.entries(skillCount)
    .map(([name, count]) => ({ name, count }))
    .filter(s => s.count > 0);
}

function renderSkills() {
  const sort = document.getElementById('sortSelect').value;
  const filter = document.getElementById('searchSkill').value.toLowerCase();

  let filtered = skillsData.filter(s => s.name.includes(filter));

  if (sort === 'frequency') {
    filtered.sort((a, b) => b.count - a.count);
  } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  const max = filtered[0]?.count || 1;

  const resultsDiv = document.getElementById('results');
  const summaryDiv = resultsDiv.querySelector('.summary');

  resultsDiv.innerHTML = '';
  if (summaryDiv) resultsDiv.appendChild(summaryDiv);

  if (filtered.length === 0) {
    resultsDiv.innerHTML += '<p style="text-align:center;color:#888;margin-top:20px;">No skills matched your filter.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'skills-grid';

  filtered.forEach(skill => {
    const pct = Math.round((skill.count / max) * 100);
    grid.innerHTML += `
      <div class="skill-card">
        <div class="skill-name">${skill.name.toUpperCase()}</div>
        <div class="skill-bar-bg">
          <div class="skill-bar" style="width:${pct}%"></div>
        </div>
        <div class="skill-count">Found in ${skill.count} job listing(s)</div>
      </div>
    `;
  });

  resultsDiv.appendChild(grid);
}

function renderSummary(job, location, totalJobs) {
  const resultsDiv = document.getElementById('results');
  const summary = document.createElement('div');
  summary.className = 'summary';
  summary.innerHTML = `
    <h2>Results for "${job}" ${location ? 'in ' + location : ''}</h2>
    <p>Analyzed <strong>${totalJobs}</strong> job listings and found <strong>${skillsData.length}</strong> in-demand skills.</p>
  `;
  resultsDiv.appendChild(summary);
}

function showError(msg) {
  const err = document.getElementById('error');
  err.textContent = '⚠️ ' + msg;
  err.style.display = 'block';
}
