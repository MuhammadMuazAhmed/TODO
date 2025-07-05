import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI with your API key
const apiKey =
  import.meta.env.VITE_GEMINI_API_KEY ||
  "";

const genAI = new GoogleGenerativeAI(apiKey);

// Try to get the best available model
let model;
try {
  // Use Gemini 2.5 Pro - try the most likely model name
  model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
} catch (error) {
  try {
    // Try alternative Gemini 2.5 Pro model name
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  } catch (error2) {
    try {
      // Try gemini-2.0-pro (another possible name)
      model = genAI.getGenerativeModel({ model: "gemini-2.0-pro" });
    } catch (error3) {
      try {
        // Fallback to gemini-1.5-flash
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      } catch (fallbackError) {
        try {
          // Last resort - try gemini-pro
          model = genAI.getGenerativeModel({ model: "gemini-pro" });
        } catch (finalError) {
          // Silent fail in production
          model = null;
        }
      }
    }
  }
}

export class GeminiAIService {
  // Test function to verify AI is working
  static async testAI() {
    try {
      if (!model) {
        return "Mock AI response - model not available";
      }

      const result = await model.generateContent("Say 'Hello, AI is working!'");
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      return "Mock AI response - test failed";
    }
  }

  // Mock AI response for when real AI is not available
  static getMockTaskAnalysis(task, taskCategory) {
    const mockResponses = {
      work: `🎯 Smart move! That ${task.toLowerCase()} is about to meet its match!`,
      health: `💪 Beast mode planning! Your ${task.toLowerCase()} is going to be epic!`,
      learning: `🧠 Brain gains incoming! This ${task.toLowerCase()} will level you up!`,
      personal: `✨ Magic in the making! Your ${task.toLowerCase()} is going to be legendary!`,
      financial: `💰 Money moves ahead! This ${task.toLowerCase()} is securing your future!`,
      general: `⚡ Power move! Your ${task.toLowerCase()} is going to be your secret weapon!`,
    };

    return mockResponses[taskCategory] || mockResponses.general;
  }

  // Mock completion messages
  static getMockCompletionMessage(task, taskCategory) {
    const mockResponses = {
      work: `🚀 Boom! That ${task.toLowerCase()} just got obliterated by your productivity!`,
      health: `💪 Beast mode activated! Your ${task.toLowerCase()} is building a stronger you!`,
      learning: `🧠 Brain gains! That ${task.toLowerCase()} just leveled up your knowledge!`,
      personal: `✨ Magic happens when you tackle ${task.toLowerCase()} like a boss!`,
      financial: `💰 Money moves! Your ${task.toLowerCase()} is securing the bag!`,
      general: `🎯 Bullseye! That ${task.toLowerCase()} didn't know what hit it!`,
    };

    return mockResponses[taskCategory] || mockResponses.general;
  }

