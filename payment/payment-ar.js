// Configuration
const WHATSAPP_NUMBER = '201557403075'; // Without + sign

// Backend API URL
const API_URL = 'https://hamzauy-backend-516915806239.europe-west1.run.app';
const ORDER_API_ENDPOINTS = [
    `${API_URL}/orders`,
    `${API_URL}/api/orders`
];

// Language System
const html = document.documentElement;
const FIXED_LANG = 'ar';
let currentLang = FIXED_LANG;

function switchLanguage(lang) {
    currentLang = lang;
    
    // Update HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en][data-ar]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Handle different element types
            if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else if (element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', text);
            } else if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                if (element.hasAttribute('value')) {
                    element.value = text;
                } else {
                    element.textContent = text;
                }
            } else {
                element.textContent = text;
            }
        }
    });
    
}

// Initialize language on load
window.addEventListener('DOMContentLoaded', function() {
    switchLanguage(FIXED_LANG);
});

// Plan Selection and Price Update
const planOptions = document.querySelectorAll('.plan-option');
const summaryPlan = document.getElementById('summaryPlan');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTotal = document.getElementById('summaryTotal');
const summaryFeatures = document.getElementById('summaryFeatures');
const modalAmount = document.getElementById('modalAmount');
const modalAmountWallet = document.getElementById('modalAmountWallet');

const planData = {
    regular: {
        name: {en: 'Regular', ar: 'عادي'},
        price: 800,
        features: [
            {en: '✓ Customized diet plan', ar: '✓ نظام غذائي مخصص'},
            {en: '✓ Training program', ar: '✓ برنامج تدريبي'},
            {en: '✓ Weekly follow-up', ar: '✓ متابعة أسبوعية'},
            {en: '✓ 48-hour delivery', ar: '✓ تسليم خلال 48 ساعة'}
        ]
    },
    advanced: {
        name: {en: 'Advanced', ar: 'متقدم'},
        price: 1400,
        features: [
            {en: '✓ Customized diet plan', ar: '✓ نظام غذائي مخصص'},
            {en: '✓ Training program', ar: '✓ برنامج تدريبي'},
            {en: '✓ Daily follow-up', ar: '✓ متابعة يومية'},
            {en: '✓ 48-hour delivery', ar: '✓ تسليم خلال 48 ساعة'},
            {en: '✓ Priority response', ar: '✓ أولوية في الرد'},
            {en: '✓ Weekly video call', ar: '✓ مكالمة فيديو أسبوعية'}
        ]
    },
    vip: {
        name: {en: 'VIP', ar: 'VIP'},
        price: 1800,
        features: [
            {en: '✓ All Advanced features', ar: '✓ جميع مميزات المتقدم'},
            {en: '✓ 24-hour delivery', ar: '✓ تسليم خلال 24 ساعة'},
            {en: '✓ Premium support', ar: '✓ دعم مميز'},
            {en: '✓ Exclusive content', ar: '✓ محتوى حصري'}
        ]
    }
};

// Update summary when plan changes
planOptions.forEach(option => {
    const radio = option.querySelector('input[type="radio"]');
    radio.addEventListener('change', function() {
        const planType = this.value;
        const plan = planData[planType];
        
        // Update summary
        summaryPlan.textContent = plan.name[currentLang];
        const currency = currentLang === 'ar' ? 'جنيه' : 'EGP';
        summarySubtotal.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        summaryTotal.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        modalAmount.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        modalAmountWallet.innerHTML = `${plan.price} <span data-en="EGP" data-ar="جنيه">${currency}</span>`;
        
        // Update features list
        summaryFeatures.innerHTML = plan.features.map(feature => 
            `<li data-en="${feature.en}" data-ar="${feature.ar}">${feature[currentLang]}</li>`
        ).join('');
    });
});

// Phone Number Validation
const phoneInput = document.getElementById('phone');
const phoneGroup = phoneInput.closest('.form-group');
const phoneError = document.getElementById('phoneError');

