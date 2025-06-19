import { create } from 'zustand';
import axios from 'axios';

const GetBrochure = create((set) => ({
  brochureList: [],
  loading: false,
  error: null,

  // Correct way to define async function inside Zustand store
  fetchBrochure: async () => {
    // Set loading true and clear previous error
    set({ loading: true, error: null });

    try {
      const response = await axios.get('http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/brochures');

      // Update state with fetched data
      set({
        brochureList: response.data.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching brochures:', error);

      // Handle error and set loading to false
      set({
        loading: false,
        error: error.message || 'Something went wrong',
      });
    }
  },
}));

export default GetBrochure;