  // Generate todo suggestions based on user's current todos and goals
  static async generateTodoSuggestions(currentTodos, currentGoals, viewType) {
    try {
      const prompt = `
        As an AI productivity assistant, analyze the user's current situation and provide helpful todo suggestions.
        
        Current ${viewType} todos: ${JSON.stringify(currentTodos)}
        Current goals: ${JSON.stringify(currentGoals)}
        
        Please provide 3-5 specific, actionable todo suggestions that would help the user be more productive and achieve their goals. 
        Focus on ${viewType} tasks that are realistic and achievable.
        
        Format your response as a JSON array with objects containing:
        - title: A clear, concise todo title
        - description: A brief explanation of why this todo is helpful
        - priority: "high", "medium", or "low"
        - category: "work", "personal", "health", "learning", or "other"
        
        Example format:
        [
          {
            "title": "Review weekly goals and adjust priorities",
            "description": "This will help you stay focused on what matters most",
            "priority": "high",
            "category": "personal"
          }
        ]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Try to parse the JSON response
      try {
        const suggestions = JSON.parse(text);
        return suggestions;
      } catch (parseError) {
        // If JSON parsing fails, return a fallback suggestion
        return [
          {
            title: "Review and organize your current tasks",
            description:
              "Take time to prioritize and organize your existing todos",
            priority: "high",
            category: "personal",
          },
        ];
      }
    } catch (error) {
      return [];
    }
  }

  // Generate goal recommendations based on user's current situation
  static async generateGoalRecommendations(
    currentTodos,
    currentGoals,
    goalType
  ) {
    try {
      const prompt = `
        As an AI goal-setting assistant, analyze the user's current situation and provide helpful goal recommendations.
        
        Current todos: ${JSON.stringify(currentTodos)}
        Current ${goalType} goals: ${JSON.stringify(currentGoals)}
        
        Please provide 2-3 specific, achievable ${goalType} goal recommendations that would complement the user's current activities and help them grow.
        
        Format your response as a JSON array with objects containing:
        - title: A clear, concise goal title
        - description: A detailed explanation of the goal and its benefits
        - timeframe: "1-2 weeks" for short-term or "3-6 months" for long-term
        - category: "career", "personal", "health", "learning", "financial", or "other"
        
        Example format:
        [
          {
            "title": "Complete online course in productivity",
            "description": "Invest in learning new productivity techniques to improve your daily workflow",
            "timeframe": "1-2 weeks",
            "category": "learning"
          }
        ]
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const recommendations = JSON.parse(text);
        return recommendations;
      } catch (parseError) {
        return [
          {
            title: "Improve daily productivity routine",
            description:
              "Focus on building better habits and routines for daily success",
            timeframe: goalType === "shortterm" ? "1-2 weeks" : "3-6 months",
            category: "personal",
          },
        ];
      }
    } catch (error) {
      return [];
    }
  }

  // Get productivity insights and tips
  static async getProductivityInsights(currentTodos, currentGoals) {
    try {
      const prompt = `
        As an AI productivity coach, analyze the user's current todos and goals to provide personalized productivity insights and tips.
        
        Current todos: ${JSON.stringify(currentTodos)}
        Current goals: ${JSON.stringify(currentGoals)}
        
        Please provide 2-3 personalized productivity insights and actionable tips based on their current situation.
        
        Format your response as a JSON object with:
        - insights: Array of 2-3 insights about their current productivity patterns
        - tips: Array of 2-3 actionable tips to improve productivity
        - motivation: A motivational message to encourage them
        
        Example format:
        {
          "insights": ["You have a good mix of short and long-term goals", "Your todos are well-organized by priority"],
          "tips": ["Try time-blocking for your high-priority tasks", "Review your goals weekly to stay on track"],
          "motivation": "You're making great progress! Keep focusing on what matters most."
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const insights = JSON.parse(text);
        return insights;
      } catch (parseError) {
        return {
          insights: ["You're doing great with your task management!"],
          tips: [
            "Try breaking down large tasks into smaller, manageable steps",
          ],
          motivation:
            "Keep up the excellent work on your productivity journey!",
        };
      }
    } catch (error) {
      return {
        insights: ["Focus on one task at a time for better results"],
        tips: ["Prioritize your most important tasks first"],
        motivation: "Every small step counts towards your bigger goals!",
      };
    }
  }

  // Chat with AI assistant
  static async chatWithAI(message, context = {}) {
    try {
      const prompt = `
        You are an AI productivity assistant for a todo and goal management app. 
        The user is asking: "${message}"
        
        Context about their current situation:
        - Current todos: ${JSON.stringify(context.todos || [])}
        - Current goals: ${JSON.stringify(context.goals || [])}
        
        Please provide a helpful, encouraging, and actionable response. 
        Keep your response concise but informative. Focus on productivity, goal achievement, and positive motivation.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      return "I'm here to help you stay productive and achieve your goals! How can I assist you today?";
    }
  }

  // Generate completion celebration message
  static async generateCompletionMessage(
    task,
    taskType = "todo",
    context = {}
  ) {
    try {
      // Categorize the completed task
      const taskCategory = this.categorizeTask(task);

      const prompt = `
        You are a witty, encouraging friend celebrating someone's achievement. Be creative, unique, and genuinely excited!
        
        The user just completed: "${task}"
        Task category: ${taskCategory}
        
        Generate a SHORT, CREATIVE celebration message (1-2 sentences max) that's:
        - SPECIFIC to this exact task (not generic)
        - WITTY and fun (not boring AI-like)
        - CONTEXTUALLY relevant to what they actually did
        - PERSONALIZED to the task category
        - ENTHUSIASTIC and genuine
        
        Rules:
        - Keep it VERY SHORT (max 2 short sentences)
        - No completion percentages or statistics
        - Be creative with emojis and language
        - Reference the specific task content
        - Sound like a real friend, not a robot
        - No explanations or extra text
        
        Examples of CREATIVE celebrations:
        - "🚀 Boom! That ${task.toLowerCase()} didn't stand a chance against you!"
        - "🎯 Nailed it! Your future self is already thanking you for this ${task.toLowerCase()}."
        - "⚡ Lightning strike! That ${task.toLowerCase()} is officially conquered!"
        - "🎪 The circus has nothing on your ${task.toLowerCase()} skills!"
        
        Generate a creative celebration for: "${task}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.cleanAIResponse(text);
    } catch (error) {
      // Use mock completion message when AI fails
      const taskCategory = this.categorizeTask(task);
      return this.getMockCompletionMessage(task, taskCategory);
    }
  }

  // Categorize task based on content
  static categorizeTask(task) {
    const taskLower = task.toLowerCase();

    // Work/Professional tasks
    if (
      taskLower.includes("meeting") ||
      taskLower.includes("presentation") ||
      taskLower.includes("report") ||
      taskLower.includes("project") ||
      taskLower.includes("email") ||
      taskLower.includes("call") ||
      taskLower.includes("deadline") ||
      taskLower.includes("client") ||
      taskLower.includes("work") ||
      taskLower.includes("office") ||
      taskLower.includes("business") ||
      taskLower.includes("proposal") ||
      taskLower.includes("review") ||
      taskLower.includes("analysis") ||
      taskLower.includes("document") ||
      taskLower.includes("submit") ||
      taskLower.includes("prepare") ||
      taskLower.includes("schedule") ||
      taskLower.includes("interview")
    ) {
      return "work";
    }

    // Health/Fitness tasks
    if (
      taskLower.includes("workout") ||
      taskLower.includes("gym") ||
      taskLower.includes("exercise") ||
      taskLower.includes("run") ||
      taskLower.includes("walk") ||
      taskLower.includes("yoga") ||
      taskLower.includes("meditation") ||
      taskLower.includes("sleep") ||
      taskLower.includes("fitness") ||
      taskLower.includes("training") ||
      taskLower.includes("cardio") ||
      taskLower.includes("strength") ||
      taskLower.includes("stretch") ||
      taskLower.includes("diet") ||
      taskLower.includes("nutrition") ||
      taskLower.includes("doctor") ||
      taskLower.includes("appointment") ||
      taskLower.includes("health") ||
      taskLower.includes("wellness")
    ) {
      return "health";
    }

    // Learning/Education tasks
    if (
      taskLower.includes("read") ||
      taskLower.includes("study") ||
      taskLower.includes("learn") ||
      taskLower.includes("course") ||
      taskLower.includes("chapter") ||
      taskLower.includes("book") ||
      taskLower.includes("tutorial") ||
      taskLower.includes("practice") ||
      taskLower.includes("education") ||
      taskLower.includes("class") ||
      taskLower.includes("lesson") ||
      taskLower.includes("research") ||
      taskLower.includes("skill") ||
      taskLower.includes("knowledge") ||
      taskLower.includes("training") ||
      taskLower.includes("workshop") ||
      taskLower.includes("seminar") ||
      taskLower.includes("lecture") ||
      taskLower.includes("assignment") ||
      taskLower.includes("homework")
    ) {
      return "learning";
    }

    // Personal/Home tasks
    if (
      taskLower.includes("clean") ||
      taskLower.includes("cook") ||
      taskLower.includes("laundry") ||
      taskLower.includes("shopping") ||
      taskLower.includes("organize") ||
      taskLower.includes("home") ||
      taskLower.includes("family") ||
      taskLower.includes("friend") ||
      taskLower.includes("house") ||
      taskLower.includes("room") ||
      taskLower.includes("kitchen") ||
      taskLower.includes("bathroom") ||
      taskLower.includes("garden") ||
      taskLower.includes("decorate") ||
      taskLower.includes("repair") ||
      taskLower.includes("maintenance") ||
      taskLower.includes("visit") ||
      taskLower.includes("party") ||
      taskLower.includes("celebration") ||
      taskLower.includes("dinner") ||
      taskLower.includes("lunch") ||
      taskLower.includes("breakfast")
    ) {
      return "personal";
    }

    // Financial tasks
    if (
      taskLower.includes("budget") ||
      taskLower.includes("bill") ||
      taskLower.includes("payment") ||
      taskLower.includes("expense") ||
      taskLower.includes("save") ||
      taskLower.includes("invest") ||
      taskLower.includes("money") ||
      taskLower.includes("finance") ||
      taskLower.includes("bank") ||
      taskLower.includes("account") ||
      taskLower.includes("tax") ||
      taskLower.includes("insurance") ||
      taskLower.includes("loan") ||
      taskLower.includes("credit") ||
      taskLower.includes("debit") ||
      taskLower.includes("cash") ||
      taskLower.includes("salary") ||
      taskLower.includes("income") ||
      taskLower.includes("expense") ||
      taskLower.includes("purchase") ||
      taskLower.includes("buy")
    ) {
      return "financial";
    }

    return "general";
  }

  // Sanitize AI response to prevent XSS
  static sanitizeResponse(text) {
    if (typeof text !== "string") return "";
    return text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  // Clean AI response and make it safe for display
  static cleanAIResponse(response) {
    let cleaned = response.trim();

    // Remove common explanatory prefixes
    const prefixesToRemove = [
      "Okay, here's a personalized appreciation message for the task",
      "Here's a personalized appreciation message for the task",
      "Here's an appreciation message for the task",
      "Here's a message for the task",
      "Here's the appreciation message:",
      "Here's the message:",
      "The appreciation message is:",
      "The message is:",
      "Appreciation message:",
      "Message:",
      "Response:",
      "Here's what I think:",
      "Here's my response:",
    ];

    prefixesToRemove.forEach((prefix) => {
      if (cleaned.toLowerCase().includes(prefix.toLowerCase())) {
        cleaned = cleaned.replace(new RegExp(prefix, "gi"), "").trim();
      }
    });

    // Remove quotes if the message is wrapped in them
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("'") && cleaned.endsWith("'"))
    ) {
      cleaned = cleaned.slice(1, -1).trim();
    }

    // Remove any remaining explanatory text after the main message
    const lines = cleaned.split("\n");
    if (lines.length > 1) {
      // Take only the first meaningful line
      cleaned = lines[0].trim();
    }

    // Limit to maximum 2 sentences and keep it short
    const sentences = cleaned
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    if (sentences.length > 2) {
      cleaned = sentences.slice(0, 2).join(". ") + ".";
    }

    // If still too long, truncate to reasonable length
    if (cleaned.length > 120) {
      cleaned = cleaned.substring(0, 120).trim();
      if (
        !cleaned.endsWith(".") &&
        !cleaned.endsWith("!") &&
        !cleaned.endsWith("?")
      ) {
        cleaned += "...";
      }
    }

    return this.sanitizeResponse(cleaned);
  }

  // Generate new task analysis and motivation
  static async generateTaskAnalysis(task, taskType = "todo", context = {}) {
    try {
      // Categorize the task
      const taskCategory = this.categorizeTask(task);
      const timeContext = context.activeView || context.activeGoal || "general";

      // Count similar tasks for context
      const similarTasks =
        context.currentTodos?.filter(
          (t) => this.categorizeTask(t.todo) === taskCategory
        ).length || 0;

      // If no model is available, use mock response
      if (!model) {
        return this.getMockTaskAnalysis(task, taskCategory);
      }

      const prompt = `
        You are a witty, encouraging friend who's excited about someone's new task. Be creative and genuine!
        
        The user just added this task: "${task}"
        Task category: ${taskCategory}
        
        Generate a SHORT, CREATIVE acknowledgment message (1-2 sentences max) that's:
        - SPECIFIC to this exact task (not generic)
        - WITTY and fun (not boring AI-like)
        - CONTEXTUALLY relevant to what they're planning to do
        - ENTHUSIASTIC and genuine
        - PERSONALIZED to the task category
        
        Rules:
        - Keep it VERY SHORT (max 2 short sentences)
        - Be creative with emojis and language
        - Reference the specific task content
        - Sound like a real friend, not a robot
        - No explanations or extra text
        
        Examples of CREATIVE acknowledgments:
        - "🎯 Smart move! That ${task.toLowerCase()} is about to meet its match!"
        - "🚀 Adding ${task.toLowerCase()} to your arsenal? Love the strategy!"
        - "💡 Genius! This ${task.toLowerCase()} is going to be your secret weapon!"
        - "⚡ Power move! Your future self is already celebrating this ${task.toLowerCase()}!"
        
        Generate a creative acknowledgment for: "${task}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      return this.cleanAIResponse(analysisText);
    } catch (error) {
      // Use mock response when AI fails
      const taskCategory = this.categorizeTask(task);
      return this.getMockTaskAnalysis(task, taskCategory);
    }
  }

  // Generate daily tasks for a specific goal
  static async generateDailyTasksForGoal(goal, goalType = "shortterm") {
    try {
      if (!model) {
        return this.getMockDailyTasks(goal);
      }

      const prompt = `
        You are a productivity coach helping someone break down a goal into daily actionable tasks.
        
        Goal: "${goal}"
        Goal Type: ${
          goalType === "shortterm"
            ? "Short-term (1-2 weeks)"
            : "Long-term (3-6 months)"
        }
        
        Generate 3-5 specific, daily actionable tasks that will help achieve this goal.
        Each task should be:
        - Specific and measurable
        - Achievable in one day
        - Directly related to the goal
        - Realistic and practical
        
        Format your response as a JSON array with objects containing:
        - title: A clear, concise task title
        - description: Brief explanation of how this helps achieve the goal
        - estimatedTime: "5-15 min", "15-30 min", "30-60 min", or "60+ min"
        - priority: "high", "medium", or "low"
        
        Example format:
        [
          {
            "title": "Research 3 online courses for skill development",
            "description": "Finding the right learning resources is the first step to building new skills",
            "estimatedTime": "15-30 min",
            "priority": "high"
          }
        ]
        
        Generate daily tasks for: "${goal}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const dailyTasks = JSON.parse(text);
        return dailyTasks;
      } catch (parseError) {
        return this.getMockDailyTasks(goal);
      }
    } catch (error) {
      return this.getMockDailyTasks(goal);
    }
  }

  // Generate progress questions for when user visits
  static async generateProgressQuestions(currentGoals, currentTodos) {
    try {
      if (!model) {
        throw new Error("AI model not available");
      }

      const prompt = `
        You are a supportive productivity coach checking in on someone's progress.
        
        Current Goals: ${JSON.stringify(currentGoals)}
        Recent Todos: ${JSON.stringify(currentTodos?.slice(-5) || [])}
        
        Generate 2-3 thoughtful, specific progress questions that will help the user reflect on their achievements and stay motivated.
        
        The questions should be:
        - SPECIFIC to their current goals and activities
        - ENCOURAGING and positive
        - ACTIONABLE for self-reflection
        - CONTEXTUALLY relevant to their situation
        
        Focus on questions that help them:
        1. Celebrate specific achievements related to their goals
        2. Reflect on their current momentum toward their specific goals
        3. Plan their next steps for their actual goals
        4. Identify what's working well for their goal progress
        
        IMPORTANT: Make the questions specific to their actual goals. For example:
        - If they have a "Learn React" goal, ask about their learning progress
        - If they have a "Lose 10 pounds" goal, ask about their health journey
        - If they have a "Save $5000" goal, ask about their financial progress
        
        Format your response as a JSON array with objects containing:
        - question: The actual question text (be specific and contextual to their goals)
        - category: "celebration", "reflection", "planning", or "motivation"
        - context: Brief explanation of why this question is relevant to their goals
        
        Example format:
        [
          {
            "question": "How has your progress on [specific goal] been this week?",
            "category": "reflection",
            "context": "Understanding progress on your specific goal helps with planning next steps"
          }
        ]
        
        Generate specific, contextual progress questions based on their actual goals and activities.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const questions = JSON.parse(text);

        // Validate that we got proper questions
        if (Array.isArray(questions) && questions.length > 0) {
          return questions;
        } else {
          throw new Error("AI returned invalid question format");
        }
      } catch (parseError) {
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      throw error; // Re-throw instead of returning mock questions
    }
  }

  // Mock daily tasks for goals
  static getMockDailyTasks(goal) {
    const goalLower = goal.toLowerCase();

    // Different mock tasks based on goal keywords
    if (
      goalLower.includes("learn") ||
      goalLower.includes("study") ||
      goalLower.includes("course")
    ) {
      return [
        {
          title: "Spend 30 minutes on the learning material",
          description:
            "Consistent daily practice is key to mastering new skills",
          estimatedTime: "30-60 min",
          priority: "high",
        },
        {
          title: "Review yesterday's notes and key takeaways",
          description: "Reinforcing previous learning helps retention",
          estimatedTime: "15-30 min",
          priority: "medium",
        },
        {
          title: "Practice one new concept or skill",
          description: "Hands-on practice solidifies understanding",
          estimatedTime: "15-30 min",
          priority: "high",
        },
      ];
    } else if (
      goalLower.includes("health") ||
      goalLower.includes("fitness") ||
      goalLower.includes("workout")
    ) {
      return [
        {
          title: "Complete today's workout routine",
          description: "Consistent exercise builds strength and habits",
          estimatedTime: "30-60 min",
          priority: "high",
        },
        {
          title: "Track your nutrition and water intake",
          description: "Monitoring helps maintain healthy habits",
          estimatedTime: "5-15 min",
          priority: "medium",
        },
        {
          title: "Stretch and do mobility exercises",
          description: "Recovery and flexibility are important for progress",
          estimatedTime: "15-30 min",
          priority: "medium",
        },
      ];
    } else if (
      goalLower.includes("save") ||
      goalLower.includes("budget") ||
      goalLower.includes("money")
    ) {
      return [
        {
          title: "Review today's spending and categorize expenses",
          description: "Tracking spending helps identify saving opportunities",
          estimatedTime: "5-15 min",
          priority: "high",
        },
        {
          title: "Transfer money to savings account",
          description: "Regular saving builds financial security",
          estimatedTime: "5-15 min",
          priority: "high",
        },
        {
          title: "Look for one way to reduce expenses today",
          description: "Small daily savings add up over time",
          estimatedTime: "15-30 min",
          priority: "medium",
        },
      ];
    } else {
      return [
        {
          title: "Break down the goal into smaller steps",
          description: "Making progress starts with clear action steps",
          estimatedTime: "15-30 min",
          priority: "high",
        },
        {
          title: "Research resources or tools to help achieve this goal",
          description: "Having the right tools makes progress easier",
          estimatedTime: "15-30 min",
          priority: "medium",
        },
        {
          title: "Set a specific milestone for this week",
          description: "Weekly milestones keep you on track",
          estimatedTime: "5-15 min",
          priority: "high",
        },
      ];
    }
  }
}

export default GeminiAIService;
