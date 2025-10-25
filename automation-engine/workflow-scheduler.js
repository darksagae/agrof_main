/**
 * AGROF Workflow Scheduler
 * Handles scheduled workflow execution (cron-based triggers)
 */

const cron = require('node-cron');
const EventEmitter = require('events');

class WorkflowScheduler extends EventEmitter {
  constructor(database, workflowEngine) {
    super();
    this.db = database;
    this.workflowEngine = workflowEngine;
    this.scheduledJobs = new Map();
    this.isRunning = false;
  }

  /**
   * Start the scheduler
   */
  async start() {
    if (this.isRunning) {
      console.log('⚠️ Scheduler is already running');
      return;
    }

    console.log('🕐 Starting workflow scheduler...');
    this.isRunning = true;

    // Load all active workflows with schedule triggers
    await this.loadScheduledWorkflows();

    // Check for new workflows every minute
    this.refreshJob = cron.schedule('* * * * *', async () => {
      await this.refreshScheduledWorkflows();
    });

    console.log('✅ Workflow scheduler started');
  }

  /**
   * Stop the scheduler
   */
  stop() {
    console.log('🛑 Stopping workflow scheduler...');
    
    // Stop all scheduled jobs
    for (const [workflowId, job] of this.scheduledJobs.entries()) {
      job.stop();
      console.log(`Stopped schedule for workflow ${workflowId}`);
    }
    
    this.scheduledJobs.clear();

    if (this.refreshJob) {
      this.refreshJob.stop();
    }

    this.isRunning = false;
    console.log('✅ Workflow scheduler stopped');
  }

  /**
   * Load all scheduled workflows from database
   */
  async loadScheduledWorkflows() {
    try {
      const workflows = await this.getScheduledWorkflows();
      
      console.log(`📋 Found ${workflows.length} scheduled workflows`);

      for (const workflow of workflows) {
        await this.scheduleWorkflow(workflow);
      }
    } catch (error) {
      console.error('❌ Error loading scheduled workflows:', error);
    }
  }

  /**
   * Refresh scheduled workflows (check for updates)
   */
  async refreshScheduledWorkflows() {
    try {
      const workflows = await this.getScheduledWorkflows();
      
      // Check for new or updated workflows
      for (const workflow of workflows) {
        if (!this.scheduledJobs.has(workflow.id)) {
          await this.scheduleWorkflow(workflow);
        }
      }

      // Remove workflows that are no longer active
      for (const workflowId of this.scheduledJobs.keys()) {
        const stillActive = workflows.find(w => w.id === workflowId);
        if (!stillActive) {
          this.unscheduleWorkflow(workflowId);
        }
      }
    } catch (error) {
      console.error('❌ Error refreshing workflows:', error);
    }
  }

  /**
   * Schedule a single workflow
   */
  async scheduleWorkflow(workflow) {
    try {
      const config = typeof workflow.trigger_config === 'string'
        ? JSON.parse(workflow.trigger_config)
        : workflow.trigger_config;

      if (!config.schedule) {
        console.warn(`⚠️ Workflow ${workflow.id} has no schedule configuration`);
        return;
      }

      // Parse schedule (cron expression or predefined)
      const cronExpression = this.parseCronExpression(config.schedule);

      // Validate cron expression
      if (!cron.validate(cronExpression)) {
        console.error(`❌ Invalid cron expression for workflow ${workflow.id}: ${cronExpression}`);
        return;
      }

      // Create scheduled job
      const job = cron.schedule(cronExpression, async () => {
        console.log(`⏰ Executing scheduled workflow: ${workflow.name} (${workflow.id})`);
        
        try {
          await this.workflowEngine.executeWorkflow(workflow.id, {
            trigger: 'schedule',
            timestamp: new Date().toISOString(),
            schedule: config.schedule
          });

          // Update last run time
          await this.updateWorkflowLastRun(workflow.id);
          
          this.emit('workflow:scheduled_execution', { workflowId: workflow.id });
        } catch (error) {
          console.error(`❌ Scheduled workflow execution failed: ${workflow.id}`, error);
          this.emit('workflow:scheduled_error', { workflowId: workflow.id, error });
        }
      });

      this.scheduledJobs.set(workflow.id, job);
      console.log(`✅ Scheduled workflow: ${workflow.name} (${workflow.id}) - ${cronExpression}`);
    } catch (error) {
      console.error(`❌ Error scheduling workflow ${workflow.id}:`, error);
    }
  }

