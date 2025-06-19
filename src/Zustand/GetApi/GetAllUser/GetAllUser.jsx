import axios from 'axios'
import {create} from 'zustand'

const GetAllUser = create((set)=>({
    totalusers:[],
    loading:false,
    error:null,

    fetchUsers: async()=>{
        set({loading:true})
        try {
            const response = await axios.get('http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/api/all-users')
            set({totalusers:response.data.data,loading:false})
        } catch (error) {
            console.log("Error-", error)
        }
    }
}))

export default GetAllUser;