const {StateGraph, MessagesAnnotation} = require('@langchain/langgraph');
const {ChatGroq} = require("@langchain/groq");
const {ToolMessage, AIMessage, HumanMessage} = require('@langchain/core/messages');
const tools = require('./tools');


const model = new ChatGroq({
  apiKey: process.env.GROQ_KEY,
  model: "llama-3.1-8b-instant", // BEST quality
  // or "llama3-8b-8192" (faster)
  temperature: 0.5,
});


const graph = new StateGraph(MessagesAnnotation)
.addNode("tools", async(state,config)=>{
    
    const lastMessage = state.messages[state.messages.length-1];

    const toolCall = lastMessage.tool_calls

    const toolCallResults = await Promise.all(toolCall.map(async (call)=>{

        const tool = tools[call.name];

        if(!tool){
            throw new Error(`Tool ${call.name} not found`)
        }

        const toolInput = call.args

        console.log("Invoking tool:", call.name, "with input:", call)

        const toolResult = await tool.func({...toolInput, token:config.metadata.token})

        return new ToolMessage({content:toolResult, name:call.name})

    }))

    state.messages.push(...toolCallResults)

    return state

})
.addNode("chat", async(state,config)=>{
    
    const response = await model.invoke(state.messages, {tools: [tools.searchProduct, tools.addProductToCart]});

    state.messages.push(response);


    return state;

})
.addEdge("__start__","chat")
.addConditionalEdges("chat", async(state)=>{

    const lastMessage = state.messages[state.messages.length-1];

    if(lastMessage.tool_calls && lastMessage.tool_calls.length > 0){
        return "tools"
    } else {
        return "__end__"
    }

})
.addEdge("tools","chat")


const agent = graph.compile();

module.exports = agent;