// Offer Letter Controller
// This controller handles all offer letter related operations
const { supabase } = require('../config/database');

const offerLetterController = {

  // Get all offer letters for the user
  getOfferLetters: async (req, res) => {
    try {
      const userId = req.user.id;
      
      const { data, error } = await supabase
        .from('offer_letters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({
        success: true,
        data: data || [],
        message: 'Offer letters retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting offer letters:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get offer letters',
        error: error.message
      });
    }
  },

  // Create a new offer letter
  createOfferLetter: async (req, res) => {
    try {
      const userId = req.user.id;
      const offerLetterData = req.body;

      // Extract top-level fields for the table, store the rest in offer_data
      const newOfferLetter = {
        user_id: userId,
        candidate_name: offerLetterData.candidateName,
        candidate_email: offerLetterData.candidateEmail,
        job_title: offerLetterData.jobTitle,
        status: offerLetterData.status || 'draft',
        pdf_url: offerLetterData.pdf_url || null,
        offer_data: offerLetterData
      };

      const { data, error } = await supabase
        .from('offer_letters')
        .insert([newOfferLetter])
        .select()
        .single();
        
      if (error) throw error;

      res.status(201).json({
        success: true,
        message: 'Offer letter created successfully',
        data: data
      });
    } catch (error) {
      console.error('Error creating offer letter:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to create offer letter',
        error: error.message
      });
    }
  },

  // Get a single offer letter by ID
  getOfferLetter: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const { data, error } = await supabase
        .from('offer_letters')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data: data,
        message: 'Offer letter retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting offer letter:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get offer letter',
        error: error.message
      });
    }
  },

  // Update an offer letter
  updateOfferLetter: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Prepare fields dynamically depending on what is updated
      const payload = { updated_at: new Date().toISOString() };
      if (updateData.candidateName) payload.candidate_name = updateData.candidateName;
      if (updateData.candidateEmail) payload.candidate_email = updateData.candidateEmail;
      if (updateData.jobTitle) payload.job_title = updateData.jobTitle;
      if (updateData.status) payload.status = updateData.status;
      if (updateData.pdf_url) payload.pdf_url = updateData.pdf_url;
      
      // Update offer_data only if we have full object, otherwise keep existing
      if (updateData.offerTitle) {
        payload.offer_data = updateData;
      }

      const { data, error } = await supabase
        .from('offer_letters')
        .update(payload)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        message: 'Offer letter updated successfully',
        data: data
      });
    } catch (error) {
      console.error('Error updating offer letter:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to update offer letter',
        error: error.message
      });
    }
  },

  // Delete an offer letter
  deleteOfferLetter: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const { error } = await supabase
        .from('offer_letters')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      res.json({
        success: true,
        message: 'Offer letter deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting offer letter:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to delete offer letter',
        error: error.message
      });
    }
  },

  // Preview offer letter
  previewOfferLetter: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // TODO: Implement preview generation
      res.json({
        success: true,
        data: {
          preview: 'Preview HTML/content here'
        },
        message: 'Preview generated successfully'
      });
    } catch (error) {
      console.error('Error generating preview:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to generate preview',
        error: error.message
      });
    }
  },

  // Generate PDF
  generatePDF: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // TODO: Implement PDF generation
      res.json({
        success: true,
        message: 'PDF generated successfully',
        data: {
          pdfUrl: '/temp/pdf-url.pdf'
        }
      });
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to generate PDF',
        error: error.message
      });
    }
  },

  // Send offer letter via email
  sendOfferLetter: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { emailBody } = req.body;

      // TODO: Implement email sending
      res.json({
        success: true,
        message: 'Offer letter sent successfully'
      });
    } catch (error) {
      console.error('Error sending offer letter:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to send offer letter',
        error: error.message
      });
    }
  },

  // Get templates
  getTemplates: async (req, res) => {
    try {
      const userId = req.user.id;

      // TODO: Implement template retrieval
      res.json({
        success: true,
        data: [
          {
            id: 'template-1',
            name: 'Full-Time Offer',
            category: 'full-time',
            isDefault: true
          },
          {
            id: 'template-2',
            name: 'Internship Offer',
            category: 'internship',
            isDefault: true
          }
        ],
        message: 'Templates retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting templates:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to get templates',
        error: error.message
      });
    }
  },

  // Upload custom template
  uploadTemplate: async (req, res) => {
    try {
      const userId = req.user.id;
      // File upload will be handled by multer middleware

      // TODO: Implement template upload and processing
      res.status(201).json({
        success: true,
        message: 'Template uploaded successfully',
        data: {
          id: 'temp-template-id',
          name: req.body.name || 'Custom Template'
        }
      });
    } catch (error) {
      console.error('Error uploading template:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to upload template',
        error: error.message
      });
    }
  },

  // Delete template
  deleteTemplate: async (req, res) => {
    try {
      const { templateId } = req.params;
      const userId = req.user.id;

      // TODO: Implement template deletion
      res.json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting template:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to delete template',
        error: error.message
      });
    }
  },

  // Analyze offer letter
  analyzeOfferLetter: async (req, res) => {
    try {
      const userId = req.user.id;
      const { file, text } = req.body;

      // TODO: Implement AI analysis
      // This will analyze uploaded resumes or offer letter content
      res.json({
        success: true,
        data: {
          extractedInfo: {},
          suggestions: [],
          missingFields: []
        },
        message: 'Analysis completed successfully'
      });
    } catch (error) {
      console.error('Error analyzing offer letter:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze offer letter',
        error: error.message
      });
    }
  }
};

module.exports = offerLetterController;

