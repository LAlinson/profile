// User Manager - handles CRUD for multiple users
class UserManager {
    constructor() {
        this.users = [];
        this.storageKey = 'resumeUsers';
    }

    async loadUsers() {
        // Try localStorage first (for edits made in browser)
        const cached = localStorage.getItem(this.storageKey);
        if (cached) {
            this.users = JSON.parse(cached);
            return this.users;
        }
        // Fall back to JSON file
        try {
            const response = await fetch('data/users.json');
            const data = await response.json();
            this.users = data.users;
            return this.users;
        } catch (e) {
            this.users = [];
            return [];
        }
    }

    saveUsers() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.users));
    }

    getAll() {
        return this.users;
    }

    getById(id) {
        return this.users.find(u => u.id === id);
    }

    add(userData) {
        const newUser = {
            id: 'user-' + Date.now(),
            name: userData.name || 'Novo Usuário',
            email: userData.email || '',
            role: userData.role || '',
            location: userData.location || '',
            photo: userData.photo || 'profile-photo.png',
            createdAt: new Date().toISOString().split('T')[0],
            resumeData: this._emptyResumeData(userData)
        };
        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    update(id, updates) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            this.saveUsers();
            return this.users[index];
        }
        return null;
    }

    updateResumeData(id, resumeData) {
        const user = this.getById(id);
        if (user) {
            user.resumeData = resumeData;
            // Sync top-level fields from personal data
            user.name = resumeData.personal.name;
            user.email = resumeData.personal.email;
            user.photo = resumeData.personal.photo;
            this.saveUsers();
            return user;
        }
        return null;
    }

    delete(id) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            this.saveUsers();
            return true;
        }
        return false;
    }

    exportJSON() {
        return JSON.stringify({ users: this.users }, null, 2);
    }

    importJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.users && Array.isArray(data.users)) {
                this.users = data.users;
                this.saveUsers();
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    _emptyResumeData(userData) {
        return {
            personal: {
                name: userData.name || '',
                photo: userData.photo || 'profile-photo.png',
                email: userData.email || '',
                phone: '',
                location: userData.location || '',
                linkedin: ''
            },
            summary: { text: '', highlights: [] },
            careerHighlights: [],
            experience: [],
            skills: [],
            education: [],
            languages: [],
            certifications: []
        };
    }
}

// Singleton
const userManager = new UserManager();
