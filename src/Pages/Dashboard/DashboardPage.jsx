import React, { useEffect, useState } from "react";
import DashCard from "../../Components/Card/DashCard";
import { LiaFirstOrder } from "react-icons/lia";
import Bid from '../../DataStore/Bids.json';
import visitordata from '../../DataStore/VisitorData.json'
import newuserData from '../../DataStore/TotalDb.json'
import TotalLogin from '../../DataStore/LoginUser.json'
import { useNavigate } from "react-router-dom";
import BidChart from "../../Components/Charts/BidChart";
import LoginChart from "../../Components/Charts/LoginChart";
import VisitorsChart from "../../Components/Charts/VisitorsChart";
import NewUserChart from "../../Components/Charts/NewUserChart";
import GetAllUser from "../../Zustand/GetApi/GetAllUser/GetAllUser";
import GetBid from "../../Zustand/GetApi/GetBid/GetBid";
export default function Dashboard() {
    const [selectedChart, setSelectedChart] = useState("Logged In");
    const navigate = useNavigate();
    const { totalusers, fetchUsers } = GetAllUser()
    const { BidList, fetchBid } = GetBid()

    useEffect(() => {
        fetchUsers(),
            fetchBid()
    }, [fetchUsers, fetchBid])

    console.log(BidList)
    const dashCard = [
        {
            icon: <LiaFirstOrder />,
            text: "Total Users In",
            number: totalusers.length,
        },
        {
            icon: <LiaFirstOrder />,
            text: "Bids",
            number: BidList.length,
        },
        {
            icon: <LiaFirstOrder />,
            text: "Visitors",
            number: visitordata.length,
        },
        {
            icon: <LiaFirstOrder />,
            text: "New Customers",
            number: newuserData.length,
        }
    ];

    return (
        <div className="flex gap-1 w-full h-screen bg-gray-100">
            <main className="flex-1 p-1 overflow-y-auto">
                {/* Welcome Message */}
                <div className="bg-white flex items-center justify-between p-2 mb-1 rounded shadow text-[var(--var-red-col)] font-semibold text-sm sm:text-base">
                    Welcome Admin !!!
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1 rounded-md cursor-pointer bg-[var(--var-red-col)] text-white font-semibold"
                            onClick={() => navigate("/admin/dashboard/viewBrands")}
                        >
                            View Brands
                        </button>
                        <button
                            onClick={() => navigate('/admin/dashboard/addAchievment')}
                            className="px-3 py-1 cursor-pointer text-white font-semibold bg-[var(--var-red-col)] rounded-md"
                        >
                            Add Achievement
                        </button>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                    {dashCard.map((e, index) => (
                        <DashCard
                            key={index}
                            icon={e.icon}
                            text={e.text}
                            number={e.number}
                        />
                    ))}
                </div>

                {/* Chart Selector */}
                <div className="flex mt-2 flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 w-full p-2 bg-[var(--var-red-col)] text-white rounded-md shadow-md">
                    <span className="text-base font-medium">Select the Chart</span>
                    <select
                        className="w-full sm:w-auto px-3 py-2 bg-white text-black rounded-md border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        value={selectedChart}
                        onChange={(e) => setSelectedChart(e.target.value)}
                    >
                        <option value="Logged In">Logged In</option>
                        <option value="Bids">Bids</option>
                        {/* Future options */}
                        <option value="Visitors">Visitors</option>
                        <option value="New Customers">New Customers</option>
                    </select>
                </div>

                {/* Chart Display */}
                <div className="mt-2 bg-white p-3 rounded shadow-md">
                    {selectedChart === "Logged In" && <LoginChart />}
                    {selectedChart === "Bids" && <BidChart />}
                    {selectedChart === "Visitors" && <VisitorsChart />}
                    {selectedChart === "New Customers" && <NewUserChart />}
                </div>
            </main>
        </div>
    );
}
