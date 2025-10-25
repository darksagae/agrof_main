/**
 * AGROF Workflow Automation Engine
 * Similar to n8n/Make - Execute automated workflows based on triggers
 */

const EventEmitter = require('events');

class WorkflowEngine extends EventEmitter {
  constructor(database) {
    super();
    this.db = database;
    this.runningWorkflows = new Map();
    this.nodeExecutors = new Map();
    this.triggerHandlers = new Map();
    
    // Register built-in node executors
    this.registerBuiltInExecutors();
  }

  /**
   * Register all built-in node executors
   */
  registerBuiltInExecutors() {
    // Trigger nodes
    this.registerTrigger('schedule', this.scheduleTrigger.bind(this));
    this.registerTrigger('webhook', this.webhookTrigger.bind(this));
    this.registerTrigger('event', this.eventTrigger.bind(this));
    this.registerTrigger('manual', this.manualTrigger.bind(this));

    // Action nodes
    this.registerExecutor('inventory_update', this.inventoryUpdateAction.bind(this));
    this.registerExecutor('send_sms', this.sendSMSAction.bind(this));
    this.registerExecutor('send_email', this.sendEmailAction.bind(this));
    this.registerExecutor('send_notification', this.sendNotificationAction.bind(this));
    this.registerExecutor('database_query', this.databaseQueryAction.bind(this));
    this.registerExecutor('http_request', this.httpRequestAction.bind(this));
    this.registerExecutor('generate_report', this.generateReportAction.bind(this));
    this.registerExecutor('update_product', this.updateProductAction.bind(this));
    this.registerExecutor('create_order', this.createOrderAction.bind(this));
    this.registerExecutor('delay', this.delayAction.bind(this));

    // Condition nodes
    this.registerExecutor('condition', this.conditionNode.bind(this));
    this.registerExecutor('switch', this.switchNode.bind(this));
    this.registerExecutor('filter', this.filterNode.bind(this));

    // Data transformation nodes
    this.registerExecutor('transform', this.transformNode.bind(this));
    this.registerExecutor('merge', this.mergeNode.bind(this));
    this.registerExecutor('split', this.splitNode.bind(this));
  }

  /**
   * Register a custom node executor
   */
  registerExecutor(nodeType, executorFunction) {
    this.nodeExecutors.set(nodeType, executorFunction);
    console.log(`✅ Registered executor: ${nodeType}`);
  }

  /**
   * Register a trigger handler
   */
  registerTrigger(triggerType, handler) {
    this.triggerHandlers.set(triggerType, handler);
    console.log(`✅ Registered trigger: ${triggerType}`);
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId, triggerData = {}) {
    const executionId = this.generateExecutionId();
    
    try {
      console.log(`🚀 Starting workflow execution: ${workflowId} (${executionId})`);
      
      // Get workflow definition
      const workflow = await this.getWorkflow(workflowId);
      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      if (!workflow.is_active) {
        throw new Error(`Workflow ${workflowId} is not active`);
      }

      // Create execution record
      await this.createExecution(executionId, workflowId, 'running');

      // Get workflow nodes and connections
      const nodes = await this.getWorkflowNodes(workflowId);
      const connections = await this.getWorkflowConnections(workflowId);

      // Build execution graph
      const graph = this.buildExecutionGraph(nodes, connections);

      // Execute workflow starting from trigger node
      const triggerNode = nodes.find(n => n.node_type.includes('trigger') || n.is_trigger);
      if (!triggerNode) {
        throw new Error('No trigger node found in workflow');
      }

      // Track workflow state
      const workflowState = {
        executionId,
        workflowId,
        data: triggerData,
        variables: {},
        logs: []
      };

      this.runningWorkflows.set(executionId, workflowState);

      // Execute nodes in order
      await this.executeNode(triggerNode, graph, workflowState);

      // Mark execution as complete
      await this.updateExecution(executionId, 'success', workflowState.logs);
      
      console.log(`✅ Workflow execution completed: ${executionId}`);
      this.emit('workflow:complete', { executionId, workflowId });

      return { executionId, status: 'success', data: workflowState.data };

    } catch (error) {
      console.error(`❌ Workflow execution failed: ${executionId}`, error);
      await this.updateExecution(executionId, 'failed', [], error.message);
      this.emit('workflow:error', { executionId, workflowId, error });
      throw error;
    } finally {
      this.runningWorkflows.delete(executionId);
    }
  }

