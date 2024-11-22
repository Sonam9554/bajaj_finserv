const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const user_id = "john_doe_17091999";
const email = "john@xyz.com";
const roll_number = "ABCD123";

// Helper Functions
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const parseFile = (base64String) => {
    if (!base64String) return { valid: false, mimeType: null, size: null };
    try {
        const buffer = Buffer.from(base64String, 'base64');
        const sizeKB = (buffer.length / 1024).toFixed(2);
        return { valid: true, mimeType: "application/octet-stream", size: sizeKB };
    } catch {
        return { valid: false, mimeType: null, size: null };
    }
};

// POST Endpoint
app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: "Invalid input data" });
    }

    const numbers = [];
    const alphabets = [];
    let highestLowercase = null;
    let isPrimeFound = false;

    data.forEach((item) => {
        if (!isNaN(item)) {
            numbers.push(item);
            if (isPrime(parseInt(item))) isPrimeFound = true;
        } else if (/^[a-zA-Z]$/.test(item)) {
            alphabets.push(item);
            if (/[a-z]/.test(item) && (!highestLowercase || item > highestLowercase)) {
                highestLowercase = item;
            }
        }
    });

    const fileInfo = parseFile(file_b64);

    res.json({
        is_success: true,
        user_id,
        email,
        roll_number,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        is_prime_found: isPrimeFound,
        file_valid: fileInfo.valid,
        file_mime_type: fileInfo.mimeType,
        file_size_kb: fileInfo.size,
    });
});

// GET Endpoint
app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
