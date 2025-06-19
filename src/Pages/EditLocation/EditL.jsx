import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Validation schema
const schema = yup.object().shape({
  image: yup
    .mixed()
    .test("fileSize", "The file is too large", (value) => {
      if (!value?.length) return true; // No new file uploaded
      return value[0]?.size <= 5 * 1024 * 1024;
    }),
  displayCenter: yup.string().required("Display Center is required"),
  address: yup.string().required("Address is required"),
  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
    .required("Pincode is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .test("is-valid-multiple", "Enter valid 10–12 digit numbers separated by commas", (value) => {
      const phones = value?.split(",").map(p => p.trim());
      return phones.every(p => /^[0-9]{10,12}$/.test(p));
    }),

  googleMapLink: yup
    .string()
    .url("Enter a valid URL")
    .required("Google Map Link is required"),
});

export default function EditL() {
  const navigate = useNavigate();
  const location = useLocation();
  const office = location.state?.office;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (office) {
      setValue("displayCenter", office.displayCenter);
      setValue("address", office.address);
      setValue("pincode", office.pincode);
      setValue("email", office.email);
      setValue("phone", office.phone);
      setValue("googleMapLink", office.googleMapLink);
    }
  }, [office, setValue]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated!");
      return;
    }

    const formData = new FormData();
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    formData.append("displayCenter", data.displayCenter);
    formData.append("address", data.address);
    formData.append("pincode", data.pincode);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("googleMapLink", data.googleMapLink);

    try {
      const response = await fetch(
        `http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/update-store/${office._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Location updated successfully!");
        setTimeout(() => {
          navigate("/admin/location");
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error("Failed to update: " + (errorData.message || response.status));
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex p-2 items-center text-lg w-full bg-[var(--var-red-col)] text-white font-semibold mb-4">
        Edit Location Directory
      </div>
      <div className="w-full max-w-5xl mx-auto mt-2 p-4 border rounded shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex-col md:flex gap-3">
            <label className="block font-medium">Upload New Image (Optional)</label>
            <input
              type="file"
              {...register("image")}
              className="border border-gray-300 rounded-md px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--var-red-col)] file:text-white hover:file:bg-red-700 transition duration-200 cursor-pointer"
            />
            <p className="text-red-500 text-sm">{errors.image?.message}</p>
            {office?.image && (
              <img
                src={office.image}
                alt="Current Location"
                className="h-80 mt-2 rounded"
              />
            )}
          </div>

          {/* Other fields remain unchanged */}
          <div>
            <label className="block font-medium">Display Center</label>
            <input
              type="text"
              {...register("displayCenter")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.displayCenter?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              {...register("address")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.address?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Pincode</label>
            <input
              type="text"
              {...register("pincode")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.pincode?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Contact Number</label>
            <input
              type="text"
              placeholder="Enter phone numbers separated by commas"
              {...register("phone")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.phone?.message}</p>

          </div>

          <div>
            <label className="block font-medium">Google Map Link</label>
            <input
              type="url"
              {...register("googleMapLink")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.googleMapLink?.message}</p>
          </div>

          <button
            type="submit"
            className="bg-[var(--var-red-col)] cursor-pointer text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
}
