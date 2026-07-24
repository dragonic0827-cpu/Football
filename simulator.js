const START_YEAR = 1863;
const END_YEAR = 2026;

const eras = [
  { from: 1863, name: '규칙의 탄생', text: '축구협회 규칙이 표준화되고 지역 컵과 친선전이 축구 문화를 만든다.' },
  { from: 1888, name: '프로 리그의 개막', text: '잉글랜드식 리그 모델이 확산되며 클럽 운영, 승강제, 더비 문화가 자리 잡는다.' },
  { from: 1930, name: '월드컵 시대', text: '국가대표 축구가 세계 무대의 중심에 서고 남미와 유럽의 경쟁이 격화된다.' },
  { from: 1955, name: '대륙 클럽대항전', text: '유러피언컵과 각 대륙 컵이 창설되어 클럽의 국제 위상이 폭발적으로 성장한다.' },
  { from: 1992, name: '글로벌 상업화', text: '프리미어리그, 챔피언스리그, 방송권, 스폰서가 초대형 축구 경제를 만든다.' },
  { from: 2010, name: '데이터와 슈퍼스타', text: '전술 데이터, 글로벌 스카우팅, 여자 축구 성장, SNS 팬덤이 세계관을 확장한다.' }
];

const competitions = [
  { type: 'leagues', year: 1888, name: 'English Football League', region: '유럽', clubs: ['Preston', 'Aston Villa', 'Everton', 'Sunderland'] },
  { type: 'leagues', year: 1898, name: 'Serie A Prototype', region: '유럽', clubs: ['Genoa', 'Torino', 'Milan', 'Juventus'] },
  { type: 'leagues', year: 1902, name: 'Primera División Prototype', region: '유럽', clubs: ['Barcelona', 'Madrid FC', 'Athletic Club', 'Real Sociedad'] },
  { type: 'leagues', year: 1931, name: 'Brazil National Circuit', region: '남미', clubs: ['Santos', 'Flamengo', 'Palmeiras', 'São Paulo'] },
  { type: 'leagues', year: 1932, name: 'Ligue 1', region: '유럽', clubs: ['Marseille', 'Saint-Étienne', 'Monaco', 'PSG'] },
  { type: 'leagues', year: 1963, name: 'Bundesliga', region: '유럽', clubs: ['Bayern', 'Dortmund', 'Hamburg', 'Mönchengladbach'] },
  { type: 'leagues', year: 1993, name: 'J.League', region: '아시아', clubs: ['Yokohama', 'Kashima', 'Urawa', 'Gamba Osaka'] },
  { type: 'leagues', year: 1996, name: 'MLS', region: '북중미', clubs: ['LA Galaxy', 'DC United', 'Seattle', 'Inter Miami'] },
  { type: 'clubs', year: 1871, name: 'FA Cup', region: '유럽' },
  { type: 'clubs', year: 1955, name: 'European Champions Cup', region: '유럽' },
  { type: 'clubs', year: 1960, name: 'Copa Libertadores', region: '남미' },
  { type: 'clubs', year: 1964, name: 'CAF Champions Cup', region: '아프리카' },
  { type: 'clubs', year: 1967, name: 'Asian Club Championship', region: '아시아' },
  { type: 'clubs', year: 2000, name: 'FIFA Club World Cup', region: '세계' },
  { type: 'nations', year: 1872, name: 'International Friendly Circuit', region: '세계', nations: ['England', 'Scotland', 'Wales', 'Ireland'] },
  { type: 'nations', year: 1916, name: 'Copa América', region: '남미', nations: ['Argentina', 'Brazil', 'Uruguay', 'Chile'] },
  { type: 'nations', year: 1930, name: 'FIFA World Cup', region: '세계', nations: ['Brazil', 'Germany', 'Argentina', 'Italy', 'France'] },
  { type: 'nations', year: 1956, name: 'AFC Asian Cup', region: '아시아', nations: ['Korea Republic', 'Japan', 'Iran', 'Saudi Arabia'] },
  { type: 'nations', year: 1957, name: 'Africa Cup of Nations', region: '아프리카', nations: ['Egypt', 'Ghana', 'Cameroon', 'Nigeria'] },
  { type: 'nations', year: 1960, name: 'UEFA Euro', region: '유럽', nations: ['Spain', 'Germany', 'France', 'Netherlands'] }
];

const stars = ['Arthur Kinnaird', 'Dixie Dean', 'Leônidas', 'Di Stéfano', 'Pelé', 'Cruyff', 'Maradona', 'Zidane', 'Ronaldo', 'Marta', 'Messi', 'Cristiano Ronaldo', 'Mbappé', 'Haaland'];
let state = { year: START_YEAR, results: { leagues: [], clubs: [], nations: [], awards: [] }, log: [] };
let activeTab = 'leagues';

const $ = (id) => document.getElementById(id);
const currentEra = () => eras.filter((era) => era.from <= state.year).at(-1);
const activeCompetitions = () => competitions.filter((competition) => competition.year <= state.year);
const pick = (items, salt = 0) => items[Math.abs((state.year * 9301 + salt * 49297) % items.length)];
const competitionWeight = () => ({ historic: 0, balanced: 8, wild: 18 })[$('pace').value];

