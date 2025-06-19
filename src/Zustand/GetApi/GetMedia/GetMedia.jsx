import axios from 'axios';
import { create } from 'zustand';

const GetMedia = create((set) => ({
  MediaList: [],
  loading: false,
  error: null,

  fetchMedia: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        'http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/media',
      );

      set({
        loading: false,
        MediaList: response.data.data,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching media:', error);
      set({
        loading: false,
        error: error.message || 'Something went wrong',
        MediaList: [],
      });
    }
  },
}));

export default GetMedia;
