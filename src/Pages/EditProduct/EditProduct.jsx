import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    productType: "",
    productSubType: "",
    title: "",
    shape: "",
    color: "",
    size: "",
    supplyAbility: "",
    productImage: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        shape: product.shape || "",
        productType: product.productType || "",
        color: product.color || "",
        size: product.size || "",
        supplyAbility: product.supplyAbility || "",
        productImage: product.productImage || "",
      });
      setPreviewUrl(product.productImage || "");
    }
  }, [product]);

  // Create preview when file changes
  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Clean up the object URL when component unmounts or file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product || !product.id) {
      alert("Original product info is missing or incomplete.");
      return;
    }

    try {
      let imageToSend = formData.productImage;

      // If user selected a new file, convert it to base64 or upload and get URL
      if (selectedFile) {
        // Example: convert file to base64 string
        imageToSend = await toBase64(selectedFile);
      }

      const updatedProduct = {
        ...formData,
        productImage: imageToSend,
      };
      console.log("Product ID:", product.id); // Should not be undefined or null

      const response = await fetch(`http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/edit/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.statusText}`);
      }

      setSuccessMessage("Product updated successfully!");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (error) {
      alert(error.message);
    }
  };

  // Helper function to convert file to base64 string
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  if (!product) {
    return (
      <div className="p-6 text-red-600 font-semibold text-center">
        No product data found to edit. Please navigate from the Products page.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-1 bg-white shadow-lg rounded-lg mt-2">
      <h2 className="text-xl font-extrabold mb-6 text-[var(--var-red-col)] text-left">
        Edit Product
      </h2>

      {successMessage && (
        <div className="mb-1 p-1 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Product Type", name: "productType" },
          { label: "Product SubType", name: "product SubType" },
          { label: "Title", name: "title", required: true },
          { label: "Shape", name: "shape" },
          { label: "Color", name: "color" },
          { label: "Size", name: "size" },
          { label: "Supply Ability", name: "supplyAbility" },
        ].map(({ label, name, required }) => (
          <div key={name} className="flex flex-col">
            <label
              htmlFor={name}
              className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              id={name}
              name={name}
              type="text"
              value={formData[name]}
              onChange={handleChange}
              required={required}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] transition"
              autoComplete="off"
            />
          </div>
        ))}

        {/* File upload input */}
        <div className="flex flex-col md:col-span-2">
          <label
            htmlFor="productImage"
            className="mb-2 font-semibold text-gray-700 dark:text-gray-200"
          >
            Product Image
          </label>
          <div className="grid md:grid-cols-2 items-center grid-cols-1 justify-between gap-2">

            {previewUrl && (

              <img
                src={previewUrl}
                alt="Product preview"
                className=" h-36 object-cover rounded mb-3 border border-gray-300 self-center"
              />
            )}
            <input
              id="productImage"
              name="productImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--var-red-col)] transition"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="flex-1 px-6 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-2 rounded-md bg-[var(--var-red-col)] text-white hover:bg-red-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
