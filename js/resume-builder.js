// Resume Builder - Generates HTML from JSON data
class ResumeBuilder {
    constructor(data) {
        this.data = data;
    }

    generateHTML() {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.data.personal.name} - Currículo</title>
    ${this.generateStyles()}
</head>
<body>
    <div class="container">
        ${this.generateSidebar()}
        ${this.generateMainContent()}
    </div>
</body>
</html>`;
    }

    generateStyles() {
        return `<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        .container {
            display: flex;
            max-width: 1200px;
            margin: 0 auto;
            min-height: 100vh;
        }

        .sidebar {
            background-color: #4a4a4a;
            color: white;
            width: 300px;
            padding: 40px 30px;
            flex-shrink: 0;
        }

        .profile-photo {
            width: 150px;
            height: 150px;
            border: 4px solid white;
            margin: 0 auto 30px;
            display: block;
            object-fit: cover;
            object-position: center top;
        }

        .contact-info {
            margin-bottom: 40px;
        }

        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            font-size: 14px;
        }

        .contact-item::before {
            content: '';
            width: 20px;
            height: 20px;
            margin-right: 10px;
            background-color: #a8c5c0;
            border-radius: 50%;
            flex-shrink: 0;
        }

        .sidebar h2 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            letter-spacing: 1px;
        }

        .education-item {
            margin-bottom: 25px;
            font-size: 14px;
        }

        .education-item h3 {
            font-size: 14px;
            font-weight: normal;
            margin-bottom: 5px;
        }

        .language-item {
            margin-bottom: 20px;
            font-size: 14px;
        }

        .language-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .language-name {
            font-weight: normal;
        }

        .language-level {
            font-size: 12px;
            color: #a8c5c0;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background-color: #666;
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background-color: #a8c5c0;
            transition: width 0.3s ease;
        }

        .main-content {
            flex: 1;
            background-color: white;
        }

        .header {
            background-color: #a8c5c0;
            padding: 40px 50px;
        }

        .header h1 {
            font-size: 36px;
            font-weight: bold;
            color: white;
            letter-spacing: 2px;
            line-height: 1.3;
        }

        .content {
            padding: 40px 50px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h2 {
            font-size: 20px;
            font-weight: bold;
            color: #4a4a4a;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #a8c5c0;
        }

        .section ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .section ul li {
            position: relative;
            padding-left: 25px;
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.6;
        }

        .section ul li::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: #a8c5c0;
            font-size: 14px;
        }

        .job {
            margin-bottom: 25px;
        }

        .job-period {
            font-size: 13px;
            color: #666;
            margin-bottom: 5px;
        }

        .job-title {
            font-size: 16px;
            font-weight: bold;
            color: #4a4a4a;
            margin-bottom: 10px;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px 20px;
        }

        hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 25px 0;
        }

        @media print {
            * {
                print-color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
            }

            @page {
                size: A4 portrait;
                margin: 0;
            }

            body {
                margin: 0;
                padding: 0;
            }

            .container {
                display: flex !important;
                flex-direction: row !important;
                width: 100% !important;
                height: 297mm !important;
                min-height: 297mm !important;
                max-width: none !important;
                gap: 0 !important;
            }

            .sidebar {
                width: 180px !important;
                padding: 15px 12px !important;
                flex-shrink: 0 !important;
            }

            .profile-photo {
                width: 90px !important;
                height: 90px !important;
                margin: 0 auto 10px !important;
                border-width: 3px !important;
            }

            .sidebar h2 {
                font-size: 11px !important;
                margin-bottom: 8px !important;
                letter-spacing: 0.5px !important;
            }

            .contact-info {
                margin-bottom: 20px !important;
            }

            .contact-item {
                font-size: 9px !important;
                margin-bottom: 6px !important;
                line-height: 1.3 !important;
            }

            .contact-item::before {
                width: 10px !important;
                height: 10px !important;
                margin-right: 5px !important;
            }

            .education-item {
                margin-bottom: 12px !important;
                font-size: 9px !important;
                line-height: 1.3 !important;
            }

            .education-item h3 {
                font-size: 9px !important;
                margin-bottom: 3px !important;
            }

            .language-item {
                margin-bottom: 10px !important;
                font-size: 9px !important;
            }

            .language-header {
                margin-bottom: 4px !important;
            }

            .language-level {
                font-size: 8px !important;
            }

            .progress-bar {
                height: 5px !important;
            }

            .main-content {
                flex: 1 !important;
                display: flex !important;
                flex-direction: column !important;
            }

            .header {
                padding: 18px 20px !important;
            }

            .header h1 {
                font-size: 24px !important;
                line-height: 1.2 !important;
                letter-spacing: 1.5px !important;
            }

            .content {
                padding: 18px 20px !important;
                flex: 1 !important;
            }

            .section {
                margin-bottom: 14px !important;
            }

            .section h2 {
                font-size: 11px !important;
                margin-bottom: 6px !important;
                padding-bottom: 3px !important;
                border-bottom-width: 1.5px !important;
            }

            .section ul {
                margin: 0 !important;
                padding: 0 !important;
            }

            .section ul li {
                font-size: 8.5px !important;
                margin-bottom: 2px !important;
                line-height: 1.35 !important;
                padding-left: 12px !important;
            }

            .section ul li::before {
                font-size: 8px !important;
            }

            .job {
                margin-bottom: 10px !important;
            }

            .job-period {
                font-size: 8.5px !important;
                margin-bottom: 2px !important;
            }

            .job-title {
                font-size: 9.5px !important;
                margin-bottom: 3px !important;
            }

            .job ul {
                margin-top: 2px !important;
            }

            .job ul li {
                font-size: 8.5px !important;
                margin-bottom: 1.5px !important;
                line-height: 1.35 !important;
            }

            .skills-grid {
                gap: 2px 12px !important;
                grid-template-columns: 1fr 1fr !important;
            }

            .skills-grid li {
                font-size: 8.5px !important;
                margin-bottom: 2px !important;
            }

            hr {
                margin: 10px 0 !important;
                border-top-width: 1px !important;
            }
        }
    </style>`;
    }

    generateSidebar() {
        const { personal, education, languages } = this.data;

        return `<div class="sidebar">
            <img src="${personal.photo}" alt="${personal.name}" class="profile-photo">
            
            <div class="contact-info">
                <div class="contact-item">${personal.email}</div>
                <div class="contact-item">${personal.phone}</div>
                <div class="contact-item">${personal.location}</div>
                <div class="contact-item">
                    <a href="${personal.linkedin}" target="_blank" style="color: white; text-decoration: none;">linkedin.com/in/lucas-alinson</a>
                </div>
            </div>

            <section>
                <h2>FORMAÇÃO ACADÊMICA</h2>
                ${education.map(edu => `
                <div class="education-item">
                    <h3>${edu.degree}</h3>
                    <p>${edu.institution}</p>
                </div>
                `).join('')}
            </section>

            <section>
                <h2>IDIOMAS</h2>
                ${languages.map(lang => `
                <div class="language-item">
                    <div class="language-header">
                        <span class="language-name">${lang.name}:</span>
                        <span class="language-level">${lang.level}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${lang.proficiency}%;"></div>
                    </div>
                </div>
                `).join('')}
            </section>
        </div>`;
    }

    generateMainContent() {
        const { personal, summary, careerHighlights, experience, skills, certifications } = this.data;

        return `<div class="main-content">
            <div class="header">
                <h1>${personal.name.toUpperCase()}</h1>
            </div>

            <div class="content">
                <section class="section">
                    <h2>Resumo Executivo</h2>
                    <ul>
                        <li>${summary.text}</li>
                        ${summary.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </section>

                <section class="section">
                    <h2>Destaques de Carreira</h2>
                    <ul>
                        ${careerHighlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </section>

                <hr>

                <section class="section">
                    <h2>Experiência Profissional</h2>
                    ${experience.map(job => `
                    <div class="job">
                        <div class="job-period">${job.period}</div>
                        <div class="job-title">${job.company} - ${job.position}</div>
                        <ul>
                            ${job.achievements.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                    `).join('')}
                </section>

                <hr>

                <section class="section">
                    <h2>Habilidades e Competências</h2>
                    <ul class="skills-grid">
                        ${skills.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </section>

                <hr>

                <section class="section">
                    <h2>Certificações Relevantes</h2>
                    <ul>
                        ${certifications.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </section>
            </div>
        </div>`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumeBuilder;
}
