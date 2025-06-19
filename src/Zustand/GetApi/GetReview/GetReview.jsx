import axios from "axios";
import {create} from 'zustand'

const GetReview = create((set) =>({
    reviewList:[],
    loading:false,
    error:null,

     fetchReview: async()=>{
        set({loading:true})
        try {
            const reviewResponse = await axios.get('http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/review')
            set({reviewList:reviewResponse.data.data,loading:false})
        } catch (error) {
            console.log("Error-", error)
        }
    }
}))

export default GetReview;