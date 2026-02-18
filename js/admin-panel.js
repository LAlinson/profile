// Admin Panel Logic - Multi-User Version
let resumeData = {};
let currentUserId = null;

// Load user from URL param or first user
async function loadData() {
    await userManager.loadUsers();

    const params = new URLSearchParams(window.location.search);
    currentUserId = params.get('user');

    const users = userManager.getAll();

    if (users.length === 0) {
        showStatus('Nenhum usuário encontrado. <a href="users.html">Criar usuário</a>', 'error');
        return;
    }

    // Populate user selector
    const selector = document.getElementById('userSelector');
    if (selector) {
        selector.innerHTML = users.map(u =>
            `<option value="${u.id}" ${u.id === currentUserId ? 'selected' : ''}>${u.name}</option>`
        ).join('');

        if (!currentUserId) {
            currentUserId = users[0].id;
            selector.value = currentUserId;
        }
    }

    loadUserData(currentUserId);
}

function loadUserData(userId) {
    const user = userManager.getById(userId);
    if (!user) return;

    currentUserId = userId;
    resumeData = JSON.parse(JSON.stringify(user.resumeData)); // deep copy
    populateForm();
    showStatus(`✅ Dados de "${user.name}" carregados.`, 'success');
}

function onUserChange() {
    const selector = document.getElementById('userSelector');
    if (selector) {
        loadUserData(selector.value);
        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('user', selector.value);
        window.history.replaceState({}, '', url);
    }
}

// Populate form with loaded data
function populateForm() {
    document.getElementById('personal-name').value = resumeData.personal?.name || '';
    document.getElementById('personal-email').value = resumeData.personal?.email || '';
    document.getElementById('personal-phone').value = resumeData.personal?.phone || '';
    document.getElementById('personal-location').value = resumeData.personal?.location || '';
    document.getElementById('personal-linkedin').value = resumeData.personal?.linkedin || '';
    document.getElementById('personal-photo').value = resumeData.personal?.photo || '';

    document.getElementById('summary-text').value = resumeData.summary?.text || '';
    document.getElementById('summary-highlights').value = (resumeData.summary?.highlights || []).join('\n');

    document.getElementById('career-highlights').value = (resumeData.careerHighlights || []).join('\n');
    document.getElementById('skills-list').value = (resumeData.skills || []).join('\n');
    document.getElementById('certifications-list').value = (resumeData.certifications || []).join('\n');

    renderExperienceList();
    renderEducationList();
    renderLanguagesList();
}

// Collect form data into resumeData
function collectFormData() {
    resumeData.personal = {
        name: document.getElementById('personal-name').value,
        email: document.getElementById('personal-email').value,
        phone: document.getElementById('personal-phone').value,
        location: document.getElementById('personal-location').value,
        linkedin: document.getElementById('personal-linkedin').value,
        photo: document.getElementById('personal-photo').value
    };

    resumeData.summary = {
        text: document.getElementById('summary-text').value,
        highlights: document.getElementById('summary-highlights').value.split('\n').filter(h => h.trim())
    };

    resumeData.careerHighlights = document.getElementById('career-highlights').value.split('\n').filter(h => h.trim());
    resumeData.skills = document.getElementById('skills-list').value.split('\n').filter(s => s.trim());
    resumeData.certifications = document.getElementById('certifications-list').value.split('\n').filter(c => c.trim());
}

// Save data
function saveData() {
    collectFormData();
    userManager.updateResumeData(currentUserId, resumeData);
    showStatus('✅ Dados salvos com sucesso!', 'success');
}

// Generate resume HTML and download
function generateResume() {
    collectFormData();
    try {
        const builder = new ResumeBuilder(resumeData);
        const html = builder.generateHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const user = userManager.getById(currentUserId);
        const safeName = (user?.name || 'curriculo').replace(/\s+/g, '-').toLowerCase();
        a.download = `curriculo-${safeName}.html`;
        a.click();
        URL.revokeObjectURL(url);
        showStatus('✅ Currículo gerado e baixado!', 'success');
    } catch (error) {
        showStatus('❌ Erro ao gerar currículo: ' + error.message, 'error');
    }
}

// Generate PDF via print dialog
function generatePDF() {
    collectFormData();
    try {
        const builder = new ResumeBuilder(resumeData);
        const html = builder.generateHTML();

        // Open in new window and trigger print
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        printWindow.document.write(html);
        printWindow.document.close();

        // Wait for content to load then print
        printWindow.onload = function () {
            printWindow.focus();
            printWindow.print();
            // Close after print dialog closes
            printWindow.onafterprint = function () {
                printWindow.close();
            };
        };

        showStatus('✅ Janela de impressão aberta! Selecione "Salvar como PDF" na impressora.', 'success');
    } catch (error) {
        showStatus('❌ Erro ao gerar PDF: ' + error.message, 'error');
    }
}


// Export JSON
function exportJSON() {
    const json = userManager.exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showStatus('✅ JSON exportado!', 'success');
}

