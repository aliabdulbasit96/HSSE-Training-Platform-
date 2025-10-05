/* ==== Config ==== */
const SCRIPT_URL = "YOUR_NEW_DEPLOYED_WEBAPP_URL";
const DASHBOARD_PASSWORD = "PowerChina2025";

/* ==== Tabs ==== */
const tabPortal = document.getElementById('tab-portal');
const tabDashboard = document.getElementById('tab-dashboard');
const sectionPortal = document.getElementById('section-portal');
const sectionDashboard = document.getElementById('section-dashboard');

function showPortal(){ 
  sectionPortal.classList.remove('hidden'); 
  sectionDashboard.classList.add('hidden');
  tabPortal.classList.add('active'); 
  tabDashboard.classList.remove('active');
}

function showDashboard(){ 
  sectionPortal.classList.add('hidden'); 
  sectionDashboard.classList.remove('hidden');
  tabDashboard.classList.add('active'); 
  tabPortal.classList.remove('active');
}

tabPortal.addEventListener('click', showPortal);
tabDashboard.addEventListener('click', () => {
  const pass = prompt('Enter Dashboard Password:');
  if(pass === DASHBOARD_PASSWORD){ 
    showDashboard(); 
    loadDashboardData(); 
  }
  else alert('Access Denied');
});

/* ==== Registration Submit ==== */
const form = document.getElementById('trainingForm');
const statusEl = document.getElementById('formStatus');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  statusEl.textContent = 'Submitting...';
  const fd = new FormData(form);
  const payload = new URLSearchParams(fd);
  payload.append('timestamp', new Date().toISOString());

  try{
    const res = await fetch(SCRIPT_URL, { method:'POST', body: payload });
    if(!res.ok) throw new Error('Network error');
    statusEl.textContent = 'Registration submitted.';
  }catch(err){
    statusEl.textContent = 'Error submitting registration.';
    console.error(err);
  }
  form.reset();
});

/* ==== Dashboard Loader ==== */
async function loadDashboardData() {
  try {
    const response = await fetch(SCRIPT_URL + "?mode=read");
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    console.log("Dashboard data loaded:", data);
    populateDashboard(data);
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
    alert("Error fetching data from Google Sheets!");
  }
}

/* ==== Charts Setup ==== */
let charts = {};

function destroyIfExists(id){ 
  if(charts[id]){ 
    charts[id].destroy(); 
    delete charts[id]; 
  } 
}

function drawPie(id, items){
  destroyIfExists(id);
  const ctx = document.getElementById(id).getContext('2d');
  charts[id] = new Chart(ctx, { 
    type:'pie', 
    data:{ 
      labels: items.map(i=>i.label), 
      datasets:[{ data: items.map(i=>i.value) }] 
    }, 
    options:{ responsive:true } 
  });
}

function drawBar(id, items){
  destroyIfExists(id);
  const ctx = document.getElementById(id).getContext('2d');
  charts[id] = new Chart(ctx, { 
    type:'bar', 
    data:{ 
      labels: items.map(i=>i.label), 
      datasets:[{ data: items.map(i=>i.value) }] 
    }, 
    options:{ responsive:true, scales:{ y:{ beginAtZero:true } } } 
  });
}

function drawLine(id, items){
  destroyIfExists(id);
  const ctx = document.getElementById(id).getContext('2d');
  charts[id] = new Chart(ctx, { 
    type:'line', 
    data:{ 
      labels: items.map(i=>i.label), 
      datasets:[{ data: items.map(i=>i.value), fill:false }] 
    }, 
    options:{ responsive:true, scales:{ y:{ beginAtZero:true } } } 
  });
}

/* ==== Populate Dashboard ==== */
function populateDashboard(data){
  const kpiTotal = document.getElementById('kpiTotal');
  const kpiToday = document.getElementById('kpiToday');
  const kpiCompanies = document.getElementById('kpiCompanies');
  const tbody = document.getElementById('tableBody');

  // KPIs
  kpiTotal.textContent = data?.totals?.total ?? 0;
  kpiToday.textContent = data?.totals?.today ?? 0;
  kpiCompanies.textContent = data?.totals?.companies ?? 0;

  // جدول المشاركين
  tbody.innerHTML = '';
  (data?.rows||[]).forEach((r,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i+1}</td><td>${r.name||''}</td><td>${r.company||''}</td><td>${r.jobTitle||''}</td><td>${r.language||''}</td><td>${r.topic||''}</td>`;
    tbody.appendChild(tr);
  });

  // الرسومات البيانية
  drawPie('chartLanguages', data.languages || []);
  drawBar('chartTopics', data.topics || []);
  drawLine('chartMonthly', data.monthly || []);
}
