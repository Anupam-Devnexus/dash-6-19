import React, { useState, useEffect } from "react";
import axios from "axios";
import Confirm from "../../Components/PopUp/Confirm";
import { useNavigate, useParams } from "react-router-dom";
import GetBrands from "../../Zustand/GetApi/GetBrands/GetBrands";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function ViewBrands() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", ImageFile: "" });

  const { loading, error, BrandList, fetchBrand } = GetBrands();
  const { id } = useParams();
  const navigate = useNavigate();
  const editingBrandId = id || null;

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  useEffect(() => {
    if (error) toast.error("Failed to fetch brands.");
  }, [error]);

  useEffect(() => {
    if (editingBrandId && BrandList.length > 0) {
      const brand = BrandList.find((b) => b._id === editingBrandId);
      if (brand) {
        setEditForm({
          name: brand.name || "",
          ImageFile: brand.ImageFile || "",
        });
      }
    } else {
      setEditForm({ name: "", ImageFile: "" });
    }
  }, [editingBrandId, BrandList]);

  const handleEditClick = (brand) => {
    navigate(`/admin/dashboard/viewBrands/${brand._id}`);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(`http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/dashboard/viewBrands/${editingBrandId}`, editForm);
      if (res.status === 200 || res.status === 204) {
        toast.success("Brand updated successfully.");
        fetchBrand();
        navigate("/admin/dashboard/viewBrands");
      } else {
        toast.error("Failed to update brand.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating.");
    }
  };

  const handleCancelEdit = () => navigate("/admin/dashboard/viewBrands");

  const handleDeleteClick = (brand) => {
    setBrandToDelete(brand);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://your-api.com/brands/${brandToDelete._id}`);
      toast.success(`Brand "${brandToDelete.name}" deleted successfully.`);
      fetchBrand();
    } catch (err) {
      toast.error("Error deleting brand.");
    }
    setIsConfirmOpen(false);
    setBrandToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setBrandToDelete(null);
  };

  return (
    <>
      <div className="bg-[var(--var-red-col)] p-4 text-white flex items-center justify-between ">
        <h2 className="text-lg font-semibold">Brands You Work With</h2>
        <button
          onClick={() => navigate("/admin/dashboard/viewBrands/addBrand")}
          className="flex items-center gap-2 bg-white text-[var(--var-red-col)] px-4 py-2 text-sm rounded-md font-medium shadow hover:shadow-md transition"
        >
          <FaPlus /> Add Brand
        </button>
      </div>

      {loading ? (
        <p className="text-center p-6 text-gray-500">Loading brands...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-b-md overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Brand Name</th>
                <th className="py-3 px-4 text-left">Logo</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {BrandList.map((brand, index) => (
                <tr key={brand._id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{index + 1}</td>

                  <td className="py-3 px-4 font-medium">
                    {editingBrandId === brand._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      brand.name
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {editingBrandId === brand._id ? (
                      <input
                        type="text"
                        name="ImageFile"
                        value={editForm.ImageFile}
                        onChange={handleEditChange}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      <img
                        src={brand.ImageFile}
                        alt={brand.name}
                        className="h-10 w-auto object-contain"
                      />
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {editingBrandId === brand._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditSave}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(brand)}
                          className="text-[var(--var-red-col)] border border-[var(--var-red-col)] hover:bg-[var(--var-red-col)] hover:text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(brand)}
                          className="bg-[var(--var-red-col)] text-white hover:bg-red-800 px-3 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Confirm
        isOpen={isConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        clientName={brandToDelete?.name}
      />
    </>
  );
}