  /**
   * Unschedule a workflow
   */
  unscheduleWorkflow(workflowId) {
    const job = this.scheduledJobs.get(workflowId);
    if (job) {
      job.stop();
      this.scheduledJobs.delete(workflowId);
      console.log(`🗑️ Unscheduled workflow: ${workflowId}`);
    }
  }

  /**
   * Parse cron expression from schedule config
   */
  parseCronExpression(schedule) {
    // Handle predefined schedules
    const predefined = {
      'every_minute': '* * * * *',
      'every_5_minutes': '*/5 * * * *',
      'every_15_minutes': '*/15 * * * *',
      'every_30_minutes': '*/30 * * * *',
      'hourly': '0 * * * *',
      'daily': '0 0 * * *',
      'daily_6am': '0 6 * * *',
      'daily_9am': '0 9 * * *',
      'daily_noon': '0 12 * * *',
      'daily_6pm': '0 18 * * *',
      'weekly': '0 0 * * 0',
      'weekly_monday': '0 0 * * 1',
      'monthly': '0 0 1 * *',
      'end_of_month': '0 0 L * *'
    };

    // Check if it's a predefined schedule
    if (predefined[schedule]) {
      return predefined[schedule];
    }

    // Check if it's already a cron expression
    if (typeof schedule === 'string' && schedule.includes(' ')) {
      return schedule;
    }

    // Parse custom schedule format
    if (typeof schedule === 'object') {
      const { type, time, dayOfWeek, dayOfMonth } = schedule;

      switch (type) {
        case 'daily':
          const [hour, minute] = (time || '00:00').split(':');
          return `${minute} ${hour} * * *`;
        
        case 'weekly':
          const [wHour, wMinute] = (time || '00:00').split(':');
          return `${wMinute} ${wHour} * * ${dayOfWeek || 0}`;
        
        case 'monthly':
          const [mHour, mMinute] = (time || '00:00').split(':');
          return `${mMinute} ${mHour} ${dayOfMonth || 1} * *`;
        
        case 'hourly':
          return `${schedule.minute || 0} * * * *`;
        
        case 'interval':
          return `*/${schedule.minutes || 5} * * * *`;
        
        default:
          throw new Error(`Unknown schedule type: ${type}`);
      }
    }

    throw new Error(`Invalid schedule format: ${schedule}`);
  }

  /**
   * Get all scheduled workflows from database
   */
  async getScheduledWorkflows() {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM workflows 
         WHERE is_active = 1 
         AND trigger_type = 'schedule'`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  /**
   * Update workflow last run timestamp
   */
  async updateWorkflowLastRun(workflowId) {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE workflows SET last_run_at = ? WHERE id = ?',
        [new Date().toISOString(), workflowId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  /**
   * Manually trigger a scheduled workflow
   */
  async triggerWorkflow(workflowId) {
    console.log(`🔄 Manually triggering workflow: ${workflowId}`);
    
    try {
      await this.workflowEngine.executeWorkflow(workflowId, {
        trigger: 'manual',
        timestamp: new Date().toISOString()
      });
      
      return { success: true, message: 'Workflow triggered successfully' };
    } catch (error) {
      console.error(`❌ Failed to trigger workflow ${workflowId}:`, error);
      throw error;
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      scheduledWorkflows: this.scheduledJobs.size,
      workflows: Array.from(this.scheduledJobs.keys())
    };
  }
}

module.exports = WorkflowScheduler;



