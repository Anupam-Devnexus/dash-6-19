import React, { useState } from "react";
// Removed: import { useNavigate } from "react-router-dom"; // useNavigate requires a Router context

export default function AddProduct() {
  // Removed: const navigate = useNavigate(); // No longer needed without react-router-dom

  const [formData, setFormData] = useState({
    productType: "",
    productSubType: "",
    title: "",
    shape: "",
    color: "",
    size: "",
    supplyAbility: "",
    minimumOrder: "",
  });

  const [productImage, setProductImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      productType: "",
      productSubType: "",
      title: "",
      shape: "",
      color: "",
      size: "",
      supplyAbility: "",
      minimumOrder: "",
    });
    setProductImage(null);
    setSuccessMessage("");
    setErrorMessage("");
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // Clear previous success messages
    setErrorMessage("");   // Clear previous error messages
    setIsLoading(true);    // Set loading to true

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("You must be logged in to add a product.");
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();

      // Append all form data fields
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      // Append the image file separately
      if (productImage) {
        data.append("productImage", productImage);
      } else {
        // Handle case where image is required but not provided
        setErrorMessage("Product image is required.");
        setIsLoading(false);
        return;
      }

      // --- Console Log for FormData before API call ---
      console.log("--- Form Data Contents for API Call ---");
      for (let [key, value] of data.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File Name - ${value.name}, Size - ${value.size} bytes, Type - ${value.type}`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      console.log("Authorization Token (Bearer):", token ? "Present" : "Missing");
      console.log("---------------------------------------");
      // --- End Console Log ---

      const response = await fetch(
        "http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/product/addProduct",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type - let the browser set it automatically for FormData
          },
          body: data,
        }
      );

      // --- New: Check Content-Type before parsing as JSON ---
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json(); // Parse the response as JSON
        if (!response.ok) {
          throw new Error(responseData.message || `Failed to add product (Status: ${response.status})`);
        }
        setSuccessMessage("Product added successfully!");
      } else {
        // If not JSON, try to read as text to see the HTML content
        const responseText = await response.text();
        console.error("Server responded with non-JSON content:", responseText);
        throw new Error(`Server returned unexpected content type (${contentType || 'none'}). Expected JSON. Raw response: ${responseText.substring(0, 200)}...`);
      }
      // --- End New Content-Type Check ---

      // Reset form after successful submission
      resetForm();
      // Simulate navigation by clearing the success message after a delay
      setTimeout(() => { setSuccessMessage(""); }, 2000); // Clear message after 2 seconds
    } catch (err) {
      console.error("Error adding product:", err);
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false); // Always set loading to false
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 bg-white shadow-lg rounded-lg mt-2 font-inter">
      <h2 className="text-3xl font-extrabold mb-6 text-[var(--var-red-col)] text-center">
        Add New Product
      </h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center font-medium animate-fade-in">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center font-medium animate-fade-in">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="productType" className="mb-2 font-semibold text-gray-700">
            Product Type <span className="text-red-500">*</span>
          </label>
          <select
            id="productType"
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[var(--var-red-col)] focus:border-transparent transition duration-200"
          >
            <option value="">Select Type</option>
            <option value="Bricks">Bricks</option>
            <option value="Tiles">Tiles</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="productSubType" className="mb-2 font-semibold text-gray-700">
            Product SubType <span className="text-red-500">*</span>
          </label>
          <select
            id="productSubType"
            name="productSubType"
            value={formData.productSubType}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[var(--var-red-col)] focus:border-transparent transition duration-200"
          >
            <option value="">Select SubType</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value= "Residential & Commercial"> Residential & Commercial</option>
          </select>
        </div>

        {[
          { label: "Title", name: "title" },
          { label: "Size", name: "size" },
          { label: "Shape", name: "shape" },
          { label: "Color", name: "color" },
          { label: "Supply Ability", name: "supplyAbility" },
          { label: "Minimum Order", name: "minimumOrder" },
        ].map(({ label, name }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="mb-2 font-semibold text-gray-700">
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[var(--var-red-col)] focus:border-transparent transition duration-200"
              autoComplete="off"
            />
          </div>
        ))}

        <div className="flex flex-col md:col-span-2">
          <label htmlFor="productImage" className="mb-2 font-semibold text-gray-700">
            Upload Product Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="productImage"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--var-red-col)] file:text-white hover:file:bg-red-700 transition duration-200 cursor-pointer"
          />
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 px-6 py-3 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition duration-200 font-semibold shadow-sm"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-md bg-[var(--var-red-col)] text-white hover:bg-red-700 transition duration-200 font-semibold shadow-md flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
