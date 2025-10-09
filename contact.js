class ContactManager {
    constructor() {
        this.form = null;
        this.submitBtn = null;
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        
        if (this.form) {
            this.setupEventListeners();
            this.setupCharacterCounter();
        }
    }

    setupEventListeners() {
        // Soumission du formulaire
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validation en temps réel
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Validation spéciale pour l'email
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateEmail(emailInput));
        }

        // Validation pour la checkbox privacy
        const privacyCheckbox = document.getElementById('privacy');
        if (privacyCheckbox) {
            privacyCheckbox.addEventListener('change', () => this.validatePrivacy(privacyCheckbox));
        }
    }

    setupCharacterCounter() {
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('char-count');
        
        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', () => {
                const length = messageTextarea.value.length;
                charCount.textContent = length;
                
                // Changer la couleur si proche de la limite
                if (length > 900) {
                    charCount.style.color = 'var(--error)';
                } else if (length > 800) {
                    charCount.style.color = 'var(--warning)';
                } else {
                    charCount.style.color = 'var(--text-secondary)';
                }
            });
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validation complète du formulaire
        if (!this.validateForm()) {
            this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
            return;
        }

        this.isSubmitting = true;
        this.setSubmitButtonLoading(true);

        try {
            const formData = this.getFormData();
            const success = await this.sendEmail(formData);
            
            if (success) {
                this.showSuccessMessage();
                this.resetForm();
                this.showNotification('Message envoyé avec succès !', 'success');
                
                // Analytics event
                if (window.analytics) {
                    window.analytics.trackEvent('form_submit', {
                        form_type: 'contact',
                        subject: formData.subject
                    });
                }
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            console.error('Erreur envoi formulaire:', error);
            this.showNotification('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonLoading(false);
        }
    }

    validateForm() {
        let isValid = true;
        
        // Validation nom
        const name = document.getElementById('name');
        if (!this.validateField(name)) isValid = false;
        
        // Validation email
        const email = document.getElementById('email');
        if (!this.validateEmail(email)) isValid = false;
        
        // Validation sujet
        const subject = document.getElementById('subject');
        if (!this.validateField(subject)) isValid = false;
        
        // Validation message
        const message = document.getElementById('message');
        if (!this.validateMessage(message)) isValid = false;
        
        // Validation privacy
        const privacy = document.getElementById('privacy');
        if (!this.validatePrivacy(privacy)) isValid = false;
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        if (field.required && !value) {
            this.showFieldError(field, 'Ce champ est requis');
            return false;
        }
        
        if (fieldName === 'name' && value.length < 2) {
            this.showFieldError(field, 'Le nom doit contenir au moins 2 caractères');
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }

    validateEmail(emailField) {
        const email = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email && emailField.required) {
            this.showFieldError(emailField, 'L\'email est requis');
            return false;
        }
        
        if (email && !emailRegex.test(email)) {
            this.showFieldError(emailField, 'Format d\'email invalide');
            return false;
        }
        
        this.clearFieldError(emailField);
        return true;
    }

    validateMessage(messageField) {
        const message = messageField.value.trim();
        
        if (!message) {
            this.showFieldError(messageField, 'Le message est requis');
            return false;
        }
        
        if (message.length < 10) {
            this.showFieldError(messageField, 'Le message doit contenir au moins 10 caractères');
            return false;
        }
        
        if (message.length > 1000) {
            this.showFieldError(messageField, 'Le message ne peut pas dépasser 1000 caractères');
            return false;
        }
        
        this.clearFieldError(messageField);
        return true;
    }

    validatePrivacy(privacyField) {
        if (!privacyField.checked) {
            this.showFieldError(privacyField, 'Vous devez accepter l\'utilisation de vos données');
            return false;
        }
        
        this.clearFieldError(privacyField);
        return true;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.classList.remove('error');
    }

    getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            company: document.getElementById('company').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            language: window.languageManager ? window.languageManager.currentLanguage : 'fr'
        };
    }

    async sendEmail(formData) {
        // Simulation d'envoi d'email (à remplacer par EmailJS ou votre service)
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulation d'un envoi réussi
                console.log('Email simulé envoyé:', formData);
                
                // Sauvegarde locale pour démonstration
                this.saveToLocalStorage(formData);
                
                resolve(true);
            }, 2000);
        });
        
        // Exemple avec EmailJS (décommentez et configurez)
        /*
        try {
            const result = await emailjs.send(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    company: formData.company,
                    subject: formData.subject,
                    message: formData.message,
                    to_email: 'dylan.carion@example.com'
                },
                'YOUR_PUBLIC_KEY'
            );
            
            return result.status === 200;
        } catch (error) {
            console.error('EmailJS error:', error);
            return false;
        }
        */
    }

    saveToLocalStorage(formData) {
        try {
            let messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            messages.push(formData);
            
            // Garder seulement les 50 derniers messages
            if (messages.length > 50) {
                messages = messages.slice(-50);
            }
            
            localStorage.setItem('contact_messages', JSON.stringify(messages));
        } catch (error) {
            console.error('Erreur sauvegarde localStorage:', error);
        }
    }

    setSubmitButtonLoading(loading) {
        if (!this.submitBtn) return;
        
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoading = this.submitBtn.querySelector('.btn-loading');
        
        if (loading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'flex';
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    }

    showSuccessMessage() {
        const successDiv = document.getElementById('form-success');
        const form = document.getElementById('contact-form');
        
        if (successDiv && form) {
            form.style.display = 'none';
            successDiv.style.display = 'block';
            
            // Masquer le message de succès après 10 secondes
            setTimeout(() => {
                successDiv.style.display = 'none';
                form.style.display = 'block';
            }, 10000);
        }
    }

    resetForm() {
        if (this.form) {
            this.form.reset();
            
            // Réinitialiser le compteur de caractères
            const charCount = document.getElementById('char-count');
            if (charCount) {
                charCount.textContent = '0';
                charCount.style.color = 'var(--text-secondary)';
            }
            
            // Supprimer les classes d'erreur
            const fields = this.form.querySelectorAll('input, textarea, select');
            fields.forEach(field => this.clearFieldError(field));
        }
    }

    showNotification(message, type = 'info') {
        // Utiliser le système de notification existant
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            // Fallback simple
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Méthode pour récupérer les messages sauvegardés (pour admin)
    getStoredMessages() {
        try {
            return JSON.parse(localStorage.getItem('contact_messages') || '[]');
        } catch (error) {
            console.error('Erreur lecture localStorage:', error);
            return [];
        }
    }

    // Méthode pour exporter les messages
    exportMessages() {
        const messages = this.getStoredMessages();
        const dataStr = JSON.stringify(messages, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `contact_messages_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Initialiser le gestionnaire de contact
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
    
    // Exposer les méthodes d'administration (pour développement)
    if (localStorage.getItem('admin_mode') === 'true') {
        window.exportContactMessages = () => window.contactManager.exportMessages();
        window.getContactMessages = () => window.contactManager.getStoredMessages();
        console.log('Mode admin activé. Utilisez exportContactMessages() et getContactMessages()');
    }
});