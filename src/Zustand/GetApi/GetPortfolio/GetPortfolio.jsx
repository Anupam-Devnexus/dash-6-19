import { create } from 'zustand'
import axios from 'axios'

const GetPortfolio = create((set) => ({
    portfolioList: [],
    loading: false,
    error: null,

    fetchPortfolio: async () => {
        try {
            set({ loading: true })
            const response = await axios.get('http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/portfolio')
            set({ loading: false, portfolioList: response.data.data })
        } catch (error) {
            console.log("Error-", error)
        }
    }
}))

export default GetPortfolio