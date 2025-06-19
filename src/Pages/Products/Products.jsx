import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiTwotoneEdit } from "react-icons/ai";
import Confirm from "../../Components/PopUp/Confirm";
import { useNavigate } from "react-router-dom";
import GetProduct from "../../Zustand/GetApi/GetProduct/GetProduct";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const navigate = useNavigate();
  const { loading, error, ProductList, fetchProduct } = GetProduct();

  const [productType, setProductType] = useState("All");
  const [productToDelete, setProductToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
//   console.log(ProductList)

  const handleProductChange = (e) => {
    setProductType(e.target.value);
  };

  const filteredProducts =
    ProductList?.filter((product) =>
      productType === "All"
        ? true
        : product.productType?.toLowerCase() === productType.toLowerCase()
    ) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const nameA = a.title.toUpperCase();
    const nameB = b.title.toUpperCase();
    if (sortOrder === "asc") return nameA.localeCompare(nameB);
    else return nameB.localeCompare(nameA);
  });

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const edithandler = (product) => {
  if (product?._id) {
    navigate(`/admin/edit/${product._id}`, {
      state: { product },
    });
  } else {
    toast.error("Product ID missing");
  }
};


  const deleteHandler = (index) => {
    setProductToDelete(sortedProducts[index]);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?.id) return;

    try {
      const res = await fetch(
        `http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/products/${productToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted successfully");
      fetchProduct();
      setShowConfirm(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete the product. Please try again.");
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };

  return (
    <>
      {/* Header with Filter & Add Button */}
      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between p-3 bg-[var(--var-red-col)] text-white shadow-sm space-y-2 sm:space-y-0">
        <span className="font-semibold text-lg">Manage Products</span>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigate("/admin/product/addProduct")}
            className="bg-white text-[var(--var-red-col)] px-3 py-1 rounded-md"
          >
            Add Product
          </button>

          <select
            value={productType}
            onChange={handleProductChange}
            className="w-28 sm:w-36 bg-white text-[var(--var-red-col)] border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="All">All</option>
            <option value="Bricks">Bricks</option>
            <option value="Tiles">Tiles</option>
          </select>

          <button
            onClick={handleSortToggle}
            className="bg-white text-[var(--var-red-col)] px-3 py-1 rounded-md"
          >
            Sort {sortOrder === "asc" ? "A → Z" : "Z → A"}
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="max-h-screen w-full p-2">
        <div className="overflow-x-auto shadow-md rounded">
          <table className="min-w-full bg-white text-sm text-left text-gray-700">
            <thead className="text-[var(--var-red-col)] border-b sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Shape</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Color</th>
                <th className="px-3 py-2">Size</th>
                <th className="px-3 py-2">Supply</th>
                <th className="px-3 py-2">Image</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    Loading products...
                  </td>
                </tr>
              ) : sortedProducts.length > 0 ? (
                sortedProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-2">{index + 1}</td>
                    <td className="px-3 py-2">{product.title}</td>
                    <td className="px-3 py-2">{product.shape}</td>
                    <td className="px-3 py-2">{product.productType}</td>
                    <td className="px-3 py-2">{product.color}</td>
                    <td className="px-3 py-2">{product.size}</td>
                    <td className="px-3 py-2">{product.supplyAbility}</td>
                    <td className="px-3 py-2">
                      <img
                        src={product.productImage}
                        alt={product.title}
                        className="w-20 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-3 py-2 flex gap-4 text-lg">
                      <span
                        onClick={() => edithandler(product)}
                        className="cursor-pointer"
                      >
                        <AiTwotoneEdit />
                      </span>
                      <span
                        onClick={() => deleteHandler(index)}
                        className="cursor-pointer text-[var(--var-red-col)]"
                      >
                        <AiOutlineDelete />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-5 text-gray-500">
                    No {productType === "All" ? "products" : productType + "s"} available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Popup */}
      <Confirm
        isOpen={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirm(false);
          setProductToDelete(null);
        }}
      />
    </>
  );
}
