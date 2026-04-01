import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";
import Spinner from "../components/LoadingSpinner";
import Swal from "sweetalert2";

const AdminDocumentVerification = () => {

  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(0);
const [sidebarOpen, setSidebarOpen] = useState(false);
const [statusFilter, setStatusFilter] = useState("");
const [typeFilter, setTypeFilter] = useState("");
const [sortBy, setSortBy] = useState("uploadedAt");
const [order, setOrder] = useState("desc");
const [showReviewed, setShowReviewed] = useState(false);
const [loading,setLoading] = useState(false);

const toggleSidebar = () => {

  setSidebarOpen(!sidebarOpen);
};
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/documents`, {
  params: {
    pageNumber: page,
    pageSize: 15,
    status: statusFilter,
    documentType: typeFilter,
    sortBy: sortBy,
    order: order
  }
});
      setDocuments(res.data.content);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
    finally{
      setLoading(false);
    }
  };

useEffect(() => {
  fetchDocuments();
}, [page, statusFilter, typeFilter, sortBy, order]);

  const updateStatus = async (id, status) => {
    try {
      const res =await api.put(`/admin/documents-update/${id}`, {
        documentStatus: status
      });
      console.log("ID",id)
      console.log(res);
if (res?.status === true) {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Document status updated successfully",
  });
} else {
  Swal.fire({
    icon: "error",
    title: "Failed",
    text: res?.message || "Something went wrong",
  });
}
      fetchDocuments();

    } catch (err) {

Swal.fire({
  icon: "error",
  title: "Error",
  text: res?.message || "Failed to update document",
});
    }
  };
const filteredDocs = documents.filter((doc) => {
  if (showReviewed) {
    return doc.documentStatus === "APPROVED" || doc.documentStatus === "REJECTED";
  }
  return doc.documentStatus !== "APPROVED" && doc.documentStatus !== "REJECTED";
});


  return (
    <div className="min-h-screen bg-slate-100">

    <AdminNavbar toggleSidebar={toggleSidebar} />

    {/* MOBILE OVERLAY */}
    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/30 z-30 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    <AdminSidebar sidebarOpen={sidebarOpen} />

    {/* PAGE CONTENT */}
    <div className="md:ml-70 p-6">
      {/* Your admin page content */}
    </div>

      <div className="flex-1 flex flex-col gap-4 pt-10 p-6 md:pl-[20rem] transition-all duration-300 w-full">

        <h1 className="text-2xl font-bold mb-6">Document Verification</h1>
        <div className="flex flex-wrap gap-3 mb-4">

  {/* STATUS FILTER */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border rounded-lg px-3 py-2 text-sm"
  >
    <option value="">All Status</option>
    <option value="SUBMITTED">Submitted</option>
    <option value="APPROVED">Approved</option>
    <option value="REJECTED">Rejected</option>
    <option value="UNDER_REVIEW">Under Review</option>
  </select>

  {/* DOCUMENT TYPE */}
  <select
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
    className="border rounded-lg px-3 py-2 text-sm"
  >
    <option value="">All Types</option>
    <option value="AADHAR">Aadhar</option>
    <option value="PAN">PAN</option>
    <option value="LICENSE">License</option>
  </select>

  {/* SORT */}
  <select
    value={order}
    onChange={(e) => setOrder(e.target.value)}
    className="border rounded-lg px-3 py-2 text-sm"
  >
    <option value="desc">Latest</option>
    <option value="asc">Oldest</option>
  </select>

  {/* TOGGLE VIEW */}
  <button
    onClick={() => setShowReviewed(!showReviewed)}
    className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm"
  >
    {showReviewed ? "Show Pending" : "Show Approved/Rejected"}
  </button>

</div>

 <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">

  {loading ? (
    <div className="flex justify-center items-center py-10">
      <Spinner />
    </div>
  ) : (
    <>
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm">

        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="pb-3">User</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Document</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Uploaded</th>
            <th className="pb-3">View</th>
            {!showReviewed && <th className="pb-3">Action</th>}
          </tr>
        </thead>

        <tbody className="text-slate-700">

          {filteredDocs.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-slate-400">
                No documents found
              </td>
            </tr>
          ) : (
            filteredDocs.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-100">

                <td className="py-3">{doc.username}</td>
                <td>{doc.email}</td>
                <td>{doc.documentType}</td>

                <td>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      doc.documentStatus === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : doc.documentStatus === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : doc.documentStatus === "UNDER_REVIEW"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {doc.documentStatus}
                  </span>
                </td>

                <td>
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </td>

                <td>
                  <a
                    href={doc.documentURL}
                    target="_blank"
                    className="text-blue-600"
                  >
                    View
                  </a>
                </td>

                {!showReviewed && (
                  <td className="flex gap-2 py-2">

                    <button
                      onClick={() => updateStatus(doc.id, "APPROVED")}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(doc.id, "REJECTED")}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => updateStatus(doc.id, "UNDER_REVIEW")}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Review
                    </button>

                  </td>
                )}

              </tr>
            ))
          )}

        </tbody>
      </table>
    </div>
    <div className="md:hidden flex flex-col gap-4">

  {filteredDocs.length === 0 ? (
    <div className="text-center py-6 text-slate-400">
      No documents found
    </div>
  ) : (
    filteredDocs.map((doc) => (
      <div
        key={doc.id}
        className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-2"
      >

        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">
            {doc.username}
          </h3>

          <span
            className={`text-xs px-2 py-1 rounded ${
              doc.documentStatus === "APPROVED"
                ? "bg-green-100 text-green-700"
                : doc.documentStatus === "REJECTED"
                ? "bg-red-100 text-red-700"
                : doc.documentStatus === "UNDER_REVIEW"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {doc.documentStatus}
          </span>
        </div>

        <p className="text-sm text-slate-600">{doc.email}</p>

        <p className="text-sm">
          <span className="font-medium">Document:</span> {doc.documentType}
        </p>

        <p className="text-sm">
          <span className="font-medium">Uploaded:</span>{" "}
          {new Date(doc.uploadedAt).toLocaleDateString()}
        </p>

        <a
          href={doc.documentURL}
          target="_blank"
          className="text-blue-600 text-sm"
        >
          View Document
        </a>

        {!showReviewed && (
          <div className="flex gap-2 mt-2">

            <button
              onClick={() => updateStatus(doc.id, "APPROVED")}
              className="flex-1 bg-green-500 text-white px-2 py-1 rounded text-xs"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus(doc.id, "REJECTED")}
              className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              Reject
            </button>

            <button
              onClick={() => updateStatus(doc.id, "UNDER_REVIEW")}
              className="flex-1 bg-yellow-500 text-white px-2 py-1 rounded text-xs"
            >
              Review
            </button>

          </div>
        )}

      </div>
    ))
  )}

</div>
    </>
  )}

</div>
<div className="flex md:flex-row items-center justify-end gap-2 text-sm mt-4">

  <button
    className="p-2 rounded-lg border border-slate-300"
    disabled={page === 0}
    onClick={() => setPage((prev) => prev - 1)}
  >
    Prev
  </button>

  <span>Page {page + 1}</span>

  <button
    className="p-2 rounded-lg border border-slate-300"
    onClick={() => setPage((prev) => prev + 1)}
  >
    Next
  </button>

</div>
      </div>

    </div>
  );
};

export default AdminDocumentVerification;