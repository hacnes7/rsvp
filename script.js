// Replace this URL with your deployed Apps Script Web App URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyDW1fEMw8RfXBNKCqbyl79OEaTqBHvGixQAiPf9LOyOJe1ifF73yu8jVpR1b_un-tZ/exec';

// DOM Elements
const form = document.getElementById('rsvp-form');
const rsvpContainer = document.getElementById('rsvp-container');
const successMessage = document.getElementById('success-message');
const submitBtn = document.getElementById('submit-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMsg = document.getElementById('error-msg');

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
    setTimeout(() => {
        errorMsg.classList.add('hidden');
    }, 5000);
}

function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-80', 'cursor-not-allowed');
        loadingSpinner.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
        loadingSpinner.classList.add('hidden');
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nama = document.getElementById('nama').value.trim();
    const nim = document.getElementById('nim').value.trim();
    const meHadir = document.querySelector('input[name="kehadiran"]:checked');
    const kehadiran = meHadir ? meHadir.value : '';

    if (!nama || !nim) {
        showError("Jangan tinggalkan jejak kosong!");
        return;
    }

    setLoading(true);

    const payload = {
        nama: nama,
        nim: nim,
        kehadiran: kehadiran
    };

    try {
        // Send data to Apps Script Web App
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // Bypasses CORS pre-flight restrictions
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
            setLoading(false);
            showSuccess();
        } else {
            throw new Error(result.message || 'Unknown error');
        }
        
    } catch (error) {
        console.error("Gagal mengirim mantra:", error);
        setLoading(false);
        showError("Gagal mengirim data. Silakan coba lagi.");
    }
});

function showSuccess() {
    rsvpContainer.style.opacity = '0';
    rsvpContainer.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        rsvpContainer.style.display = 'none';
        
        successMessage.style.display = 'block';
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'scale(0.9)';
        
        void successMessage.offsetWidth;
        
        successMessage.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        successMessage.style.opacity = '1';
        successMessage.style.transform = 'scale(1)';
    }, 500);
}