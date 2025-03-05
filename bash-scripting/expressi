#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Get project name
read -p "Enter project name: " project_name

# Validate project name
if [[ -z "$project_name" ]]; then
    echo -e "${RED}Error: Project name can not be empty.${NC}"
    exit 1
fi

# Check if project exits
if [[ -d "$project_name" ]]; then
    echo -e "${RED}Error: Directory already exits.${NC}"
    exit 1
fi

# Create a folder
echo -e "${BLUE}Creating project folder....${NC}"
mkdir "$project_name"
cd "$project_name"

# Initialize package.json
echo -e "${BLUE}Initializing package.json...${NC}"
npm init -y

# Set package.json to use ESM
echo -e "${BLUE}Setting type: module in package.json...${NC}"
sed -i '' '/^{/ s/{/{\n  "type": "module",/' package.json

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install express dotenv cors morgan

# Install dev dependencies
npm install -D nodemon

# Update package.json scripts
echo -e "${BLUE}Adding npm scripts...${NC}"
sed -i '' 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"start": "node src\/server.js",\n    "dev": "nodemon src\/server.js"/' package.json


# Creating folder structure
echo -e "${BLUE}Creating folder structure...${NC}"
mkdir -p src/{routes,controllers,middleware,config}

# Create .env file
echo -e "${BLUE}Creating .env file...${NC}"
cat > .env << EOL
PORT=3500
NODE_ENV=development
EOL

# Create .gitignore file
echo -e "${BLUE}Creating .gitignore file...${NC}"
cat > .gitignore << EOL
node_modules/
.env
.DS_Store
npm-debug.log*
EOL

# Create http server
echo -e "${BLUE}Creating http server file...${NC}"
cat > src/server.js << EOL
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to your Express.js API!' });
});

// Start server
app.listen(port, () => {
    console.log(\`Server is running on port \${port}\`);
});
EOL

# Create users router
echo -e "${BLUE}Creating user router file...${NC}"
cat > src/routes/users.js << EOL
import express from 'express';
import { getAllUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

// Get all users
router.get('/', getAllUsers);

// Get user by ID
router.get('/:id', getUserById);

export default router;
EOL

# Create controller
echo -e "${BLUE}Creating user controller file...${NC}"
cat > src/controllers/userController.js << EOL
export const getAllUsers = (req, res) => {
    res.json({ message: 'Get all users' });
};

export const getUserById = (req, res) => {
    const { id } = req.params;
    res.json({ message: \`Get user \${id}\` });
};
EOL

# Create middleware
echo -e "${BLUE}Creating auth middleware...${NC}"
cat > src/middleware/auth.js << EOL
export const auth = (req, res, next) => {
    // Add your authentication logic here
    next();
};
EOL

# Setup git repository
echo -e "${BLUE}Setting up git repository...${NC}"
git init
git add .
git commit -m "✨ Initial commit"

echo -e "${GREEN}Project setup complete!${NC}"
echo "To start development:"
echo "1. cd $project_name"
echo "2. npm run dev"