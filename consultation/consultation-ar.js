/* ============================
   CONSULTATION PAGE — ARABIC
   ============================ */

const API_URL = 'https://hamzauy-backend-516915806239.europe-west1.run.app';
const WHATSAPP_NUMBER = '201557403075';

// ── Dark mode ──────────────────────────────────────────────────────────────
const darkToggle = document.getElementById('darkModeToggle');
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}
if (darkToggle) {
    darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
    });
}

// ── Date picker: today minimum ──────────────────────────────────────────────
const dateInput = document.getElementById('preferredDate');
if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// ── Field refs ──────────────────────────────────────────────────────────────
const form          = document.getElementById('consultForm');
const submitBtn     = document.getElementById('submitBtn');
const submitText    = document.getElementById('submitText');
const submitSpinner = document.getElementById('submitSpinner');
const formError     = document.getElementById('formError');
const formErrorText = document.getElementById('formErrorText');
const successState  = document.getElementById('successState');
const successDetails = document.getElementById('successDetails');

// ── Validation helpers ──────────────────────────────────────────────────────
function setField(id, state) {
    const el = document.getElementById(id);
    const group = el?.closest('.form-group');
    if (!group) return;
    group.classList.remove('success', 'error');
    if (state) group.classList.add(state);
}

function validateName() {
    const v = document.getElementById('fullName').value.trim();
    const ok = v.length >= 2;
    setField('fullName', ok ? 'success' : 'error');
    return ok;
}

function validatePhone() {
    const v = document.getElementById('phone').value.trim();
    const ok = /^01[0-9]{9}$/.test(v);
    setField('phone', ok ? 'success' : 'error');
    return ok;
}

function validateEmail() {
    const v = document.getElementById('email').value.trim();
    if (!v) { setField('email', ''); return true; }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    setField('email', ok ? 'success' : 'error');
    return ok;
}

function validateSelect(id) {
    const v = document.getElementById(id).value;
    const ok = Boolean(v);
    setField(id, ok ? 'success' : 'error');
    return ok;
}

function validateDate() {
    const v = document.getElementById('preferredDate').value;
    if (!v) { setField('preferredDate', 'error'); return false; }
    const selected = new Date(v);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const ok = selected >= now;
    setField('preferredDate', ok ? 'success' : 'error');
    return ok;
}

// Live validation
document.getElementById('fullName')?.addEventListener('blur', validateName);
document.getElementById('phone')?.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').slice(0, 11);
    validatePhone();
});
document.getElementById('phone')?.addEventListener('blur', validatePhone);
document.getElementById('email')?.addEventListener('blur', validateEmail);
document.getElementById('serviceType')?.addEventListener('change', () => validateSelect('serviceType'));
document.getElementById('goal')?.addEventListener('change', () => validateSelect('goal'));
document.getElementById('preferredDate')?.addEventListener('change', validateDate);
document.getElementById('preferredTime')?.addEventListener('change', () => validateSelect('preferredTime'));

// ── Submit ──────────────────────────────────────────────────────────────────
form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameOk    = validateName();
    const phoneOk   = validatePhone();
    const emailOk   = validateEmail();
    const serviceOk = validateSelect('serviceType');
    const goalOk    = validateSelect('goal');
    const dateOk    = validateDate();
    const timeOk    = validateSelect('preferredTime');

    if (!nameOk || !phoneOk || !emailOk || !serviceOk || !goalOk || !dateOk || !timeOk) {
        const firstErr = form.querySelector('.form-group.error input, .form-group.error select');
        firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErr?.focus();
        return;
    }

    const payload = buildPayload();
    setLoading(true);
    hideError();

    try {
        await submitReservation(payload);
        showSuccess(payload);
    } catch (err) {
        showError(err.message || 'حدث خطأ. من فضلك حاول مرة أخرى أو تواصل معنا على الواتساب.');
    } finally {
        setLoading(false);
    }
});

function buildPayload() {
    const serviceLabels = {
        general:      'استشارة عامة',
        training:     'خطة تدريب',
        nutrition:    'خطة تغذية',
        full:         'باقة كاملة (تدريب + تغذية)',
        'plan-advice': 'أي خطة تناسبني؟'
    };
    const goalLabels = {
        'weight-loss':   'إنقاص الوزن',
        'muscle-gain':   'بناء العضلات',
        fitness:         'لياقة عامة',
        'body-recomp':   'إعادة تشكيل الجسم',
        other:           'غير ذلك'
    };

    const timeLabels = {
        '09:00': '9:00 صباحاً',
        '10:00': '10:00 صباحاً',
        '11:00': '11:00 صباحاً',
        '12:00': '12:00 ظهراً',
        '13:00': '1:00 ظهراً',
        '14:00': '2:00 مساءً',
        '15:00': '3:00 مساءً',
        '16:00': '4:00 مساءً',
        '17:00': '5:00 مساءً',
        '18:00': '6:00 مساءً',
        '19:00': '7:00 مساءً',
        '20:00': '8:00 مساءً',
        '21:00': '9:00 مساءً'
    };

    const serviceVal = document.getElementById('serviceType').value;
    const goalVal    = document.getElementById('goal').value;
    const dateVal    = document.getElementById('preferredDate').value;
    const timeVal    = document.getElementById('preferredTime').value;

    return {
        name:          document.getElementById('fullName').value.trim(),
        phone:         document.getElementById('phone').value.trim(),
        email:         document.getElementById('email').value.trim() || null,
        serviceType:   serviceVal,
        serviceLabel:  serviceLabels[serviceVal] || serviceVal,
        goal:          goalVal,
        goalLabel:     goalLabels[goalVal] || goalVal,
        preferredDate: dateVal,
        preferredTime: timeVal,
        timeLabel:     timeLabels[timeVal] || timeVal,
        preferredSlot: `${dateVal} الساعة ${timeLabels[timeVal] || timeVal}`,
        notes:         document.getElementById('notes').value.trim() || null,
        language:      'ar',
        status:        'pending',
        createdAt:     new Date().toISOString()
    };
}

async function submitReservation(payload) {
    const endpoints = [
        `${API_URL}/api/reservation`,
        `${API_URL}/reservation`
    ];

    let lastErr = null;
    for (const url of endpoints) {
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) return await res.json().catch(() => ({}));

            const data = await res.json().catch(() => ({}));
            lastErr = new Error(data.error || data.message || `خطأ من السيرفر ${res.status}`);
        } catch (err) {
            lastErr = err;
        }
    }
    throw lastErr || new Error('تعذّر إرسال الطلب');
}

function showSuccess(payload) {
    form.classList.add('hidden');
    successDetails.innerHTML = `
        <strong>الاسم:</strong> ${escHtml(payload.name)}<br>
        <strong>الهاتف:</strong> ${escHtml(payload.phone)}<br>
        <strong>الخدمة:</strong> ${escHtml(payload.serviceLabel)}<br>
        <strong>الهدف:</strong> ${escHtml(payload.goalLabel)}<br>
        <strong>الموعد المفضل:</strong> ${escHtml(payload.preferredSlot)}<br>
        ${payload.notes ? `<strong>ملاحظات:</strong> ${escHtml(payload.notes)}` : ''}
    `.trim();
    successState.classList.remove('hidden');
    successState.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setLoading(on) {
    submitBtn.disabled = on;
    submitText.classList.toggle('hidden', on);
    submitSpinner.classList.toggle('hidden', !on);
}

function showError(msg) {
    formErrorText.textContent = msg;
    formError.classList.remove('hidden');
    formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    formError.classList.add('hidden');
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Navbar scroll effect ────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 20) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}, { passive: true });
