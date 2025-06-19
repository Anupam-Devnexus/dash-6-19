import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MediaCard from "../../Components/Card/MediaCard";
import Confirm from "../../Components/PopUp/Confirm";
import GetMedia from "../../Zustand/GetApi/GetMedia/GetMedia";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Media() {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const { loading, error, MediaList, fetchMedia } = GetMedia();

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);
  console.log(MediaList)

  useEffect(() => {
    if (error) {
      toast.error(`Failed to fetch media: ${error}`, {
        position: "top-right",
      });
    }
  }, [error]);

  const requestDelete = (index) => {
    const selected = MediaList[index];
    setSelectedIndex(index);
    setSelectedClient(selected.description);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedIndex === null) return;

    const mediaItem = MediaList[selectedIndex];
    const id = mediaItem._id;

    try {
      const response = await fetch(
        `http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/api/admin/delete-media-coverage/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete media.");
      }

      toast.success(`Media "${mediaItem.description}" deleted successfully`, {
        position: "top-right",
      });

      fetchMedia(); // Refresh media list after deletion
    } catch (err) {
      toast.error(`Error: ${err.message}`, {
        position: "top-right",
      });
    }

    resetConfirmState();
  };

  const resetConfirmState = () => {
    setConfirmOpen(false);
    setSelectedIndex(null);
    setSelectedClient("");
  };

  const handleEdit = (index, item) => {
    navigate(`edit-media/${item._id}`, { state: { media: item } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Your Media Details
        </h2>
        <button
          onClick={() => navigate("/admin/media/addMedia")}
          className="px-5 py-2 bg-[var(--var-red-col)] text-white rounded-md font-medium transition hover:bg-red-700"
        >
          + Add Media
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center text-gray-600">Loading media...</p>
      ) : MediaList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MediaList.map((item, index) => (
            <MediaCard
              key={item._id}
              link={item.link}
              image={item.image}
              text={item.description}
              onDelete={() => requestDelete(index)}
              onEdit={() => handleEdit(index, item)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No media found.</p>
      )}

      {/* Confirm Delete Popup */}
      <Confirm
        isOpen={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={resetConfirmState}
        message={`Do you want to delete the media: "${selectedClient}"?`}
      />
    </div>
  );
}
