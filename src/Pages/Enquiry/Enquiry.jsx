import React, { useEffect } from "react";
import EnquiryCard from "../../Components/Card/EnquiryCard";
import enquiries from '../../DataStore/Enquiry.json';
import useGetEnquiry from "../../Zustand/GetApi/GetEnquiry/GetEnquiry";

export default function Enquiry() {
  const { loading, error, enquiryList, fetchEnquiry } = useGetEnquiry();

  useEffect(() => {
    fetchEnquiry();
  }, [fetchEnquiry])
  console.log(enquiryList)

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-xl font-extrabold text-white bg-[var(--var-red-col)] p-2 flex items-center justify-between mb-3 text-left">
        User Enquiries
        <span>( {enquiryList.length} )</span>
      </h1>

      <div className="max-w-full mx-auto">
        {/* {enquiryList.length} */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {enquiryList.map((enquiry, index) => (
            <EnquiryCard key={index} enquiry={enquiry} />
          ))}
        </div>
      </div>
    </div>
  );
}
