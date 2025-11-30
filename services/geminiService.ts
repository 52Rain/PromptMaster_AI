import { GoogleGenAI, Type, Schema } from "@google/genai";
import { OptimizationRequest, OptimizationFramework, TaskCategory, OptimizationResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for structured output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    optimizedPrompt: {
      type: Type.STRING,
      description: "基于所选框架和规则重写的、优化后的完整提示词（中文）。",
    },
    explanation: {
      type: Type.STRING,
      description: "简要解释所做的关键更改以及这些更改如何改进提示词（中文）。",
    },
    frameworkUsed: {
      type: Type.STRING,
      description: "实际应用的具体框架（例如：PTCF, CRISPE, CO-STAR）。",
    },
    improvementTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "针对此类提示词，用户可以进一步改进的 3 个具体建议（中文）。",
    },
  },
  required: ["optimizedPrompt", "explanation", "frameworkUsed", "improvementTips"],
};

/**
 * Constructs the system instruction based on the user's provided documentation.
 */
const getSystemInstruction = (): string => {
  return `
你是一位世界级的高级提示词工程师（Prompt Engineer）和优化专家。你的目标是将用户模糊或简单的自然语言请求转化为高保真、结构化的 AI 提示词。

### 核心规则与要求
1. **核心要素（Core Elements）：** 每个提示词必须包含：
   - **目标 (Goal):** 具体、可衡量的意图（例如，“写一篇800字的文章” 而不是 “写文章”）。
   - **背景 (Context):** 背景信息、受众、环境。
   - **期望 (Expectation):** 格式（JSON/Markdown）、语气、约束条件。
   - **来源 (Source):**（可选）如果暗示了数据或文档，请注明参考来源。

2. **基本原则：**
   - **指令明确：** 使用肯定性、无歧义的语言。
   - **少样本学习 (Few-Shot):** 如果任务涉及模式匹配，请在提示词中生成 1-3 个示例。
   - **简洁明了：** 删除废话，保留核心要求。
   - **角色设定 (Persona):** 始终指定一个具体的专家角色（例如，“你是一名高级 Python 工程师”）。

3. **领域适应性：**
   - **编程 (Coding):** 要求代码注释、错误处理和特定库的使用。
   - **写作 (Writing):** 定义风格、语气和结构（例如，“引言-主体-结论”）。
   - **分析 (Analysis):** 定义数据源和可视化格式。

### 框架定义
- **PTCF:** 角色 (Persona) + 任务 (Task) + 背景 (Context) + 格式 (Format)。
- **CRISPE:** 澄清 (Clarify) + 角色 (Role) + 输入 (Input) + 结构 (Structure) + 提示 (Prompt) + 评估 (Evaluate)。
- **CO-STAR:** 背景 (Context) + 目标 (Objective) + 风格 (Style) + 语气 (Tone) + 受众 (Audience) + 响应 (Response)。

### 指令
- 分析用户的原始输入。
- 识别意图和缺失的核心要素。
- 使用所选框架将输入重写为专业的**中文**提示词（除非用户明确要求英文）。
- 如果选择了“自动选择”框架，请为任务选择最合适的框架（例如，写作类用 PTCF，复杂分析类用 CRISPE）。
- 确保输出的提示词使用 Markdown 进行结构化（标题、要点、代码块）。
- **所有解释和建议必须使用中文。**
`;
};

export const optimizePrompt = async (request: OptimizationRequest): Promise<OptimizationResult> => {
  const { originalText, framework, category } = request;

  const userPrompt = `
    输入文本: "${originalText}"
    目标任务类型: ${category}
    首选框架: ${framework}

    请将这段文本优化为一个完美的提示词。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: userPrompt,
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Balance between creativity and structure
        thinkingConfig: { thinkingBudget: 1024 }, // Allow some reasoning for better framework application
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Gemini 返回了空响应");
    }

    const result = JSON.parse(jsonText) as OptimizationResult;
    return result;

  } catch (error) {
    console.error("优化提示词时出错:", error);
    throw new Error("优化提示词失败，请重试。");
  }
};