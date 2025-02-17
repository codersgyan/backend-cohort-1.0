const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
// Serve static files from the "public" folder (client code)
app.use(express.static('public'));

// Serve the chopped images statically from the "chopped_images" folder
app.use('/chopped_images', express.static('chopped_images'));

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
