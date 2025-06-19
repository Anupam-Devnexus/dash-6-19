import axios from "axios";
import {create} from 'zustand'

const GetBrands = create((set) =>({
    BrandList:[],
    loading:false,
    error:null,

    fetchBrand: async()=>{
        set({loading:true})
        try {
            const response = await axios.get("http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/dashboard/viewBrands")
            set({loading:false,BrandList:response.data.data})
        } catch (error) {
            console.log("Error-", error)
        }
    }
}))
export default GetBrands;