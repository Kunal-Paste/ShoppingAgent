const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const { ChatGroq } = require("@langchain/groq");
const { ToolMessage } = require("@langchain/core/messages");
const tools = require("./tools");

const model = new ChatGroq({
  apiKey: process.env.GROQ_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0, // Lower temperature is better for tool calling accuracy
});

const graph = new StateGraph(MessagesAnnotation)
  .addNode("chat", async (state) => {
    // Bind tools to the model so it knows how to use them
    const modelWithTools = model.bindTools([tools.searchProduct, tools.addProductToCart]);
    const response = await modelWithTools.invoke(state.messages);
    return { messages: [response] }; // Return the new message to be merged
  })
  .addNode("tools", async (state, config) => {
    const lastMessage = state.messages[state.messages.length - 1];
    const toolMessages = [];

    // Process all tool calls requested by the LLM
    for (const call of (lastMessage.tool_calls ?? [])) {
      const tool = tools[call.name];
      if (!tool) throw new Error(`Tool ${call.name} not found`);

      try {
        console.log("Invoking tool:", call.name, call.args);
        const result = await tool.invoke({
          ...call.args,
          token: config.metadata.token,
        });

        toolMessages.push(new ToolMessage({
          content: result,
          tool_call_id: call.id,
        }));
      } catch (err) {
        // Return error to the LLM so it can try to fix the input (e.g., wrong ID format)
        toolMessages.push(new ToolMessage({
          content: `Error: ${err.response?.data?.message || err.message}`,
          tool_call_id: call.id,
        }));
      }
    }
    return { messages: toolMessages };
  })
  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.tool_calls?.length > 0) return "tools";
    return "__end__";
  })
  .addEdge("tools", "chat");

const agent = graph.compile();

// Helper to extract text for socket.js
const getLastAIText = (messages) => {
  const last = messages[messages.length - 1];
  return last?.content || "";
};

module.exports = { agent, getLastAIText };