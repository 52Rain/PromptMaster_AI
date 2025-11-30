export enum OptimizationFramework {
  AUTO = '自动选择 (Automatic)',
  PTCF = 'PTCF (角色、任务、背景、格式)',
  CRISPE = 'CRISPE (背景、角色、意图、结构、提示、评估)',
  CO_STAR = 'CO-STAR (背景、目标、风格、语气、受众、响应)',
  SIMPLE = '基础版 (目标、背景、期望)'
}

export enum TaskCategory {
  GENERAL = '通用任务',
  WRITING = '内容创作',
  CODING = '编程开发',
  ANALYSIS = '数据分析',
  REASONING = '逻辑推理'
}

export interface OptimizationResult {
  optimizedPrompt: string;
  explanation: string;
  frameworkUsed: string;
  improvementTips: string[];
}

export interface OptimizationRequest {
  originalText: string;
  framework: OptimizationFramework;
  category: TaskCategory;
  iterations?: number;
}