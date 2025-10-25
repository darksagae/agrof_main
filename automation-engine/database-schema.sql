-- AGROF Workflow Automation Database Schema

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('schedule', 'webhook', 'event', 'manual')),
  trigger_config TEXT, -- JSON configuration for the trigger
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_run_at DATETIME,
  created_by TEXT DEFAULT 'system',
  tags TEXT -- JSON array of tags
);

-- Workflow nodes table
CREATE TABLE IF NOT EXISTS workflow_nodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workflow_id INTEGER NOT NULL,
  node_type TEXT NOT NULL, -- trigger, action, condition, transform, etc.
  node_config TEXT, -- JSON configuration for the node
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  is_trigger BOOLEAN DEFAULT FALSE,
  label TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE
);

-- Workflow connections table (edges between nodes)
CREATE TABLE IF NOT EXISTS workflow_connections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workflow_id INTEGER NOT NULL,
  from_node_id INTEGER NOT NULL,
  to_node_id INTEGER NOT NULL,
  label TEXT, -- Optional label for the connection (e.g., "true", "false" for conditions)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE,
  FOREIGN KEY (from_node_id) REFERENCES workflow_nodes (id) ON DELETE CASCADE,
  FOREIGN KEY (to_node_id) REFERENCES workflow_nodes (id) ON DELETE CASCADE
);

-- Workflow executions table
CREATE TABLE IF NOT EXISTS workflow_executions (
  id TEXT PRIMARY KEY, -- Custom execution ID
  workflow_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed', 'cancelled')),
  started_at DATETIME NOT NULL,
  completed_at DATETIME,
  logs TEXT, -- JSON array of log entries
  error_message TEXT,
  trigger_data TEXT, -- JSON data that triggered the workflow
  FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflows_active ON workflows(is_active);
CREATE INDEX IF NOT EXISTS idx_workflows_trigger_type ON workflows(trigger_type);
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_workflow ON workflow_nodes(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_connections_workflow ON workflow_connections(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started ON workflow_executions(started_at);

-- Workflow templates table (pre-built workflows)
CREATE TABLE IF NOT EXISTS workflow_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'inventory', 'marketing', 'operations', etc.
  icon TEXT,
  workflow_definition TEXT NOT NULL, -- JSON definition of nodes and connections
  is_popular BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Webhook endpoints table
CREATE TABLE IF NOT EXISTS workflow_webhooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workflow_id INTEGER NOT NULL,
  webhook_url TEXT UNIQUE NOT NULL,
  webhook_secret TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_triggered_at DATETIME,
  FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE
);

-- Event subscriptions table
CREATE TABLE IF NOT EXISTS workflow_event_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workflow_id INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- 'low_stock', 'new_order', 'product_updated', etc.
  event_filter TEXT, -- JSON filter conditions
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workflow_id) REFERENCES workflows (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_event_subscriptions_type ON workflow_event_subscriptions(event_type);
CREATE INDEX IF NOT EXISTS idx_event_subscriptions_active ON workflow_event_subscriptions(is_active);