function virtualCompetitions() {
  const count = Math.max(0, Math.floor((state.year - 1863 + competitionWeight()) / 22));
  return Array.from({ length: count }, (_, index) => ({
    type: index % 3 === 0 ? 'leagues' : index % 3 === 1 ? 'clubs' : 'nations',
    year: 1863 + index * 22,
    name: `가상 ${['리그', '챔피언스컵', '네이션스컵'][index % 3]} ${index + 1}`,
    region: ['유럽', '남미', '아시아', '아프리카', '북중미'][index % 5]
  }));
}

function simulateSeason() {
  const pool = [...activeCompetitions(), ...virtualCompetitions()].filter((item) => item.year <= state.year);
  state.results = { leagues: [], clubs: [], nations: [], awards: [] };
  for (const competition of pool) {
    const candidates = competition.clubs || competition.nations || ['Pioneers FC', 'Royal Engineers', 'Wanderers', 'Global XI'];
    const champion = pick(candidates, competition.name.length);
    state.results[competition.type].push({ ...competition, champion });
  }
  if (state.year >= 1956) {
    const winner = pick(stars.filter((_, index) => state.year >= 1863 + index * 12), state.year);
    state.results.awards.push({ name: 'Ballon d’Or', champion: winner, region: '개인상', year: state.year });
  }
  if (state.year >= 1991) {
    state.results.awards.push({ name: 'Women’s World Player', champion: pick(['Mia Hamm', 'Marta', 'Sawa', 'Alexia Putellas', 'Sam Kerr'], 7), region: '개인상', year: state.year });
  }
  const headline = `${state.year}년: ${currentEra().name} — ${pool.length}개 대회 운영, ${state.results.awards.length}개 개인상 발표`;
  state.log.unshift(headline);
  state.log = state.log.slice(0, 80);
}

function advance(seasons = 1) {
  const start = Number($('startYear').value);
  if (state.year === START_YEAR && start !== START_YEAR) state.year = Math.min(Math.max(start, START_YEAR), END_YEAR);
  for (let i = 0; i < seasons; i++) {
    simulateSeason();
    state.year = Math.min(state.year + 1, END_YEAR);
  }
  render();
}

function renderCompetitions() {
  const list = [...activeCompetitions(), ...virtualCompetitions()].filter((item) => item.year <= state.year);
  $('competitionList').innerHTML = list.map((item) => `<article class="card"><h3>${item.name}</h3><p><span class="badge">${item.region}</span><span class="badge">${item.year} 창설</span><span class="badge">${label(item.type)}</span></p></article>`).join('') || '<p>아직 표준 대회가 없습니다. 친선전과 지역 컵 중심의 시대입니다.</p>';
}

function label(type) { return { leagues: '리그', clubs: '클럽대항전', nations: '국가대항전', awards: '개인상' }[type]; }

function renderResults() {
  const rows = state.results[activeTab] || [];
  $('resultsBoard').innerHTML = rows.map((row) => `<article class="card"><h3>${row.name}</h3><p><b>우승/수상:</b> ${row.champion}</p><p><span class="badge">${row.region}</span><span class="badge">${row.year} 시즌</span></p></article>`).join('') || '<p>시즌을 진행하면 결과가 표시됩니다.</p>';
}

function renderMetrics() {
  const active = [...activeCompetitions(), ...virtualCompetitions()].filter((item) => item.year <= state.year);
  $('metricLeagues').textContent = active.filter((item) => item.type === 'leagues').length;
  $('metricClubs').textContent = new Set(active.flatMap((item) => item.clubs || [])).size + active.filter((item) => item.type === 'clubs').length * 4;
  $('metricNations').textContent = new Set(active.flatMap((item) => item.nations || [])).size;
  $('metricStars').textContent = stars.filter((_, index) => state.year >= 1863 + index * 12).length;
  drawChart(active);
}

function drawChart(active) {
  const canvas = $('prestigeChart');
  const ctx = canvas.getContext('2d');
  const regions = ['유럽', '남미', '아시아', '아프리카', '북중미'];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  regions.forEach((region, index) => {
    const value = active.filter((item) => item.region === region).length * 24 + (index + 1) * 8;
    const x = 50 + index * 165;
    const height = Math.min(210, value);
    ctx.fillStyle = index % 2 ? '#f6d76b' : '#47f08f';
    ctx.fillRect(x, 230 - height, 90, height);
    ctx.fillStyle = '#f1fff6';
    ctx.font = '22px sans-serif';
    ctx.fillText(region, x, 252);
  });
}

function render() {
  $('currentYear').textContent = state.year;
  const era = currentEra();
  $('eraDescription').innerHTML = `<article class="card"><h3>${era.name}</h3><p>${era.text}</p></article>`;
  renderCompetitions();
  renderResults();
  renderMetrics();
  $('historyLog').innerHTML = state.log.map((item) => `<li>${item}</li>`).join('') || '<li>아직 기록된 시즌이 없습니다.</li>';
}

document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach((item) => item.classList.remove('is-active'));
  tab.classList.add('is-active');
  activeTab = tab.dataset.tab;
  renderResults();
}));
$('advanceBtn').addEventListener('click', () => advance(Number($('seasonCount').value)));
$('autoBtn').addEventListener('click', () => advance(10));
$('resetBtn').addEventListener('click', () => { state = { year: START_YEAR, results: { leagues: [], clubs: [], nations: [], awards: [] }, log: [] }; render(); });
render();
