/**
 * AGROF Workflow Automation Service
 * Main server for workflow automation system
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs-extra');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const WorkflowEngine = require('./workflow-engine');
const WorkflowScheduler = require('./workflow-scheduler');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (UI)
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = path.join(__dirname, 'automation.db');
const db = new sqlite3.Database(dbPath);

// Initialize workflow engine and scheduler
const workflowEngine = new WorkflowEngine(db);
const workflowScheduler = new WorkflowScheduler(db, workflowEngine);

// Event listeners
workflowEngine.on('workflow:complete', (data) => {
  console.log(`✅ Workflow completed: ${data.workflowId} (${data.executionId})`);
});

workflowEngine.on('workflow:error', (data) => {
  console.error(`❌ Workflow error: ${data.workflowId}`, data.error);
});

workflowScheduler.on('workflow:scheduled_execution', (data) => {
  console.log(`⏰ Scheduled workflow executed: ${data.workflowId}`);
});

// Initialize database schema
const initializeDatabase = async () => {
  try {
    const schemaSQL = await fs.readFile(path.join(__dirname, 'database-schema.sql'), 'utf8');
    
    return new Promise((resolve, reject) => {
      db.exec(schemaSQL, (err) => {
        if (err) {
          console.error('Error initializing database:', err);
          reject(err);
        } else {
          console.log('✅ Database schema initialized');
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Error reading schema file:', error);
    throw error;
  }
};

// Load workflow templates
const loadWorkflowTemplates = async () => {
  try {
    const templates = await fs.readJson(path.join(__dirname, 'workflow-templates.json'));
    
    for (const template of templates) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR IGNORE INTO workflow_templates (name, description, category, icon, workflow_definition, is_popular)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            template.name,
            template.description,
            template.category,
            template.icon,
            JSON.stringify(template.workflow_definition),
            template.is_popular ? 1 : 0
          ],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
    }
    
    console.log(`✅ Loaded ${templates.length} workflow templates`);
  } catch (error) {
    console.error('Error loading templates:', error);
  }
};

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'AGROF Automation Engine',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Get scheduler status
app.get('/api/scheduler/status', (req, res) => {
  res.json(workflowScheduler.getStatus());
});

// ==================== WORKFLOW CRUD ====================

// Get all workflows
app.get('/api/workflows', (req, res) => {
  const { active, trigger_type, limit = 100, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM workflows WHERE 1=1';
  const params = [];
  
  if (active !== undefined) {
    query += ' AND is_active = ?';
    params.push(active === 'true' ? 1 : 0);
  }
  
  if (trigger_type) {
    query += ' AND trigger_type = ?';
    params.push(trigger_type);
  }
  
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Parse JSON fields
    const workflows = rows.map(row => ({
      ...row,
      trigger_config: row.trigger_config ? JSON.parse(row.trigger_config) : null,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
    
    res.json(workflows);
  });
});

// Get single workflow
app.get('/api/workflows/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get workflow
    const workflow = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM workflows WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!workflow) {
      res.status(404).json({ error: 'Workflow not found' });
      return;
    }
    
    // Get nodes
    const nodes = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM workflow_nodes WHERE workflow_id = ?', [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    // Get connections
    const connections = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM workflow_connections WHERE workflow_id = ?', [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    // Parse JSON fields
    workflow.trigger_config = workflow.trigger_config ? JSON.parse(workflow.trigger_config) : null;
    workflow.tags = workflow.tags ? JSON.parse(workflow.tags) : [];
    workflow.nodes = nodes.map(n => ({
      ...n,
      node_config: n.node_config ? JSON.parse(n.node_config) : {}
    }));
    workflow.connections = connections;
    
    res.json(workflow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create workflow
app.post('/api/workflows', async (req, res) => {
  const { name, description, trigger_type, trigger_config, nodes = [], connections = [], tags = [] } = req.body;
  
  if (!name || !trigger_type) {
    res.status(400).json({ error: 'Name and trigger_type are required' });
    return;
  }
  
  try {
    // Start transaction
    await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    // Insert workflow
    const workflowId = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO workflows (name, description, trigger_type, trigger_config, tags, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, trigger_type, JSON.stringify(trigger_config), JSON.stringify(tags), req.body.created_by || 'system'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
    
    // Insert nodes
    const nodeIdMap = new Map();
    for (const node of nodes) {
      const newNodeId = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO workflow_nodes (workflow_id, node_type, node_config, position_x, position_y, is_trigger, label)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            workflowId,
            node.type || node.node_type,
            JSON.stringify(node.config || node.node_config || {}),
            node.position?.x || node.position_x || 0,
            node.position?.y || node.position_y || 0,
            node.is_trigger ? 1 : 0,
            node.label || node.type
          ],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
      nodeIdMap.set(node.id, newNodeId);
    }
    
    // Insert connections
    for (const conn of connections) {
      await new Promise((resolve, reject) => {
        const fromNodeId = nodeIdMap.get(conn.from || conn.from_node_id);
        const toNodeId = nodeIdMap.get(conn.to || conn.to_node_id);
        
        db.run(
          `INSERT INTO workflow_connections (workflow_id, from_node_id, to_node_id, label)
           VALUES (?, ?, ?, ?)`,
          [workflowId, fromNodeId, toNodeId, conn.label],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });
    }
    
    // Commit transaction
    await new Promise((resolve, reject) => {
      db.run('COMMIT', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    console.log(`✅ Created workflow: ${name} (${workflowId})`);
    res.json({ id: workflowId, message: 'Workflow created successfully' });
    
  } catch (error) {
    // Rollback on error
    await new Promise((resolve) => {
      db.run('ROLLBACK', () => resolve());
    });
    
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update workflow
app.put('/api/workflows/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, trigger_config, is_active, tags } = req.body;
  
  const updates = [];
  const params = [];
  
  if (name) {
    updates.push('name = ?');
    params.push(name);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (trigger_config !== undefined) {
    updates.push('trigger_config = ?');
    params.push(JSON.stringify(trigger_config));
  }
  if (is_active !== undefined) {
    updates.push('is_active = ?');
    params.push(is_active ? 1 : 0);
  }
  if (tags !== undefined) {
    updates.push('tags = ?');
    params.push(JSON.stringify(tags));
  }
  
  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(id);
  
  db.run(
    `UPDATE workflows SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      
      // Refresh scheduler if workflow was activated/deactivated
      if (is_active !== undefined) {
        workflowScheduler.refreshScheduledWorkflows();
      }
      
      res.json({ message: 'Workflow updated successfully' });
    }
  );
});

// Delete workflow
app.delete('/api/workflows/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM workflows WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Workflow not found' });
      return;
    }
    
    // Unschedule if it was scheduled
    workflowScheduler.unscheduleWorkflow(id);
    
    res.json({ message: 'Workflow deleted successfully' });
  });
});

// ==================== WORKFLOW EXECUTION ====================

// Execute workflow manually
app.post('/api/workflows/:id/execute', async (req, res) => {
  const { id } = req.params;
  const triggerData = req.body.data || {};
  
  try {
    const result = await workflowEngine.executeWorkflow(parseInt(id), {
      ...triggerData,
      trigger: 'manual',
      triggeredBy: req.body.triggeredBy || 'api'
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get workflow executions
app.get('/api/workflows/:id/executions', (req, res) => {
  const { id } = req.params;
  const { limit = 50, offset = 0, status } = req.query;
  
  let query = 'SELECT * FROM workflow_executions WHERE workflow_id = ?';
  const params = [id];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY started_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const executions = rows.map(row => ({
      ...row,
      logs: row.logs ? JSON.parse(row.logs) : [],
      trigger_data: row.trigger_data ? JSON.parse(row.trigger_data) : null
    }));
    
    res.json(executions);
  });
});

// Get single execution
app.get('/api/executions/:executionId', (req, res) => {
  const { executionId } = req.params;
  
  db.get('SELECT * FROM workflow_executions WHERE id = ?', [executionId], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Execution not found' });
      return;
    }
    
    const execution = {
      ...row,
      logs: row.logs ? JSON.parse(row.logs) : [],
      trigger_data: row.trigger_data ? JSON.parse(row.trigger_data) : null
    };
    
    res.json(execution);
  });
});

// ==================== WORKFLOW TEMPLATES ====================

// Get all templates
app.get('/api/templates', (req, res) => {
  const { category, popular } = req.query;
  
  let query = 'SELECT * FROM workflow_templates WHERE 1=1';
  const params = [];
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (popular === 'true') {
    query += ' AND is_popular = 1';
  }
  
  query += ' ORDER BY is_popular DESC, name ASC';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const templates = rows.map(row => ({
      ...row,
      workflow_definition: row.workflow_definition ? JSON.parse(row.workflow_definition) : null
    }));
    
    res.json(templates);
  });
});

// Create workflow from template
app.post('/api/templates/:id/create-workflow', async (req, res) => {
  const { id } = req.params;
  const { name, customConfig } = req.body;
  
  try {
    // Get template
    const template = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM workflow_templates WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }
    
    const definition = JSON.parse(template.workflow_definition);
    
    // Create workflow from template
    const workflowData = {
      name: name || template.name,
      description: template.description,
      trigger_type: definition.nodes.find(n => n.is_trigger)?.type || 'manual',
      trigger_config: definition.nodes.find(n => n.is_trigger)?.config || {},
      nodes: definition.nodes,
      connections: definition.connections,
      tags: [template.category, 'from-template']
    };
    
    // Merge custom configuration if provided
    if (customConfig) {
      Object.assign(workflowData, customConfig);
    }
    
    // Use the create workflow endpoint logic
    req.body = workflowData;
    
    // Forward to create workflow endpoint
    const createResponse = await new Promise((resolve, reject) => {
      db.run('BEGIN TRANSACTION', async (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        try {
          const workflowId = await new Promise((resolve, reject) => {
            db.run(
              `INSERT INTO workflows (name, description, trigger_type, trigger_config, tags, created_by)
               VALUES (?, ?, ?, ?, ?, ?)`,
              [
                workflowData.name,
                workflowData.description,
                workflowData.trigger_type,
                JSON.stringify(workflowData.trigger_config),
                JSON.stringify(workflowData.tags),
                'template'
              ],
              function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
              }
            );
          });
          
          // Insert nodes and connections (similar to create workflow)
          const nodeIdMap = new Map();
          for (const node of workflowData.nodes) {
            const newNodeId = await new Promise((resolve, reject) => {
              db.run(
                `INSERT INTO workflow_nodes (workflow_id, node_type, node_config, position_x, position_y, is_trigger, label)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  workflowId,
                  node.type,
                  JSON.stringify(node.config || {}),
                  node.position?.x || 0,
                  node.position?.y || 0,
                  node.is_trigger ? 1 : 0,
                  node.label || node.type
                ],
                function(err) {
                  if (err) reject(err);
                  else resolve(this.lastID);
                }
              );
            });
            nodeIdMap.set(node.id, newNodeId);
          }
          
          for (const conn of workflowData.connections) {
            await new Promise((resolve, reject) => {
              db.run(
                `INSERT INTO workflow_connections (workflow_id, from_node_id, to_node_id, label)
                 VALUES (?, ?, ?, ?)`,
                [workflowId, nodeIdMap.get(conn.from), nodeIdMap.get(conn.to), conn.label],
                function(err) {
                  if (err) reject(err);
                  else resolve(this.lastID);
                }
              );
            });
          }
          
          db.run('COMMIT', (err) => {
            if (err) reject(err);
            else resolve({ id: workflowId });
          });
        } catch (error) {
          db.run('ROLLBACK', () => reject(error));
        }
      });
    });
    
    res.json({ 
      message: 'Workflow created from template successfully',
      workflowId: createResponse.id
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== WEBHOOKS ====================

// Create webhook for workflow
app.post('/api/workflows/:id/webhook', (req, res) => {
  const { id } = req.params;
  const webhookUrl = `/api/webhooks/${uuidv4()}`;
  const webhookSecret = uuidv4();
  
  db.run(
    `INSERT INTO workflow_webhooks (workflow_id, webhook_url, webhook_secret)
     VALUES (?, ?, ?)`,
    [id, webhookUrl, webhookSecret],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      res.json({
        id: this.lastID,
        webhookUrl,
        webhookSecret,
        message: 'Webhook created successfully'
      });
    }
  );
});

// Handle webhook trigger
app.post('/api/webhooks/:webhookId', async (req, res) => {
  const { webhookId } = req.params;
  const webhookUrl = `/api/webhooks/${webhookId}`;
  
  try {
    // Get webhook configuration
    const webhook = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM workflow_webhooks WHERE webhook_url = ? AND is_active = 1',
        [webhookUrl],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
    
    if (!webhook) {
      res.status(404).json({ error: 'Webhook not found' });
      return;
    }
    
    // Verify secret if provided
    const providedSecret = req.headers['x-webhook-secret'];
    if (webhook.webhook_secret && providedSecret !== webhook.webhook_secret) {
      res.status(401).json({ error: 'Invalid webhook secret' });
      return;
    }
    
    // Execute workflow
    const result = await workflowEngine.executeWorkflow(webhook.workflow_id, {
      trigger: 'webhook',
      webhookData: req.body,
      headers: req.headers
    });
    
    // Update last triggered time
    db.run(
      'UPDATE workflow_webhooks SET last_triggered_at = ? WHERE id = ?',
      [new Date().toISOString(), webhook.id],
      (err) => {
        if (err) console.error('Failed to update webhook timestamp:', err);
      }
    );
    
    res.json({ message: 'Webhook processed successfully', executionId: result.executionId });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== EVENT SUBSCRIPTIONS ====================

// Trigger event-based workflows
app.post('/api/events/:eventType', async (req, res) => {
  const { eventType } = req.params;
  const eventData = req.body;
  
  try {
    // Get all workflows subscribed to this event
    const subscriptions = await new Promise((resolve, reject) => {
      db.all(
        `SELECT ws.*, w.* FROM workflow_event_subscriptions ws
         JOIN workflows w ON ws.workflow_id = w.id
         WHERE ws.event_type = ? AND ws.is_active = 1 AND w.is_active = 1`,
        [eventType],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    
    if (subscriptions.length === 0) {
      res.json({ message: 'No workflows subscribed to this event', count: 0 });
      return;
    }
    
    // Execute all subscribed workflows
    const executions = [];
    for (const subscription of subscriptions) {
      try {
        const result = await workflowEngine.executeWorkflow(subscription.workflow_id, {
          trigger: 'event',
          eventType,
          eventData
        });
        executions.push({ workflowId: subscription.workflow_id, ...result });
      } catch (error) {
        console.error(`Failed to execute workflow ${subscription.workflow_id}:`, error);
      }
    }
    
    res.json({ 
      message: 'Event processed successfully',
      workflowsTriggered: executions.length,
      executions
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==================== SERVER STARTUP ====================

const startServer = async () => {
  try {
    console.log('🚀 Starting AGROF Automation Engine...');
    
    // Initialize database
    await initializeDatabase();
    
    // Load templates
    await loadWorkflowTemplates();
    
    // Start workflow scheduler
    await workflowScheduler.start();
    
    // Start HTTP server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ AGROF Automation Engine running on port ${PORT}`);
      console.log(`🗄️  Database: ${dbPath}`);
      console.log(`🌐 Server accessible from all network interfaces`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  
  workflowScheduler.stop();
  
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = app;

