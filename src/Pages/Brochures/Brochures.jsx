import React, { useEffect, useState } from "react";
import BrochureCard from "../../Components/Card/BrochureCard";
import Confirm from '../../Components/PopUp/Confirm';
import { useNavigate } from "react-router-dom";
import GetBrochure from "../../Zustand/GetApi/GetBrochure/GetBrochure";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Brochures() {
  const [toDelete, setToDelete] = useState(null);
  const { loading, error, brochureList, fetchBrochure } = GetBrochure();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrochure();
  }, [fetchBrochure]);

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching brochures: ${error}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [error]);

  const handleDeleteClick = (brochure) => {
    setToDelete(brochure);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;

    try {
      await axios.delete(
        `http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/api/admin/delete-brochure/${toDelete._id}`
      );

      toast.success(`Brochure "${toDelete.name}" deleted successfully`, {
        position: "top-right",
        autoClose: 3000,
      });

      setToDelete(null);
      fetchBrochure(); // Refresh the list
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete brochure", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const cancelDelete = () => {
    setToDelete(null);
  };

  const handleUpdateClick = (brochure) => {
    navigate(`/admin/brochures/edit/${brochure._id}`, { state: { brochure } });
  };

  return (
    <div className=" max-w-full mx-auto">
      <div className="flex items-center justify-between bg-[var(--var-red-col)] mb-2 p-2">
        <h2 className="sm:text-xl text-base font-semibold text-white">Your Brochures <span className=""> ( {brochureList.length} ) </span ></h2>
        <button
          onClick={() => navigate("/admin/addBrochures")}
          className="px-3 py-1 bg-white rounded-md cursor-pointer text-[var(--var-red-col)]"
        >
          Add Brochures 
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading brochures...</p>
      ) : (
        <>
          {brochureList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 p-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {brochureList.map((item, index) => (
                <BrochureCard
                  key={item._id || index}
                  brochure={item}
                  onDelete={() => handleDeleteClick(item)}
                  onUpdate={() => handleUpdateClick(item)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No brochures found.</p>
          )}
        </>
      )}

      <Confirm
        isOpen={!!toDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message={`Do you want to delete the brochure: "${toDelete?.name}"?`}
      />
    </div>
  );
}
  