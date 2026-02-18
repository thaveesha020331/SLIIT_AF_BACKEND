import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
} from '../../controllers/Tudakshana/adminController.js';
import { protect, isAdmin } from '../../utills/Tudakshana/authMiddleware.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(isAdmin);

// Statistics
router.get('/stats', getUserStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);

export default router;
