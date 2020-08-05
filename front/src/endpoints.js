import axios from 'axios';
const API_URL = 'https://localhost:5001';

export const getProducts = () => axios.get(`${API_URL}/product`);

export const addProduct = product => axios.post(`${API_URL}/product`, {
  name: product.name,
  price: product.price,
  amount: product.amount,
});

export const editProduct = (productId, productData) => axios.put(`${API_URL}/product/${productId}`, {
  name: productData.name,
  price: productData.price,
  amount: productData.amount,
});

export const getPurchases = () => axios.get(`${API_URL}/purchase`);

export const addPurchase = cart => axios.post(`${API_URL}/purchase`, { cart });

export const removePurchase = purchaseId => axios.delete(`${API_URL}/purchase/${purchaseId}`);
