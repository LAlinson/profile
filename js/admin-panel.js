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

// ===== EXPERIENCE MODAL =====
function openExpModal(index = null) {
    document.getElementById('exp-index').value = index !== null ? index : '';
    if (index !== null) {
        const exp = resumeData.experience[index];
        document.getElementById('expModalTitle').textContent = '✏️ Editar Experiência';
        document.getElementById('exp-company').value = exp.company || '';
        document.getElementById('exp-position').value = exp.position || '';
        document.getElementById('exp-period').value = exp.period || '';
        document.getElementById('exp-achievements').value = (exp.achievements || []).join('\n');
    } else {
        document.getElementById('expModalTitle').textContent = '💼 Nova Experiência';
        document.getElementById('exp-company').value = '';
        document.getElementById('exp-position').value = '';
        document.getElementById('exp-period').value = '';
        document.getElementById('exp-achievements').value = '';
    }
    document.getElementById('expModal').classList.add('open');
    document.getElementById('exp-company').focus();
}

function closeExpModal() {
    document.getElementById('expModal').classList.remove('open');
}

function saveExpModal() {
    const company = document.getElementById('exp-company').value.trim();
    const position = document.getElementById('exp-position').value.trim();
    const period = document.getElementById('exp-period').value.trim();
    const achievementsRaw = document.getElementById('exp-achievements').value;
    const achievements = achievementsRaw.split('\n').map(a => a.trim()).filter(a => a);

    if (!company || !position) {
        alert('Empresa e Cargo são obrigatórios.');
        return;
    }

    const indexVal = document.getElementById('exp-index').value;
    if (!resumeData.experience) resumeData.experience = [];

    if (indexVal !== '') {
        resumeData.experience[parseInt(indexVal)] = { company, position, period, achievements };
    } else {
        resumeData.experience.push({ company, position, period, achievements });
    }

    closeExpModal();
    renderExperienceList();
    saveData();
    showStatus('✅ Experiência salva!', 'success');
}