  /**
   * Execute a single node
   */
  async executeNode(node, graph, workflowState) {
    const nodeId = node.id;
    const nodeType = node.node_type;
    const nodeConfig = typeof node.node_config === 'string' 
      ? JSON.parse(node.node_config) 
      : node.node_config;

    console.log(`📍 Executing node: ${nodeType} (${nodeId})`);
    workflowState.logs.push({
      timestamp: new Date().toISOString(),
      nodeId,
      nodeType,
      message: `Executing ${nodeType}`
    });

    // Get executor for this node type
    const executor = this.nodeExecutors.get(nodeType);
    if (!executor) {
      throw new Error(`No executor found for node type: ${nodeType}`);
    }

    try {
      // Execute the node
      const result = await executor(nodeConfig, workflowState.data, workflowState);

      // Handle conditional nodes (they return next node IDs)
      if (result && result.nextNodeId) {
        const nextNode = graph.nodes.find(n => n.id === result.nextNodeId);
        if (nextNode) {
          return await this.executeNode(nextNode, graph, workflowState);
        }
      }

      // Update workflow data with node result
      if (result && result.data !== undefined) {
        workflowState.data = result.data;
      }

      // Get next nodes in the workflow
      const nextNodes = graph.connections
        .filter(c => c.from_node_id === nodeId)
        .map(c => graph.nodes.find(n => n.id === c.to_node_id))
        .filter(n => n !== undefined);

      // Execute next nodes
      for (const nextNode of nextNodes) {
        await this.executeNode(nextNode, graph, workflowState);
      }

      return result;

    } catch (error) {
      console.error(`❌ Node execution failed: ${nodeType} (${nodeId})`, error);
      workflowState.logs.push({
        timestamp: new Date().toISOString(),
        nodeId,
        nodeType,
        level: 'error',
        message: error.message
      });
      throw error;
    }
  }

  /**
   * Build execution graph from nodes and connections
   */
  buildExecutionGraph(nodes, connections) {
    return {
      nodes,
      connections,
      nodeMap: new Map(nodes.map(n => [n.id, n]))
    };
  }

  // ==================== TRIGGER HANDLERS ====================

  async scheduleTrigger(config, data, state) {
    // Schedule triggers are handled by the scheduler service
    // This just passes the data through
    state.logs.push({ message: 'Schedule trigger activated', timestamp: new Date().toISOString() });
    return { data };
  }

  async webhookTrigger(config, data, state) {
    state.logs.push({ message: 'Webhook trigger activated', timestamp: new Date().toISOString() });
    return { data };
  }

  async eventTrigger(config, data, state) {
    state.logs.push({ 
      message: `Event trigger activated: ${config.eventType}`, 
      timestamp: new Date().toISOString() 
    });
    return { data };
  }

  async manualTrigger(config, data, state) {
    state.logs.push({ message: 'Manual trigger activated', timestamp: new Date().toISOString() });
    return { data };
  }

  // ==================== ACTION EXECUTORS ====================

