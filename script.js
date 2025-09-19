class WebhookApp {
    constructor() {
        this.inputScreen = document.getElementById('input-screen');
        this.resultsScreen = document.getElementById('results-screen');
        this.keywordForm = document.getElementById('keyword-form');
        this.keywordInput = document.getElementById('keyword-input');
        this.webhookUrl = 'https://maxknoblock.app.n8n.cloud/webhook/4f76df0d-088e-4fc2-9067-17ae88c7a1c4';
        this.loading = document.getElementById('loading');
        this.resultsContent = document.getElementById('results-content');
        this.backButton = document.getElementById('back-button');
        
        this.init();
    }

    init() {
        this.keywordForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.backButton.addEventListener('click', () => this.showInputScreen());
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const keyword = this.keywordInput.value.trim();
        
        if (!keyword) {
            alert('Please enter a keyword');
            return;
        }

        this.showResultsScreen();
        this.showLoading();

        try {
            const response = await this.sendToWebhook(this.webhookUrl, keyword);
            this.displayResults(response);
        } catch (error) {
            this.displayError(error.message);
        }
    }

    async sendToWebhook(url, keyword) {
        console.log('Sending directly to webhook:', url);
        console.log('Keyword:', keyword);

        // Try different payload formats for n8n compatibility
        const payloads = [
            { keyword: keyword },
            { keyword: keyword, timestamp: new Date().toISOString() },
            { keyword: keyword, source: 'webhook-app' }
        ];

        for (let i = 0; i < payloads.length; i++) {
            try {
                const payload = payloads[i];
                console.log(`Trying payload format ${i + 1}:`, payload);

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                console.log('Response status:', response.status);

                if (response.ok) {
                    // Try to get response text first
                    const responseText = await response.text();
                    console.log('Raw response:', responseText);
                    
                    // Try to parse as JSON, fallback to text
                    try {
                        const responseData = JSON.parse(responseText);
                        console.log('Parsed JSON:', responseData);
                        return responseData;
                    } catch (parseError) {
                        console.log('Not JSON, returning as text');
                        return responseText;
                    }
                } else {
                    const errorText = await response.text();
                    console.log(`Format ${i + 1} failed:`, response.status, errorText);
                    
                    if (i === payloads.length - 1) {
                        throw new Error(`All payload formats failed. Last error: ${response.status} - ${errorText}`);
                    }
                }
            } catch (error) {
                console.log(`Format ${i + 1} error:`, error.message);
                if (i === payloads.length - 1) {
                    throw error;
                }
            }
        }
    }

    showInputScreen() {
        this.inputScreen.classList.add('active');
        this.resultsScreen.classList.remove('active');
        this.keywordInput.value = '';
    }

    showResultsScreen() {
        this.inputScreen.classList.remove('active');
        this.resultsScreen.classList.add('active');
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.loading.classList.add('show');
        this.resultsContent.innerHTML = '';
        this.resultsContent.classList.remove('loaded');
    }

    hideLoading() {
        this.loading.classList.remove('show');
        this.loading.classList.add('hidden');
    }

    displayResults(data) {
        this.hideLoading();
        
        let html = '<h3>Webhook Response:</h3>';
        
        if (typeof data === 'object') {
            html += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        } else if (typeof data === 'string') {
            // Handle plain text responses
            html += '<div class="text-response">' + data + '</div>';
        } else {
            html += '<p>' + String(data) + '</p>';
        }
        
        this.resultsContent.innerHTML = html;
        this.resultsContent.classList.remove('error');
        this.resultsContent.classList.add('success');
        
        // Trigger smooth appearance of content
        setTimeout(() => {
            this.resultsContent.classList.add('loaded');
        }, 100);
    }

    displayError(message) {
        this.hideLoading();
        this.resultsContent.innerHTML = '<h3>Error:</h3><p>' + message + '</p>';
        this.resultsContent.classList.remove('success');
        this.resultsContent.classList.add('error');
        
        // Trigger smooth appearance of error content
        setTimeout(() => {
            this.resultsContent.classList.add('loaded');
        }, 100);
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WebhookApp();
});
