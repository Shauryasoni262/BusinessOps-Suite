const express = require('express');
const multer = require('multer');
const router = express.Router();

// Import controllers
const projectController = require('../controllers/projectController');
const taskController = require('../controllers/taskController');
const milestoneController = require('../controllers/milestoneController');
const fileController = require('../controllers/fileController');

// Import middleware
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now, but you can add restrictions here
    cb(null, true);
  }
});

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Project routes
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Project member routes
router.post('/:id/members', projectController.addMember);
router.delete('/:id/members/:userId', projectController.removeMember);
router.get('/:id/members', projectController.getMembers);

// Project statistics
router.get('/:id/stats', projectController.getProjectStats);

// Task routes
router.get('/:projectId/tasks', taskController.getProjectTasks);
router.post('/:projectId/tasks', taskController.createTask);
router.get('/:projectId/tasks/:taskId', taskController.getTask);
router.put('/:projectId/tasks/:taskId', taskController.updateTask);
router.delete('/:projectId/tasks/:taskId', taskController.deleteTask);
router.get('/:projectId/tasks/stats', taskController.getTaskStats);

// Milestone routes
router.get('/:projectId/milestones', milestoneController.getProjectMilestones);
router.post('/:projectId/milestones', milestoneController.createMilestone);
router.get('/:projectId/milestones/:milestoneId', milestoneController.getMilestone);
router.put('/:projectId/milestones/:milestoneId', milestoneController.updateMilestone);
router.delete('/:projectId/milestones/:milestoneId', milestoneController.deleteMilestone);
router.patch('/:projectId/milestones/:milestoneId/complete', milestoneController.markMilestoneCompleted);
router.get('/:projectId/milestones/stats', milestoneController.getMilestoneStats);

// File routes
router.get('/:projectId/files', fileController.getProjectFiles);
router.post('/:projectId/files', upload.single('file'), fileController.uploadFile);
router.get('/:projectId/files/:fileId', fileController.getFile);
router.delete('/:projectId/files/:fileId', fileController.deleteFile);
router.get('/:projectId/files/stats', fileController.getFileStats);

module.exports = router;