function renderExperienceList() {
    const container = document.getElementById('experience-list');
    container.innerHTML = '';
    (resumeData.experience || []).forEach((exp, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <div class="list-item-title">${exp.company} — ${exp.position}</div>
                <div class="list-item-actions">
                    <button class="btn btn-sm btn-primary" onclick="openExpModal(${index})">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteExperience(${index})">🗑️</button>
                </div>
            </div>
            <div style="font-size:13px;color:#666;margin-top:4px;">${exp.period}</div>
            ${exp.achievements?.length ? `<ul style="margin-top:8px;padding-left:18px;font-size:13px;color:#555;">${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}`;
        container.appendChild(item);
    });
}

function deleteExperience(index) {
    if (confirm('Excluir esta experiência?')) {
        resumeData.experience.splice(index, 1);
        renderExperienceList();
        saveData();
    }
}

// ===== EDUCATION MODAL =====
function openEduModal(index = null) {
    document.getElementById('edu-index').value = index !== null ? index : '';
    if (index !== null) {
        const edu = resumeData.education[index];
        document.getElementById('eduModalTitle').textContent = '✏️ Editar Formação';
        document.getElementById('edu-degree').value = edu.degree || '';
        document.getElementById('edu-institution').value = edu.institution || '';
        document.getElementById('edu-period').value = edu.period || '';
    } else {
        document.getElementById('eduModalTitle').textContent = '🎓 Nova Formação';
        document.getElementById('edu-degree').value = '';
        document.getElementById('edu-institution').value = '';
        document.getElementById('edu-period').value = '';
    }
    document.getElementById('eduModal').classList.add('open');
    document.getElementById('edu-degree').focus();
}

function closeEduModal() {
    document.getElementById('eduModal').classList.remove('open');
}

function saveEduModal() {
    const degree = document.getElementById('edu-degree').value.trim();
    const institution = document.getElementById('edu-institution').value.trim();
    const period = document.getElementById('edu-period').value.trim();

    if (!degree || !institution) {
        alert('Curso e Instituição são obrigatórios.');
        return;
    }

    const indexVal = document.getElementById('edu-index').value;
    if (!resumeData.education) resumeData.education = [];

    if (indexVal !== '') {
        resumeData.education[parseInt(indexVal)] = { degree, institution, period };
    } else {
        resumeData.education.push({ degree, institution, period });
    }

    closeEduModal();
    renderEducationList();
    saveData();
    showStatus('✅ Formação salva!', 'success');
}

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
                    <button class="btn btn-sm btn-primary" onclick="openEduModal(${index})">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEducation(${index})">🗑️</button>
                </div>
            </div>
            <div style="font-size:13px;color:#666;margin-top:4px;">${edu.institution}${edu.period ? ' · ' + edu.period : ''}</div>`;
        container.appendChild(item);
    });
}

function deleteEducation(index) {
    if (confirm('Excluir esta formação?')) {
        resumeData.education.splice(index, 1);
        renderEducationList();
        saveData();
    }
}

// ===== LANGUAGE MODAL =====
function openLangModal(index = null) {
    document.getElementById('lang-index').value = index !== null ? index : '';
    if (index !== null) {
        const lang = resumeData.languages[index];
        document.getElementById('langModalTitle').textContent = '✏️ Editar Idioma';
        document.getElementById('lang-name').value = lang.name || '';
        document.getElementById('lang-level').value = lang.level || '';
        document.getElementById('lang-proficiency').value = lang.proficiency || 70;
        document.getElementById('lang-prof-value').textContent = lang.proficiency || 70;
    } else {
        document.getElementById('langModalTitle').textContent = '🌍 Novo Idioma';
        document.getElementById('lang-name').value = '';
        document.getElementById('lang-level').value = '';
        document.getElementById('lang-proficiency').value = 70;
        document.getElementById('lang-prof-value').textContent = 70;
    }
    document.getElementById('langModal').classList.add('open');
    document.getElementById('lang-name').focus();
}

function closeLangModal() {
    document.getElementById('langModal').classList.remove('open');
}

function saveLangModal() {
    const name = document.getElementById('lang-name').value.trim();
    const level = document.getElementById('lang-level').value;
    const proficiency = parseInt(document.getElementById('lang-proficiency').value);

    if (!name || !level) {
        alert('Idioma e Nível são obrigatórios.');
        return;
    }

    const indexVal = document.getElementById('lang-index').value;
    if (!resumeData.languages) resumeData.languages = [];

    if (indexVal !== '') {
        resumeData.languages[parseInt(indexVal)] = { name, level, proficiency };
    } else {
        resumeData.languages.push({ name, level, proficiency });
    }

    closeLangModal();
    renderLanguagesList();
    saveData();
    showStatus('✅ Idioma salvo!', 'success');
}

function renderLanguagesList() {
    const container = document.getElementById('languages-list');
    container.innerHTML = '';
    (resumeData.languages || []).forEach((lang, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-item-header">
                <div class="list-item-title">${lang.name} — ${lang.level}</div>
                <div class="list-item-actions">
                    <button class="btn btn-sm btn-primary" onclick="openLangModal(${index})">✏️ Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteLanguage(${index})">🗑️</button>
                </div>
            </div>
            <div style="font-size:13px;color:#666;margin-top:6px;">
                <div style="background:#eee;border-radius:4px;height:6px;width:100%;">
                    <div style="background:#3498db;height:6px;border-radius:4px;width:${lang.proficiency}%;"></div>
                </div>
                <span style="font-size:11px;">${lang.proficiency}%</span>
            </div>`;
        container.appendChild(item);
    });
}

function deleteLanguage(index) {
    if (confirm('Excluir este idioma?')) {
        resumeData.languages.splice(index, 1);
        renderLanguagesList();
        saveData();
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
