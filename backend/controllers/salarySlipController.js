const SalarySlip = require('../models/SalarySlip');

// Create new salary slip
exports.createSalarySlip = async (req, res) => {
  try {
    const slipData = {
      ...req.body,
      created_by: req.user.id
    };

    const newSlip = await SalarySlip.create(slipData);
    res.status(201).json({
      success: true,
      data: newSlip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all slips for the authenticated user
exports.getMySalarySlips = async (req, res) => {
  try {
    const slips = await SalarySlip.findByUserId(req.user.id);
    res.status(200).json({
      success: true,
      count: slips.length,
      data: slips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single slip
exports.getSalarySlip = async (req, res) => {
  try {
    const slip = await SalarySlip.findById(req.params.id);
    if (!slip) {
      return res.status(404).json({
        success: false,
        message: 'Salary slip not found'
      });
    }
    
    // Check ownership
    if (slip.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this slip'
      });
    }

    res.status(200).json({
      success: true,
      data: slip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete slip
exports.deleteSalarySlip = async (req, res) => {
  try {
    const slip = await SalarySlip.findById(req.params.id);
    if (!slip) {
      return res.status(404).json({
        success: false,
        message: 'Salary slip not found'
      });
    }

    if (slip.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this slip'
      });
    }

    await SalarySlip.delete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Salary slip deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
