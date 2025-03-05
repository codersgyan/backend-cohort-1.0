// app.js
import express from 'express';
import compression from 'compression';
import { body, param, validationResult } from 'express-validator';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3500;

// ----------------------------------------------------
// Middlewares
// ----------------------------------------------------

// Parse JSON request bodies.
app.use(express.json());

// Use compression to optimize response sizes.
app.use(compression());

// Set caching headers for GET requests.
app.use((req, res, next) => {
    if (req.method === 'GET') {
        res.set('Cache-Control', 'public, max-age=60');
    }
    next();
});

// ----------------------------------------------------
// In-Memory Data Store for Users
// ----------------------------------------------------
let users = [];

// ----------------------------------------------------
// OpenAPI Documentation Setup using swagger-jsdoc
// ----------------------------------------------------
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User CRUD API',
            version: '1.0.0',
            description:
                'A RESTful API for managing users demonstrating best practices in API design with Express.js',
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api/v1`,
            },
        ],
    },
    apis: ['./server.js'], // This file contains the annotations.
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// ----------------------------------------------------
// API Versioning: All routes under /api/v1
// ----------------------------------------------------

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user.
 *         name:
 *           type: string
 *           description: The user's name.
 *         email:
 *           type: string
 *           description: The user's email.
 *       required:
 *         - name
 *         - email
 *       example:
 *         id: "1623456789012"
 *         name: "John Doe"
 *         email: "john.doe@example.com"
 *   responses:
 *     NotFound:
 *       description: User not found.
 *     BadRequest:
 *       description: Bad request.
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/users', (req, res) => {
    res.json(users);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id.
 *     responses:
 *       200:
 *         description: A single user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get(
    '/users/:id',
    [param('id').notEmpty().withMessage('User id is required.')],
    (req, res) => {
        const { id } = req.params;
        const user = users.find((u) => u.id === id);
        if (!user) {
            return res.status(404).json({
                error: 'NotFound',
                message: 'User not found',
                statusCode: 404,
            });
        }
        res.json(user);
    }
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user.
 *     requestBody:
 *       required: true
 *       description: User object to be created.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post(
    '/users',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
    ],
    createUser
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id.
 *     requestBody:
 *       required: true
 *       description: User object to update.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               name: "Jane Doe"
 *               email: "jane.doe@example.com"
 *     responses:
 *       200:
 *         description: The user was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put(
    '/users/:id',
    [
        param('id').notEmpty().withMessage('User id is required'),
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'BadRequest',
                message: errors.array(),
                statusCode: 400,
            });
        }
        const { id } = req.params;
        const userIndex = users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({
                error: 'NotFound',
                message: 'User not found',
                statusCode: 404,
            });
        }
        const updatedUser = { ...users[userIndex], ...req.body };
        users[userIndex] = updatedUser;
        res.json(updatedUser);
    }
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id.
 *     responses:
 *       200:
 *         description: The user was deleted successfully.
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete(
    '/users/:id',
    [param('id').notEmpty().withMessage('User id is required')],
    (req, res) => {
        const { id } = req.params;
        const userIndex = users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
            return res.status(404).json({
                error: 'NotFound',
                message: 'User not found',
                statusCode: 404,
            });
        }
        users.splice(userIndex, 1);
        res.json({ message: 'User deleted successfully' });
    }
);

// ----------------------------------------------------
// Mount the Router and Global Error Handling
// ----------------------------------------------------
app.use('/api/v1', router);

// http://localhost:3500/api/v1/users/123

// Global error handler.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'InternalServerError',
        message: 'Something went wrong!',
        statusCode: 500,
    });
});

// ----------------------------------------------------
// Start the Server
// ----------------------------------------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
