const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Route to start the web scraping process
app.get('/scrape', async (req, res) => {
  try {
    // URL to scrape (replace with your target URL)
    const url = 'https://example.com';

    // Fetch the HTML content of the page
    const { data: html } = await axios.get(url);

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Extract data (replace "title" with your desired selector)
    const scrapedData = [];
    $('h1, h2, h3').each((index, element) => {
      scrapedData.push({
        text: $(element).text().trim(),
      });
    });

    // Respond with the scraped data
    if (scrapedData.length > 0) {
      res.json({
        status: 'success',
        data: scrapedData,
      });
    } else {
      res.json({
        status: 'success',
        message: 'No data found on the page',
      });
    }
  } catch (error) {
    console.error('Error while scraping:', error.message);
    // Respond with a structured error message
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while scraping the page',
    });
  }
});

// Default route to handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});