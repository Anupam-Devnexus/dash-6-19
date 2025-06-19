import { create } from 'zustand';
import axios from 'axios';

// Create a Zustand store for fetching bid data
const useGetBid = create((set) => ({
  // State variables
  BidList: [],        // To store the list of bids
  loading: false,     // To show loading state during fetch
  error: null,        // To store any errors during the fetch

  // Async function to fetch bid data
  fetchBid: async () => {
    set({ loading: true }); // Start loading before fetch

    try {
      const bidResponse = await axios.get(
        'http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/api/all-bids'
      );

      // On successful fetch, update BidList and stop loading
      set({
        BidList: bidResponse.data.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching bids:", error);

      // On error, stop loading and set error message
      set({
        loading: false,
        error: error.message || "Something went wrong",
      });
    }
  }
}));

export default useGetBid;
