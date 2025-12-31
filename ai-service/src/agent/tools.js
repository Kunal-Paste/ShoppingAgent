const {tool} = require('@langchain/core/tools');
const {z} = require('zod');
const axios = require('axios');

const searchProduct = tool(async ({query,token})=>{

    const response = await axios.get(`http://localhost:3001/api/products?q=${query}`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    })

    return JSON.stringify(response.data)

}, {
   
    name:'searchProduct',
    description:'search for product based on query',
    schema:z.object({
        query:z.string().describe("The search query for products")
    })

})


const addProductToCart = tool(async({productId,qty=1,token})=>{
    
    const response = await axios.post(`http://localhost:3002/api/cart/items`,{
      
        productId,
        qty

    },{
        headers:{
            Authorization:`Bearer ${token}`
        }
    })

    return `Added product with id ${productId} (qty: ${qty}) to cart`

},{
   
    name:'addProductToCart',
    description:'add a product to the shoppping cart',
    schema:z.object({
        productId:z.string().describe("MongoDB ObjectId of the product (24 hex characters)"),
        qty:z.number().describe("The quantity of the product to add to the cart").default(1)
    })

})

module.exports = {
    searchProduct,
    addProductToCart
}