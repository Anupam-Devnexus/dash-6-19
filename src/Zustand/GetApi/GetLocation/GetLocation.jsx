import {create} from 'zustand'
import axios from 'axios'

const GetLocation = create((set) =>({
LocationList:[],
loading:false,
error:null,

fetchLocation: async()=>{
set({loading:true})
try {
    const response = await axios.get("http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/location-directory")
    set({loading:false,LocationList:response.data.data})
} catch (error) {
    console.log("Error-", error)
}
}
}))

export default GetLocation;