  async inventoryUpdateAction(config, data, state) {
    const { productId, quantity, operation } = config;
    
    return new Promise((resolve, reject) => {
      const transactionType = operation === 'add' ? 'IN' : operation === 'remove' ? 'OUT' : 'ADJUSTMENT';
      
      this.db.run(
        'UPDATE products SET quantity_in_stock = quantity_in_stock + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [operation === 'remove' ? -quantity : quantity, productId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            // Log transaction
            this.db.run(
              'INSERT INTO inventory_transactions (product_id, transaction_type, quantity, notes) VALUES (?, ?, ?, ?)',
              [productId, transactionType, Math.abs(quantity), config.notes || 'Automated workflow'],
              (err) => {
                if (err) console.error('Failed to log transaction:', err);
              }
            );
            
            state.logs.push({ 
              message: `Updated inventory for product ${productId}: ${operation} ${quantity}`,
              timestamp: new Date().toISOString()
            });
            
            resolve({ 
              data: { ...data, inventoryUpdated: true, productId, quantity }
            });
          }
        }
      );
    });
  }

  async sendSMSAction(config, data, state) {
    // Integrate with SMS service (Africa's Talking, Twilio, etc.)
    const { phoneNumber, message } = config;
    
    console.log(`📱 Sending SMS to ${phoneNumber}: ${message}`);
    
    // TODO: Implement actual SMS sending
    state.logs.push({ 
      message: `SMS sent to ${phoneNumber}`,
      timestamp: new Date().toISOString()
    });
    
    return { data: { ...data, smsSent: true } };
  }

  async sendEmailAction(config, data, state) {
    const { to, subject, body } = config;
    
    console.log(`📧 Sending email to ${to}: ${subject}`);
    
    // TODO: Implement actual email sending
    state.logs.push({ 
      message: `Email sent to ${to}`,
      timestamp: new Date().toISOString()
    });
    
    return { data: { ...data, emailSent: true } };
  }

  async sendNotificationAction(config, data, state) {
    const { title, body, userId } = config;
    
    console.log(`🔔 Sending notification to user ${userId}: ${title}`);
    
    // TODO: Integrate with Firebase Cloud Messaging
    state.logs.push({ 
      message: `Notification sent to user ${userId}`,
      timestamp: new Date().toISOString()
    });
    
    return { data: { ...data, notificationSent: true } };
  }

  async databaseQueryAction(config, data, state) {
    const { query, params } = config;
    
    return new Promise((resolve, reject) => {
      this.db.all(query, params || [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          state.logs.push({ 
            message: `Database query executed: ${rows.length} rows`,
            timestamp: new Date().toISOString()
          });
          resolve({ data: { ...data, queryResult: rows } });
        }
      });
    });
  }

  async httpRequestAction(config, data, state) {
    const { method, url, headers, body } = config;
    
    const fetch = require('node-fetch');
    
    try {
      const response = await fetch(url, {
        method: method || 'GET',
        headers: headers || {},
        body: body ? JSON.stringify(body) : undefined
      });
      
      const responseData = await response.json();
      
      state.logs.push({ 
        message: `HTTP ${method} to ${url}: ${response.status}`,
        timestamp: new Date().toISOString()
      });
      
      return { data: { ...data, httpResponse: responseData } };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  }

  async generateReportAction(config, data, state) {
    const { reportType, format } = config;
    
    console.log(`📊 Generating ${format} report: ${reportType}`);
    
    // TODO: Implement report generation
    state.logs.push({ 
      message: `Report generated: ${reportType}`,
      timestamp: new Date().toISOString()
    });
    
    return { data: { ...data, reportGenerated: true } };
  }

  async updateProductAction(config, data, state) {
    const { productId, updates } = config;
    
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), productId];
    
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE products SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        values,
        function(err) {
          if (err) {
            reject(err);
          } else {
            state.logs.push({ 
              message: `Product ${productId} updated`,
              timestamp: new Date().toISOString()
            });
            resolve({ data: { ...data, productUpdated: true } });
          }
        }
      );
    });
  }

  async createOrderAction(config, data, state) {
    const { items, customerId } = config;
    
    console.log(`🛒 Creating order for customer ${customerId}`);
    
    // TODO: Implement order creation
    state.logs.push({ 
      message: `Order created for customer ${customerId}`,
      timestamp: new Date().toISOString()
    });
    
    return { data: { ...data, orderCreated: true } };
  }

  async delayAction(config, data, state) {
    const { duration } = config; // in milliseconds
    
    await new Promise(resolve => setTimeout(resolve, duration));
    
    state.logs.push({ 
      message: `Delayed execution by ${duration}ms`,
      timestamp: new Date().toISOString()
    });
    
    return { data };
  }

  // ==================== CONDITION NODES ====================

  async conditionNode(config, data, state) {
    const { condition, trueNodeId, falseNodeId } = config;
    
    // Evaluate condition
    const result = this.evaluateCondition(condition, data);
    
    state.logs.push({ 
      message: `Condition evaluated: ${result}`,
      timestamp: new Date().toISOString()
    });
    
    return { 
      data,
      nextNodeId: result ? trueNodeId : falseNodeId
    };
  }

  async switchNode(config, data, state) {
    const { field, cases, defaultNodeId } = config;
    
    const value = this.getValueFromData(field, data);
    const matchingCase = cases.find(c => c.value === value);
    
    state.logs.push({ 
      message: `Switch on ${field}: ${value}`,
      timestamp: new Date().toISOString()
    });
    
    return {
      data,
      nextNodeId: matchingCase ? matchingCase.nodeId : defaultNodeId
    };
  }

  async filterNode(config, data, state) {
    const { condition } = config;
    
    if (!Array.isArray(data.items)) {
      throw new Error('Filter node requires data.items to be an array');
    }
    
    const filtered = data.items.filter(item => 
      this.evaluateCondition(condition, item)
    );
    
    state.logs.push({ 
      message: `Filtered ${data.items.length} items to ${filtered.length}`,
      timestamp: new Date().toISOString()
    });
    
    return { data: { ...data, items: filtered } };
  }

  // ==================== DATA TRANSFORMATION NODES ====================

  async transformNode(config, data, state) {
    const { transformations } = config;
    
    const transformed = { ...data };
    
    for (const [outputField, inputField] of Object.entries(transformations)) {
      transformed[outputField] = this.getValueFromData(inputField, data);
    }
    
    state.logs.push({ 
      message: 'Data transformed',
      timestamp: new Date().toISOString()
    });
    
    return { data: transformed };
  }

  async mergeNode(config, data, state) {
    // Merge data from multiple sources
    const { sources } = config;
    
    const merged = { ...data };
    
    for (const source of sources) {
      Object.assign(merged, source);
    }
    
    return { data: merged };
  }

  async splitNode(config, data, state) {
    // Split array into individual executions
    const { arrayField } = config;
    
    const items = this.getValueFromData(arrayField, data);
    
    if (!Array.isArray(items)) {
      throw new Error('Split node requires an array field');
    }
    
    state.logs.push({ 
      message: `Split ${items.length} items`,
      timestamp: new Date().toISOString()
    });
    
    // Execute next nodes for each item
    return { data: { ...data, splitItems: items } };
  }

  // ==================== HELPER METHODS ====================

  evaluateCondition(condition, data) {
    const { field, operator, value } = condition;
    const fieldValue = this.getValueFromData(field, data);
    
    switch (operator) {
      case 'equals':
        return fieldValue == value;
      case 'not_equals':
        return fieldValue != value;
      case 'greater_than':
        return fieldValue > value;
      case 'less_than':
        return fieldValue < value;
      case 'greater_or_equal':
        return fieldValue >= value;
      case 'less_or_equal':
        return fieldValue <= value;
      case 'contains':
        return String(fieldValue).includes(value);
      case 'not_contains':
        return !String(fieldValue).includes(value);
      case 'starts_with':
        return String(fieldValue).startsWith(value);
      case 'ends_with':
        return String(fieldValue).endsWith(value);
      case 'is_empty':
        return !fieldValue || fieldValue === '';
      case 'is_not_empty':
        return fieldValue && fieldValue !== '';
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  getValueFromData(path, data) {
    const parts = path.split('.');
    let value = data;
    
    for (const part of parts) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[part];
    }
    
    return value;
  }

  generateExecutionId() {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ==================== DATABASE METHODS ====================

  async getWorkflow(workflowId) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM workflows WHERE id = ?', [workflowId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async getWorkflowNodes(workflowId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM workflow_nodes WHERE workflow_id = ? ORDER BY position_y, position_x',
        [workflowId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async getWorkflowConnections(workflowId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM workflow_connections WHERE workflow_id = ?',
        [workflowId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async createExecution(executionId, workflowId, status) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO workflow_executions (id, workflow_id, status, started_at) VALUES (?, ?, ?, ?)',
        [executionId, workflowId, status, new Date().toISOString()],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  async updateExecution(executionId, status, logs, errorMessage = null) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE workflow_executions SET status = ?, completed_at = ?, logs = ?, error_message = ? WHERE id = ?',
        [status, new Date().toISOString(), JSON.stringify(logs), errorMessage, executionId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }
}

module.exports = WorkflowEngine;



