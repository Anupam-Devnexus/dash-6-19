// src/Zustand/GetProduct.js
import { create } from 'zustand';
import axios from 'axios';

const GetProduct = create((set) => ({
  ProductList: [],
  loading: false,
  error: null,

  fetchProduct: async () => {
    set({ loading: true, error: null });
    try {
      const productResponse = await axios.get('http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/products');
      // The data is directly in response, not in `data.data`
      set({ loading: false, ProductList: productResponse.data.data });
    } catch (error) {
      console.log("Error-", error);
      set({ loading: false, error: error.message });
    }
  }
}));

export default GetProduct;
