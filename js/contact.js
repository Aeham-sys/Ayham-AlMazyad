// Formspree Submission Logic
const form = document.getElementById('contactForm');
const statusDiv = document.getElementById('status-message');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        showStatus('Sending message...', '');

        try {
            const res = await fetch('https://formspree.io/f/mpqynzeo', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (res.ok) {
                showStatus('✅ Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            } else {
                const data = await res.json();
                if (data.errors) {
                    showStatus(`❌ Error: ${data.errors.map(error => error.message).join(", ")}`, 'error');
                } else {
                    showStatus('❌ Oops! There was a problem submitting your form.', 'error');
                }
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            showStatus('⚠️ Submission failed. Please check your network connection.', 'error');
        }
    });
}

function showStatus(msg, cls) {
    if (!statusDiv) return;
    statusDiv.textContent = msg;
    statusDiv.className = cls;
    statusDiv.style.display = 'block';
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 7000);
}
