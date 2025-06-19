import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as GiIcons from "react-icons/gi";
import * as RiIcons from "react-icons/ri";
import * as HiIcons from "react-icons/hi";
import * as BsIcons from "react-icons/bs";
import * as TbIcons from "react-icons/tb";
import * as SiIcons from "react-icons/si";
import * as BiIcons from "react-icons/bi";

import Confirm from "../PopUp/Confirm";
import { useNavigate } from "react-router-dom";
import GetLocation from "../../Zustand/GetApi/GetLocation/GetLocation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const iconMap = {
  FaMapMarkerAlt: FaIcons.FaMapMarkerAlt,
  FaBuilding: FaIcons.FaBuilding,
  MdLocationOn: MdIcons.MdLocationOn,
  FaWarehouse: FaIcons.FaWarehouse,
  GiFactory: GiIcons.GiFactory,
  RiBuilding2Fill: RiIcons.RiBuilding2Fill,
  HiOfficeBuilding: HiIcons.HiOfficeBuilding,
  GiModernCity: GiIcons.GiModernCity,
  BsPinMapFill: BsIcons.BsPinMapFill,
  FaCity: FaIcons.FaCity,
  TbBuildingSkyscraper: TbIcons.TbBuildingSkyscraper,
  SiGooglemaps: SiIcons.SiGooglemaps,
  MdBusiness: MdIcons.MdBusiness,
  BiBuildingHouse: BiIcons.BiBuildingHouse,
};

export default function ContactOffices() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const navigate = useNavigate();
  const { loading, error, LocationList, fetchLocation } = GetLocation();

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load locations: ${error}`, {
        position: "top-right",
      });
    }
  }, [error]);

  const handleEdit = (index) => {
    navigate(`/admin/location/edit-location/${LocationList[index]._id}`, {
      state: { office: LocationList[index] },
    });
  };

  const openConfirm = (index) => {
    setDeleteIndex(index);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      toast.success(`Location "${LocationList[deleteIndex].office}" deleted successfully.`);
      // TODO: Call DELETE API here if needed
      setConfirmOpen(false);
      setDeleteIndex(null);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setDeleteIndex(null);
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-4">
      {loading ? (
        <p className="text-center text-gray-600">Loading locations...</p>
      ) : LocationList.length === 0 ? (
        <p className="text-center text-gray-500">No office locations found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LocationList.map((office, index) => {
            const Icon = iconMap[office.icon] || FaIcons.FaMapMarkerAlt;
            return (
              <div
                key={office._id}
                className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                {/* Header with Icon and Title */}
                <div className="flex items-center gap-3 mb-3 text-[var(--var-red-col)]">
                  <Icon size={24} />
                  <h3 className="text-lg font-semibold">{office.displayCenter}</h3>
                </div>

                {/* Contact Info */}
                <div className="text-sm text-gray-700 space-y-1 mb-3">
                  <p><strong>Email:</strong> {office.email}</p>
                  <p><strong>Phone:</strong> {office.phone}</p>
                  <p><strong>Pincode:</strong> {office.pincode}</p>
                </div>

                {/* Office Image */}
                {office.image && (
                  <img
                    src={office.image}
                    alt={office.displayCenter || "Location Image"}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                )}

                {/* Address */}
                <p className="text-gray-700 text-sm mb-1"> <strong>Address:</strong> {office.address}</p>
               

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-white text-[var(--var-red-col)] cursor-pointer px-4 py-1.5 rounded border border-[var(--var-red-col)] text-sm hover:bg-[var(--var-red-col)] hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openConfirm(index)}
                    className="bg-[var(--var-red-col)] cursor-pointer text-white px-4 py-1.5 rounded text-sm hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Popup */}
      <Confirm
        isOpen={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
        clientName={deleteIndex !== null ? LocationList[deleteIndex]?.office : ""}
      />
    </div>
  );
}