phoneInput.addEventListener('input', function(e) {
    // Remove any non-digit characters
    let value = e.target.value.replace(/\D/g, '');
    
    // Limit to 11 digits
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    e.target.value = value;
    
    // Validate
    validatePhone();
});

phoneInput.addEventListener('blur', validatePhone);

function validatePhone() {
    const value = phoneInput.value;
    const pattern = /^01[0-9]{9}$/;
    
    phoneGroup.classList.remove('error', 'success');
    
    if (value === '') {
        return true;
    }
    
    if (!pattern.test(value)) {
        phoneGroup.classList.add('error');
        return false;
    } else {
        phoneGroup.classList.add('success');
        return true;
    }
}

// Payment Method Selection
const qrModal = document.getElementById('qrModal');
const modalClose = document.querySelector('.modal-close');
const completeCheckoutBtn = document.getElementById('completeCheckout');
const confirmPaymentBtn = document.getElementById('confirmPayment');

// Payment Tabs Functionality
const paymentTabs = document.querySelectorAll('.payment-tab');
const tabContents = document.querySelectorAll('.payment-tab-content');

paymentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const method = this.getAttribute('data-method');
        
        // Update active tab
        paymentTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${method}-content`) {
                content.classList.add('active');
            }
        });
    });
});

// Copy Wallet Number
const copyWalletBtn = document.getElementById('copyWalletBtn');
const walletNumber = document.querySelector('.wallet-number').textContent;

copyWalletBtn.addEventListener('click', async function() {
    try {
        await navigator.clipboard.writeText(walletNumber);
        
        // Visual feedback
        this.classList.add('copied');
        const copyText = this.querySelector('.copy-text');
        const originalText = copyText.textContent;
        copyText.textContent = currentLang === 'ar' ? 'تم النسخ' : 'Copied';
        
        setTimeout(() => {
            this.classList.remove('copied');
            copyText.textContent = originalText;
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = walletNumber;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const copyText = this.querySelector('.copy-text');
            copyText.textContent = currentLang === 'ar' ? 'تم النسخ!' : 'Copied!';
            setTimeout(() => {
                copyText.textContent = currentLang === 'ar' ? 'نسخ' : 'Copy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
        document.body.removeChild(textArea);
    }
});

// Complete Checkout Button
completeCheckoutBtn.addEventListener('click', function() {
    // Validate form
    const shippingForm = document.getElementById('shippingForm');
    
    // Check phone validation first
    if (!validatePhone()) {
        phoneInput.focus();
        return;
    }
    
    if (!shippingForm.checkValidity()) {
        shippingForm.reportValidity();
        return;
    }
    
    // Show modal - only InstaPay/Wallet payment
    qrModal.classList.add('show');
    
    // Make sure InstaPay tab is active by default
    if (paymentTabs.length > 0) {
        paymentTabs[0].click();
    }
});

// Close modal
modalClose.addEventListener('click', function() {
    qrModal.classList.remove('show');
});

// Close modal when clicking outside
qrModal.addEventListener('click', function(e) {
    if (e.target === qrModal) {
        qrModal.classList.remove('show');
    }
});

// ESC key to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && qrModal.classList.contains('show')) {
        qrModal.classList.remove('show');
    }
});

// Confirm Payment Button - Save to Database & WhatsApp
confirmPaymentBtn.addEventListener('click', async function() {
    const shippingForm = document.getElementById('shippingForm');

    if (!validatePhone()) {
        phoneInput.focus();
        return;
    }

    if (!shippingForm.checkValidity()) {
        shippingForm.reportValidity();
        return;
    }

    const orderData = buildOrderData();

    setConfirmPaymentLoading(true);
    try {
        const savedOrder = await saveOrderToDatabase(orderData);
        console.log('✅ Order saved to database:', savedOrder.orderId || orderData.orderId);

        openWhatsappConfirmation(orderData);

        setTimeout(() => {
            qrModal.classList.remove('show');
        }, 500);
    } catch (error) {
        console.error('❌ Could not save order to database:', error);
        alert(currentLang === 'ar'
            ? 'حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.'
            : 'There was a problem saving your order. Please try again.'
        );
    } finally {
        setConfirmPaymentLoading(false);
    }
});

// Dark Mode Support
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

// Initialize with selected plan from homepage or default
window.addEventListener('load', function() {
    // Check if a plan was selected from the homepage
    const selectedPlan = localStorage.getItem('selectedPlan');
    
    if (selectedPlan) {
        // Find and select the corresponding radio button
        const planRadio = document.querySelector(`input[name="plan"][value="${selectedPlan}"]`);
        if (planRadio) {
            planRadio.checked = true;
            planRadio.dispatchEvent(new Event('change'));
        }
        
        // Clear the selection after loading
        localStorage.removeItem('selectedPlan');
    } else {
        // Load default plan if nothing was pre-selected
        const defaultPlan = document.querySelector('input[name="plan"]:checked');
        if (defaultPlan) {
            defaultPlan.dispatchEvent(new Event('change'));
        }
    }
});


function getActivePaymentMethod() {
    const activeTab = document.querySelector('.payment-tab.active');
    return activeTab ? activeTab.getAttribute('data-method') : 'instapay';
}

function buildOrderData() {
    const selectedPlan = document.querySelector('input[name="plan"]:checked').value;
    const plan = planData[selectedPlan];

    return {
        orderId: 'ORD-' + Date.now(),
        customerName: document.getElementById('fullName').value.trim(),
        customerEmail: document.getElementById('email').value.trim(),
        customerPhone: document.getElementById('phone').value.trim(),
        customerAddress: document.getElementById('address').value.trim(),
        customerCity: document.getElementById('city').value.trim(),
        customerCountry: document.getElementById('country').value,
        customerNotes: document.getElementById('notes').value.trim() || null,
        planType: selectedPlan,
        planName: plan.name.en,
        planNameAr: plan.name.ar,
        planPrice: plan.price,
        paymentMethod: getActivePaymentMethod(),
        paymentStatus: 'pending_confirmation',
        orderStatus: 'new',
        currency: 'EGP',
        language: currentLang,
        createdAt: new Date().toISOString()
    };
}

function setConfirmPaymentLoading(isLoading) {
    confirmPaymentBtn.disabled = isLoading;
    confirmPaymentBtn.classList.toggle('loading', isLoading);

    const buttonText = confirmPaymentBtn.querySelector('span');
    if (!buttonText) return;

    if (isLoading) {
        buttonText.textContent = currentLang === 'ar' ? 'جاري حفظ الطلب...' : 'Saving order...';
    } else {
        buttonText.textContent = buttonText.getAttribute(`data-${currentLang}`);
    }
}

function openWhatsappConfirmation(orderData) {
    const plan = planData[orderData.planType];
    const text = currentLang === 'ar'
        ? `مرحباً، أنا ${orderData.customerName}\n\nقمت بالدفع للخطة: ${plan.name.ar}\nالمبلغ: ${plan.price} جنيه\nرقم الطلب: ${orderData.orderId}\nرقم الهاتف: ${orderData.customerPhone}\n\nسأقوم بإرسال لقطة شاشة تأكيد الدفع.`
        : `Hello, I'm ${orderData.customerName}\n\nI have completed payment for: ${plan.name.en} Plan\nAmount: ${plan.price} EGP\nOrder ID: ${orderData.orderId}\nPhone: ${orderData.customerPhone}\n\nI will send the payment confirmation screenshot.`;
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappURL, '_blank');
}

// Save orders to Database
async function saveOrderToDatabase(orderData) {
    let lastError = null;

    for (const endpoint of ORDER_API_ENDPOINTS) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                console.log('✅ Saved to database:', data);
                return data && Object.keys(data).length ? data : orderData;
            }

            lastError = new Error(`Database API error ${response.status} at ${endpoint}`);
            lastError.details = data;
            console.error('❌ Database API error:', response.status, data);
        } catch (error) {
            lastError = error;
            console.error('❌ Error saving to database:', error);
        }
    }

    throw lastError || new Error('Could not save order to database');
}
