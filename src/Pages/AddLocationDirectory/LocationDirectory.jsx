import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

// Validation schema
const schema = yup.object().shape({
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileSize", "The file is too large", (value) => {
      return value && value[0]?.size <= 2 * 1024 * 1024; 
    }),
  CenterName:yup.string().required("Center Name is required"),
  displayCenter: yup.string().required("Display Center is required"),
  address: yup.string().required("Address is required"),
  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
    .required("Pincode is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10,12}$/, "Phone number must be 10 to 12 digits")
    .required("Phone number is required"),
  googleMapLink: yup
    .string()
    .url("Enter a valid URL")
    .required("Google Map Link is required"),
});

export default function LocationDirectory() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated!");
      return;
    }

    const formData = new FormData();
    formData.append("image", data.image[0]);
    formData.append("displayCenter", data.displayCenter);
    formData.append("CenterName", data.CenterName);
    formData.append("address", data.address);
    formData.append("pincode", data.pincode);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("googleMapLink", data.googleMapLink);

    try {
      const response = await fetch(
        "http://ec2-65-2-70-219.ap-south-1.compute.amazonaws.com:8000/admin/location/addLocationDirectory",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("Location added successfully!");
        console.log(result);
        reset();
        navigate("/admin/location");
      } else {
        const errorData = await response.json();
        alert("Failed to add location: " + (errorData.message || response.status));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex p-2 items-center text-lg w-full bg-[var(--var-red-col)] text-white font-semibold mb-4">
        Add to the Location Directory
      </div>
      <div className="w-full max-w-5xl mx-auto mt-2 p-4 border rounded shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex-col md:flex gap-3">
            <label className="block font-medium">Upload Image of Location -</label>
            <input
              type="file"
              {...register("image")}
              className="border border-gray-300 rounded-md px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--var-red-col)] file:text-white hover:file:bg-red-700 transition duration-200 cursor-pointer"
            />
            <p className="text-red-500 text-sm">{errors.image?.message}</p>
          </div>
<div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Center Name"
              {...register("CenterName")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.CenterName?.message}</p>
          </div>
          <div>
            <label className="block font-medium">Display Center</label>
            <input
              type="text"
              placeholder="Display Center"
              {...register("displayCenter")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.displayCenter?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              placeholder="Address"
              {...register("address")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.address?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Pincode</label>
            <input
              type="text"
              placeholder="Pincode"
              {...register("pincode")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.pincode?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              placeholder="Official Email"
              {...register("email")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Contact Number</label>
            <input
              type="text"
              placeholder="Enter Official Contact Number"
              {...register("phone")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.phone?.message}</p>
          </div>

          <div>
            <label className="block font-medium">Google Map Link</label>
            <input
              type="url"
              placeholder="Enter Official Google Map Link"
              {...register("googleMapLink")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.googleMapLink?.message}</p>
          </div>

          <button
            type="submit"
            className="bg-[var(--var-red-col)] cursor-pointer text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
