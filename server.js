const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Proxy endpoint for webhook requests
app.post('/api/webhook', async (req, res) => {
    try {
        const { keyword } = req.body;
        
        if (!keyword) {
            return res.status(400).json({ error: 'Keyword is required' });
        }

        const webhookUrl = 'https://maxknoblock.app.n8n.cloud/webhook-test/4f76df0d-088e-4fc2-9067-17ae88c7a1c4';
        
        // Try different payload formats
        const payloads = [
            { keyword: keyword },
            { keyword: keyword, timestamp: new Date().toISOString() },
            { keyword: keyword, source: 'webhook-app' }
        ];

        for (let i = 0; i < payloads.length; i++) {
            try {
                console.log(`Trying payload format ${i + 1}:`, payloads[i]);
                
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payloads[i])
                });

                console.log(`Response status: ${response.status}`);

                if (response.ok) {
                    const responseData = await response.text();
                    console.log('Success with format', i + 1);
                    return res.json({ 
                        success: true, 
                        data: responseData,
                        format: i + 1 
                    });
                } else {
                    const errorText = await response.text();
                    console.log(`Format ${i + 1} failed:`, response.status, errorText);
                    
                    if (i === payloads.length - 1) {
                        return res.status(500).json({ 
                            error: 'All payload formats failed',
                            details: errorText 
                        });
                    }
                }
            } catch (error) {
                console.log(`Format ${i + 1} error:`, error.message);
                if (i === payloads.length - 1) {
                    return res.status(500).json({ error: error.message });
                }
            }
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Webhook proxy available at http://localhost:3000/api/webhook');
});
