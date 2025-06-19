import React, { useState } from "react";
import axios from "axios";

export default function AddBrands() {
  const [formData, setFormData] = useState({
    name: "",
    link: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const token = localStorage.getItem("token"); // get token from localStorage

    if (!token) {
      alert("You must be logged in to submit a review.");
      return;
    }


    console.log("Submitting review with data:", {
      ...formData,
      token,
    });


    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("link", formData.link);
    if (imageFile) {
      data.append("ImageFile", imageFile);
      console.log("ImageFile :-", imageFile)
    }

    try {
      const res = await axios.post(
        "http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/dashboard/viewBrands/addBrand",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setSuccessMsg(" Brand added successfully!");
        setFormData({ name: "", link: "" });
        setImageFile(null);
      } else {
        setErrorMsg(" Failed to add brand. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(" An error occurred while adding the brand.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md md:max-w-lg bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-[var(--var-red-col)] p-4">
          <h2 className="text-center text-white text-xl md:text-2xl font-bold">
            Add a New Brand
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-medium text-gray-700">Brand Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* <div className="flex flex-col gap-1">
            <label htmlFor="link" className="font-medium text-gray-700">Website Link</label>
            <input
              id="link"
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div> */}

          <div className="flex flex-col gap-1">
            <label htmlFor="image" className="font-medium text-gray-700">Upload Logo Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
                         className="border border-gray-300 rounded-md px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--var-red-col)] file:text-white hover:file:bg-red-700 transition duration-200 cursor-pointer"

            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--var-red-col)] text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Brand"}
          </button>

          {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}