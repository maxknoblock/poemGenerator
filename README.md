# Poem Generator

A beautiful web application that generates poetry using AI through n8n webhooks. Enter a word or phrase and watch as it transforms into beautiful poetry.

## Features

- **Elegant UI Design** - Soft pink gradient background with romantic typography
- **Smooth Animations** - Gentle transitions and hover effects
- **Responsive Layout** - Works on desktop and mobile devices
- **Real-time Generation** - Connects to n8n webhook for AI poetry generation
- **No Scrolling Required** - Compact design fits in viewport

## Setup

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/maxknoblock/poemGenerator.git
   cd poemGenerator
   ```

2. **Start the development server:**
   ```bash
   python3 -m http.server 8000
   ```
   OR if you have Node.js:
   ```bash
   npx serve .
   ```

3. **Open your browser:**
   Navigate to `http://localhost:8000`

### Deployment to Vercel

1. **Connect to Vercel:**
   - Push your code to GitHub
   - Connect your GitHub repository to Vercel
   - Deploy automatically

2. **Update webhook URL:**
   - Update the webhook URL in `script.js` to your production n8n endpoint

## Usage

1. **Enter Inspiration:** Type a word, feeling, or idea that inspires you
2. **Generate Poetry:** Click "Create Poetry" to send your inspiration to the AI
3. **View Results:** Watch as your word transforms into beautiful poetry
4. **Create More:** Click "Create Another" to generate more poems

## Technical Details

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with gradients and animations
- **Backend Integration:** n8n webhook for AI processing
- **Responsive Design:** Mobile-first approach with flexible layouts

## File Structure

```
poemGenerator/
├── index.html          # Main application interface
├── styles.css          # Styling and animations
├── script.js           # Webhook communication logic
├── package.json        # Project configuration
├── server.js           # Express server (optional)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Webhook Configuration

The app connects to your n8n webhook at:
`https://maxknoblock.app.n8n.cloud/webhook/4f76df0d-088e-4fc2-9067-17ae88c7a1c4`

### n8n Workflow Setup

1. **Create Webhook Node** in your n8n workflow
2. **Set Response Mode** to "Using Respond to Webhook Node"
3. **Configure Response Body** with your AI-generated poetry
4. **Activate Workflow** to enable the webhook

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own poetry generation needs.