function importJSON() {
    document.getElementById('jsonFileInput').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const ok = userManager.importJSON(e.target.result);
        if (ok) {
            loadData();
            showStatus('✅ JSON importado com sucesso!', 'success');
        } else {
            showStatus('❌ Arquivo JSON inválido.', 'error');
        }
    };
    reader.readAsText(file);
}

// Experience
function renderExperienceList() {
    const container = document.getElementById('experience-list');
    container.innerHTML = '';
    (resumeData.experience || []).forEach((exp, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <div class="list-item-title">${exp.company} - ${exp.position}</div>
                <div class="list-item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editExperience(${index})">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteExperience(${index})">🗑️</button>
                </div>
            </div>
            <div style="font-size:13px;color:#666;">${exp.period}</div>`;
        container.appendChild(item);
    });
}

function addExperience() {
    const company = prompt('Nome da empresa:');
    if (!company) return;
    const position = prompt('Cargo:') || '';
    const period = prompt('Período (ex: Jan 2020 - Dez 2021):') || '';
    const achievementsStr = prompt('Conquistas (separe por ponto-e-vírgula):') || '';
    const achievements = achievementsStr.split(';').map(a => a.trim()).filter(a => a);
    if (!resumeData.experience) resumeData.experience = [];
    resumeData.experience.push({ company, position, period, achievements });
    renderExperienceList();
}

function editExperience(index) {
    const exp = resumeData.experience[index];
    exp.company = prompt('Empresa:', exp.company) || exp.company;
    exp.position = prompt('Cargo:', exp.position) || exp.position;
    exp.period = prompt('Período:', exp.period) || exp.period;
    const str = prompt('Conquistas (ponto-e-vírgula):', exp.achievements.join('; ')) || '';
    exp.achievements = str.split(';').map(a => a.trim()).filter(a => a);
    renderExperienceList();
}

function deleteExperience(index) {
    if (confirm('Excluir esta experiência?')) {
        resumeData.experience.splice(index, 1);
        renderExperienceList();
    }
}

// Education
function renderEducationList() {
    const container = document.getElementById('education-list');
    container.innerHTML = '';
    (resumeData.education || []).forEach((edu, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <div class="list-item-title">${edu.degree}</div>
                <div class="list-item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editEducation(${index})">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEducation(${index})">🗑️</button>
                </div>
            </div>
            <div style="font-size:13px;color:#666;">${edu.institution}</div>`;
        container.appendChild(item);
    });
}

function addEducation() {
    const degree = prompt('Curso/Grau:');
    if (!degree) return;
    const institution = prompt('Instituição:') || '';
    if (!resumeData.education) resumeData.education = [];
    resumeData.education.push({ degree, institution });
    renderEducationList();
}

function editEducation(index) {
    const edu = resumeData.education[index];
    edu.degree = prompt('Curso/Grau:', edu.degree) || edu.degree;
    edu.institution = prompt('Instituição:', edu.institution) || edu.institution;
    renderEducationList();
}

function deleteEducation(index) {
    if (confirm('Excluir esta formação?')) {
        resumeData.education.splice(index, 1);
        renderEducationList();
    }
}

// Languages
function renderLanguagesList() {
    const container = document.getElementById('languages-list');
    container.innerHTML = '';
    (resumeData.languages || []).forEach((lang, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <div class="list-item-title">${lang.name} - ${lang.level}</div>
                <div class="list-item-actions">
                    <button class="btn btn-sm btn-primary" onclick="editLanguage(${index})">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteLanguage(${index})">🗑️</button>
                </div>
            </div>
            <div style="font-size:13px;color:#666;">Proficiência: ${lang.proficiency}%</div>`;
        container.appendChild(item);
    });
}

function addLanguage() {
    const name = prompt('Idioma:');
    if (!name) return;
    const level = prompt('Nível (ex: C2 Proficiente):') || '';
    const proficiency = parseInt(prompt('Proficiência (0-100):') || '50');
    if (!resumeData.languages) resumeData.languages = [];
    resumeData.languages.push({ name, level, proficiency });
    renderLanguagesList();
}

function editLanguage(index) {
    const lang = resumeData.languages[index];
    lang.name = prompt('Idioma:', lang.name) || lang.name;
    lang.level = prompt('Nível:', lang.level) || lang.level;
    lang.proficiency = parseInt(prompt('Proficiência (0-100):', lang.proficiency) || lang.proficiency);
    renderLanguagesList();
}

function deleteLanguage(index) {
    if (confirm('Excluir este idioma?')) {
        resumeData.languages.splice(index, 1);
        renderLanguagesList();
    }
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
        const section = this.dataset.section;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
        document.getElementById('section-' + section).classList.add('active');
        const titles = {
            personal: 'Dados Pessoais', summary: 'Resumo Executivo',
            highlights: 'Destaques de Carreira', experience: 'Experiência Profissional',
            education: 'Formação Acadêmica', skills: 'Habilidades',
            languages: 'Idiomas', certifications: 'Certificações'
        };
        document.getElementById('section-title').textContent = titles[section];
    });
});

function showStatus(message, type) {
    const el = document.getElementById('statusMessage');
    el.innerHTML = message;
    el.className = 'status-message ' + type;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
}

window.addEventListener('DOMContentLoaded', loadData);
