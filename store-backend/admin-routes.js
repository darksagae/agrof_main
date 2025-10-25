/**
 * Admin Routes for Seller Request Management
 * WhatsApp Bot Integration
 */

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xtklayjpdpfykjbttaac.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0a2xheWpwZHBmeWtqYnR0YWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwOTI2NTcsImV4cCI6MjA3NTY2ODY1N30.GXPo5n_MlOWqIe5lEKcgVJD_A3wyx2IPNyH9DmgXtWM';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const adminToken = req.headers['x-admin-token'];
  const expectedToken = process.env.ADMIN_TOKEN || 'agrof-admin-2024';
  
  if (!adminToken || adminToken !== expectedToken) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized. Admin token required.' 
    });
  }
  
  next();
};

// Apply admin authentication to all routes
router.use(authenticateAdmin);

/**
 * GET /api/admin/seller-requests
 * List all pending seller requests
 */
router.get('/seller-requests', async (req, res) => {
  try {
    console.log('📋 Fetching pending seller requests...');
    
    const { data: requests, error } = await supabase
      .from('role_requests')
      .select(`
        id,
        user_id,
        business_name,
        contact_email,
        contact_phone,
        business_address,
        business_description,
        business_license,
        tax_id,
        status,
        created_at,
        updated_at,
        reviewed_at,
        reviewed_by,
        review_notes,
        rejection_reason
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching seller requests:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`✅ Found ${requests.length} pending seller requests`);
    
    res.json({
      success: true,
      requests: requests || [],
      count: requests?.length || 0
    });

  } catch (error) {
    console.error('❌ Error in seller-requests endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/admin/seller-request/:id
 * Get details of a specific seller request
 */
router.get('/seller-request/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📋 Fetching seller request details for ID: ${id}`);
    
    const { data: request, error } = await supabase
      .from('role_requests')
      .select(`
        id,
        user_id,
        business_name,
        contact_email,
        contact_phone,
        business_address,
        business_description,
        business_license,
        tax_id,
        status,
        created_at,
        updated_at,
        reviewed_at,
        reviewed_by,
        review_notes,
        rejection_reason,
        existing_role,
        requested_role
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching seller request:', error);
      return res.status(404).json({
        success: false,
        error: 'Request not found'
      });
    }

    console.log(`✅ Found seller request: ${request.business_name}`);
    
    res.json({
      success: true,
      request
    });

  } catch (error) {
    console.error('❌ Error in seller-request endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/admin/approve-seller-request
 * Approve a seller request
 */
router.post('/approve-seller-request', async (req, res) => {
  try {
    const { requestId, adminId, notes } = req.body;
    
    if (!requestId) {
      return res.status(400).json({
        success: false,
        error: 'Request ID is required'
      });
    }

    console.log(`✅ Approving seller request: ${requestId}`);
    
    // Update the request status to approved
    const { data: updateData, error: updateError } = await supabase
      .from('role_requests')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: '7ko6X5MssdNZUSvy5uIFRxsUdYq1', // Use a valid user ID
        review_notes: notes || 'Approved via WhatsApp bot',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select();

    if (updateError) {
      console.error('❌ Error updating request status:', updateError);
      return res.status(500).json({
        success: false,
        error: updateError.message
      });
    }

    // Update user type to 'both' (buyer and seller)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .update({
        user_type: 'both',
        updated_at: new Date().toISOString()
      })
      .eq('id', updateData[0].user_id)
      .select();

    if (userError) {
      console.error('❌ Error updating user type:', userError);
      return res.status(500).json({
        success: false,
        error: userError.message
      });
    }

    const data = { request: updateData[0], user: userData[0] };

    console.log(`✅ Successfully approved seller request: ${requestId}`);
    
    res.json({
      success: true,
      message: 'Seller request approved successfully',
      requestId,
      data
    });

  } catch (error) {
    console.error('❌ Error in approve-seller-request endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/admin/reject-seller-request
 * Reject a seller request
 */
router.post('/reject-seller-request', async (req, res) => {
  try {
    const { requestId, adminId, reason } = req.body;
    
    if (!requestId) {
      return res.status(400).json({
        success: false,
        error: 'Request ID is required'
      });
    }

    console.log(`❌ Rejecting seller request: ${requestId}`);
    
    // Update the request status to rejected
    const { data, error } = await supabase
      .from('role_requests')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: '7ko6X5MssdNZUSvy5uIFRxsUdYq1', // Use a valid user ID
        rejection_reason: reason || 'Rejected via WhatsApp bot',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select();

    if (error) {
      console.error('❌ Error rejecting seller request:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    console.log(`✅ Successfully rejected seller request: ${requestId}`);
    
    res.json({
      success: true,
      message: 'Seller request rejected successfully',
      requestId,
      data
    });

  } catch (error) {
    console.error('❌ Error in reject-seller-request endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/admin/seller-requests/stats
 * Get statistics about seller requests
 */
router.get('/seller-requests/stats', async (req, res) => {
  try {
    console.log('📊 Fetching seller request statistics...');
    
    // Get counts by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('role_requests')
      .select('status')
      .in('status', ['pending', 'approved', 'rejected', 'under_review']);

    if (statusError) {
      console.error('❌ Error fetching status counts:', statusError);
      return res.status(500).json({
        success: false,
        error: statusError.message
      });
    }

    // Count by status
    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      under_review: 0,
      total: statusCounts?.length || 0
    };

    statusCounts?.forEach(request => {
      if (stats.hasOwnProperty(request.status)) {
        stats[request.status]++;
      }
    });

    console.log('✅ Seller request statistics:', stats);
    
    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error in seller-requests/stats endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;

