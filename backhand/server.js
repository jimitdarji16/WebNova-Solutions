// ========================================
// WebNova Solutions - Backend Server
// ========================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'contacts.json');
const NEWSLETTER_FILE = path.join(__dirname, 'data', 'newsletter.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files if they don't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(NEWSLETTER_FILE)) {
    fs.writeFileSync(NEWSLETTER_FILE, JSON.stringify([], null, 2));
}

// Helper function to read JSON file
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Helper function to write JSON file
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ========================================
// API Routes
// ========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'WebNova Backend is running!' });
});

// POST - Save contact form data
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        // Validate required fields
        if (!name || !email || !service || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields (name, email, service, message)'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create contact entry
        const contact = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : '',
            service: service,
            message: message.trim(),
            createdAt: new Date().toISOString(),
            status: 'new'
        };

        // Read existing contacts and add new one
        const contacts = readJsonFile(DATA_FILE);
        contacts.push(contact);
        writeJsonFile(DATA_FILE, contacts);

        console.log(`✅ New contact saved: ${name} (${email})`);

        res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been received. We will contact you within 24 hours.',
            data: { id: contact.id }
        });

    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
});

// GET - Retrieve all contacts (for admin purposes)
app.get('/api/contacts', (req, res) => {
    try {
        const contacts = readJsonFile(DATA_FILE);
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error('Error reading contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving contacts'
        });
    }
});

// GET - Get single contact by ID
app.get('/api/contact/:id', (req, res) => {
    try {
        const contacts = readJsonFile(DATA_FILE);
        const contact = contacts.find(c => c.id === parseInt(req.params.id));
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Error reading contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving contact'
        });
    }
});

// DELETE - Delete contact by ID
app.delete('/api/contact/:id', (req, res) => {
    try {
        let contacts = readJsonFile(DATA_FILE);
        const initialLength = contacts.length;
        contacts = contacts.filter(c => c.id !== parseInt(req.params.id));
        
        if (contacts.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        writeJsonFile(DATA_FILE, contacts);

        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact'
        });
    }
});

// PATCH - Update contact status
app.patch('/api/contact/:id', (req, res) => {
    try {
        const contacts = readJsonFile(DATA_FILE);
        const contactIndex = contacts.findIndex(c => c.id === parseInt(req.params.id));
        
        if (contactIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        // Update fields
        const { status, notes } = req.body;
        if (status) contacts[contactIndex].status = status;
        if (notes) contacts[contactIndex].notes = notes;
        contacts[contactIndex].updatedAt = new Date().toISOString();

        writeJsonFile(DATA_FILE, contacts);

        res.json({
            success: true,
            message: 'Contact updated successfully',
            data: contacts[contactIndex]
        });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact'
        });
    }
});

// POST - Newsletter subscription
app.post('/api/newsletter', (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Read existing subscribers
        const subscribers = readJsonFile(NEWSLETTER_FILE);

        // Check if already subscribed
        const exists = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'This email is already subscribed to our newsletter'
            });
        }

        // Add new subscriber
        const subscriber = {
            id: Date.now(),
            email: email.trim().toLowerCase(),
            subscribedAt: new Date().toISOString()
        };

        subscribers.push(subscriber);
        writeJsonFile(NEWSLETTER_FILE, subscribers);

        console.log(`📧 New newsletter subscriber: ${email}`);

        res.status(201).json({
            success: true,
            message: 'Thank you for subscribing to our newsletter!'
        });

    } catch (error) {
        console.error('Error saving newsletter subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
});

// GET - All newsletter subscribers
app.get('/api/newsletter', (req, res) => {
    try {
        const subscribers = readJsonFile(NEWSLETTER_FILE);
        res.json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (error) {
        console.error('Error reading subscribers:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving subscribers'
        });
    }
});

// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log('   WebNova Solutions Backend Server');
    console.log('========================================');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Contact data: ${DATA_FILE}`);
    console.log(`📧 Newsletter data: ${NEWSLETTER_FILE}`);
    console.log('----------------------------------------');
    console.log('API Endpoints:');
    console.log('  POST   /api/contact     - Save contact form');
    console.log('  GET    /api/contacts    - Get all contacts');
    console.log('  GET    /api/contact/:id - Get single contact');
    console.log('  PATCH  /api/contact/:id - Update contact');
    console.log('  DELETE /api/contact/:id - Delete contact');
    console.log('  POST   /api/newsletter  - Subscribe to newsletter');
    console.log('  GET    /api/newsletter  - Get all subscribers');
    console.log('========================================');
});
