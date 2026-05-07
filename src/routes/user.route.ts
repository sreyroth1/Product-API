import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

// GET routes
router.get('/count', (req, res) => userController.getCount(req, res));
router.get('/email', (req, res) => userController.getByEmail(req, res));
router.get('/:id', (req, res) => userController.getById(req, res));
router.get('/', (req, res) => userController.getAll(req, res));

// POST route
router.post('/', (req, res) => userController.create(req, res));

// PUT route
router.put('/:id', (req, res) => userController.update(req, res));

// DELETE route
router.delete('/:id', (req, res) => userController.delete(req, res));

export default router;
