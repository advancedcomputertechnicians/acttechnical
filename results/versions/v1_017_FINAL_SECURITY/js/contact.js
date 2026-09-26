/**
 * contact.js - v1.017 Professional Contact System
 * Handles form validation, Honeypot security, and AJAX transmission to contact.php
 */

class ContactSystem {
    constructor(formId) {
        this.form = document.querySelector(formId);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        // 1. Client-Side Honeypot Check (Fail Silently)
        const honeypot = this.form.querySelector('input[name="website"]');
        if (honeypot && honeypot.value !== "") {
            console.warn("Spam detected via Honeypot. Submission dropped.");
            this.showSuccess(); // Show success to bot to prevent second attempts
            return;
        }

        const btn = this.form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'TRANSMITTING...';
        btn.disabled = true;

        // 2. Prepare Data
        const formData = new FormData(this.form);
        // Ensure manual fields from index.html (ids) are included if they don't have name attributes
        // but naming convention says they should have 'name' attributes for PHP.
        // Let's ensure the form has Name attributes for Name, Email, Phone, Brief.
        // Or we can manually append them here.
        formData.append('name', document.getElementById('form-name').value);
        formData.append('email', document.getElementById('form-email').value);
        formData.append('phone', document.getElementById('form-phone').value);
        formData.append('brief', document.getElementById('form-brief').value);

        try {
            // 3. AJAX Fetch Transmission
            const response = await fetch('./contact.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 'success') {
                this.showSuccess(btn, originalText);
            } else {
                throw new Error(result.message || "Transmission Error");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Technical error during transmission: " + error.message);
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }

    showSuccess(btn, originalText) {
        if (btn) {
            btn.innerText = 'TRANSMISSION COMPLETE';
            btn.classList.add('bg-cyan-500');
        }
        
        alert("Technical Inquiry Transmitted Successfully.\nOur specialists will contact you shortly.");

        // Celebratory Fireworks
        if (window.weatherSystem) {
            window.weatherSystem.forceState('fireworks');
        }

        // Reset UI
        setTimeout(() => {
            if (btn) {
                btn.innerText = originalText;
                btn.classList.remove('bg-cyan-500');
                btn.disabled = false;
            }
            this.form.reset();
        }, 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.contactSystem = new ContactSystem('form');
});
