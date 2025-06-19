import axios from "axios";
import { create } from "zustand";

// Create a Zustand store for fetching enquiries
const useGetEnquiry = create((set) => ({
  // Initial state variables
  enquiryList: [],       // Stores list of enquiries
  loading: false,        // Indicates loading state
  error: null,           // Stores any error message

  // Define the async function correctly (NO 'const' inside object)
  fetchEnquiry: async () => {
    set({ loading: true }); // Set loading to true before starting the API call

    try {
      const enquiryRespo = await axios.get(
        "http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/api/all-enquiries"
      );

      // Update the enquiryList with the API response
      set({
        enquiryList: enquiryRespo.data.data, // assuming response structure has `data.data`
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching enquiries:", error);

      // If there’s an error, stop loading and store error message
      set({
        loading: false,
        error: error.message || "Failed to fetch enquiries",
      });
    }
  }
}));

export default useGetEnquiry;
