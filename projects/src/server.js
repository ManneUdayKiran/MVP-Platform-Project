const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});