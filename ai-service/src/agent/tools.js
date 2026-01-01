const { tool } = require('@langchain/core/tools');
const { z } = require('zod');
const axios = require('axios');

const searchProduct = tool(async ({ query, token }) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/products?q=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return JSON.stringify(response.data);
    } catch (err) {
        return `Error searching products: ${err.message}`;
    }
}, {
    name: 'searchProduct',
    description: 'Search for products. Use this FIRST to find the correct productId.',
    schema: z.object({
        query: z.string().describe("The search query"),
        token: z.string().optional() // Passed internally by the node
    })
});

const addProductToCart = tool(async ({ productId, qty = 1, token }) => {
    try {
        await axios.post(`http://localhost:3002/api/cart/items`, 
            { productId, qty },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return `Successfully added product ${productId} to cart.`;
    } catch (err) {
        return `Failed to add to cart: ${err.response?.data?.message || err.message}`;
    }
}, {
    name: 'addProductToCart',
    description: 'Add a product to the cart using a valid 24-char hex productId.',
    schema: z.object({
        productId: z.string().length(24).describe("The 24-character hex MongoDB ObjectId"),
        qty: z.number().default(1),
        token: z.string().optional() // Passed internally by the node
    })
});

module.exports = { searchProduct, addProductToCart };