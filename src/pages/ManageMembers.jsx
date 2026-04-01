import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getOrganizationMembers,
  deleteOrganizationMember,
  updateOrganizationMember
} from "../services/organizationService";

import { useNavigate } from "react-router-dom";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import OrganizationFloatingMenu from "../components/OrganizationFloatingMenu";
import Swal from "sweetalert2";

const ManageMembers = () => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const orgId = user?.orgId;

  const [members,setMembers] = useState([]);
  const [loading,setLoading] = useState(true);

  const [searchInput,setSearchInput] = useState("");
  const [search,setSearch] = useState("");

  const [page,setPage] = useState(0);
  const [size,setSize] = useState(5);
  const [totalPages,setTotalPages] = useState(0);

  const [sortBy,setSortBy] = useState("createdAt");
  const [order,setOrder] = useState("asc");
  const [hide,setHide] = useState("false");

  const [editOpen,setEditOpen] = useState(false);
  const [selectedMember,setSelectedMember] = useState(null);

  const [editForm,setEditForm] = useState({
    username:"",
    email:"",
    phone:""
  });


  useEffect(() => {
    fetchMembers();
  },[page,search,size,sortBy,order]);



  const fetchMembers = async () => {

    try{

      setLoading(true);

      const data = await getOrganizationMembers(
        orgId,
        page,
        size,
        search,
        sortBy,
        order
      );
   
      setMembers(data.content);
      setTotalPages(data.totalPages);

    }
    catch(err){
      console.error(err);
      Swal.fire({
    icon: "error",
    title: "Error",
    text: "Failed to load members"
  });
    }
    finally{
      setLoading(false);
    }

  };



  /* SEARCH ONLY ON ENTER */

  const handleSearchKey = (e) => {

    if(e.key === "Enter"){
      setSearch(searchInput);
      setPage(0);
    }

  };



  /* DELETE MEMBER */

  const handleDelete = async (memberId) => {

    if (!memberId) {
    Swal.fire("Error", "Invalid member ID", "error");
    return;
  }

    console.log(memberId);
    const result = await Swal.fire({
    title: "Are you sure?",
    text: "This member will be removed",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1e40af",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, remove"
  });

  if (!result.isConfirmed) return;
    // if(!window.confirm("Remove this member?")) return;

    try{
      await deleteOrganizationMember(memberId);
      Swal.fire({
      icon: "success",
      title: "Deleted",
      text: "Member removed successfully",
      confirmButtonColor: "#1e40af"
    });
      fetchMembers();
    }
    catch(err){
      console.error(err);
      Swal.fire({
      icon: "error",
      title: "Failed",
      text: err?.response?.data?.message || "Failed to delete member"
    });
    }

  };

  const openEditModal = (member) => {

  setSelectedMember(member);

  setEditForm({
    username:member.username,
    email:member.email,
    phone:member.phone
  });

  setEditOpen(true);
};

const validateMember = () => {
  if (!editForm.username.trim()) {
    Swal.fire("Error", "Username is required", "error");
    return false;
  }

  if (!editForm.email.trim()) {
    Swal.fire("Error", "Email is required", "error");
    return false;
  }

  // simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editForm.email)) {
    Swal.fire("Error", "Enter valid email", "error");
    return false;
  }

  // ✅ PHONE VALIDATION (10 digits only)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(editForm.phone)) {
    Swal.fire("Error", "Phone must be exactly 10 digits", "error");
    return false;
  }

  return true;
};

const handleUpdate = async () => {

  if (!validateMember()) return;

  try{

    await updateOrganizationMember(selectedMember.id,{
      organizationId: orgId,
      username: editForm.username,
      email: editForm.email,
      phone: editForm.phone
    });

    // alert("Member updated successfully");
    Swal.fire({
      icon: "success",
      title: "Updated",
      text: "Member updated successfully",
      confirmButtonColor: "#1e40af"
    });

    setEditOpen(false);

    fetchMembers();

  }
  catch(err){
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: err?.response?.data?.message || "Update failed"
    });
  }

};

//     const updateMember = async (memberId) => {

//         try{
//             await updateOrganizationMember(memberId);
//         }
//         catch(e){
//             console.error(e);
//         }

//   };


  if(loading){
    return (
      <div className="min-h-screen bg-slate-100">
        <AppNavbar/>
        <div className="pt-24 flex justify-center">
          <LoadingSpinner text="Loading Members..."/>
        </div>
      </div>
    );
  }



  return (

    <div className="min-h-screen bg-slate-100">

      <AppNavbar/>

      <div className="pt-24 px-6 lg:px-12 w-full flex flex-col gap-5">

        {/* HEADER */}

        <div className="flex lg:flex-row lg:items-center lg:justify-between gap-4 mb-8 md:items-center justify-between">

          <h1 className="text-3xl font-bold text-[#1e40af]">
            Manage Members
          </h1>


          {/* ADD MEMBER BUTTON */}

          <button
            onClick={() => navigate("/organization/add-members")}
            className="flex items-center gap-2 bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1a369d]"
          >
            <Plus size={18}/>
            Add Member
          </button>

        </div>



        {/* FILTER BAR */}

        <div className="flex flex-wrap gap-4 mb-6">

          {/* SEARCH */}

          <div className="relative">

            <Search className="absolute left-3 top-2.5 text-slate-400" size={18}/>

            <input
              type="text"
              placeholder="Search members..."
              value={searchInput}
              onChange={(e)=>setSearchInput(e.target.value)}
              onKeyDown={handleSearchKey}
              className="pl-9 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:border-[#1e40af]"
            />

          </div>


          {/* PAGE SIZE */}

          <select
            value={size}
            onChange={(e)=>{
              setSize(Number(e.target.value));
              setPage(0);
            }}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:border-[#1e40af]"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>

        <select
            value={sortBy}
            onChange={(e)=>setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:border-[#1e40af]"
          >
            <option value="id">id</option>
            <option value="username">Name</option>
            <option value="email">Email</option>
            <option value="createdAt">Created At</option>
          </select>

          {/* Order */}

          <select
            value={order}
            onChange={(e)=>setOrder(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:border-[#1e40af]"
          >
            
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
            
          </select>

        </div>



        {/* TABLE */}

        <div className="bg-white shadow rounded-xl overflow-x-auto relative z-10">

          <table className="w-full ">

            <thead className="bg-slate-50">

              <tr className="text-left text-sm text-slate-600">

                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4 text-right">Actions</th>

              </tr>

            </thead>


            <tbody>

              {members.map(member => (

                <tr key={member.id} className="bg-white hover:bg-slate-50 transition">

                  <td className="px-6 py-4 font-medium">
                    {member.username}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {member.email}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {member.phone}
                  </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">

                        <button
                          onClick={()=>navigate(`/profile/${member.username}`)}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </button>

                        <button
                          onClick={()=>openEditModal(member)}
                          className="text-green-600 hover:bg-green-50 rounded"
                        >
                          <Pencil size={18}/>
                        </button>

                        <button
                          onClick={()=>handleDelete(member.id)}
                          className="text-red-600 p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18}/>
                        </button>

                      </div>
                    </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>



        {/* PAGINATION */}

        <div className="flex justify-center gap-2 mt-8">

          {Array.from({length: totalPages}, (_,i)=>i+1).map((num)=>(
            <button
              key={num}
              className={`px-3 py-1 rounded-lg ${
                num-1 === page
                  ? "bg-[#1e40af] text-white"
                  : "bg-white border border-slate-300"
              }`}
              onClick={()=>setPage(num-1)}
            >
              {num}
            </button>
          ))}

        </div>

      </div>

      {editOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      onClick={() => setEditOpen(false)}
    />

    {/* MODAL */}
    <div className="relative bg-white w-[400px] p-6 rounded-xl shadow-xl z-10 flex flex-col gap-3">

      <h2 className="text-xl text-slate-600 font-semibold mb-4">
        Edit Member Details
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
        <p>Username</p>
        <input
          type="text"
          value={editForm.username}
          onChange={(e)=>setEditForm({...editForm,username:e.target.value})}
          className="border px-3 py-2 rounded-lg"
        />
        </div>
        <div className="flex flex-col gap-2">
        <p>Email</p>
        <input
          type="email"
          value={editForm.email}
          onChange={(e)=>setEditForm({...editForm,email:e.target.value})}
          className="border px-3 py-2 rounded-lg"
        />
        </div>
        <div className="flex flex-col gap-2">
        <p>Phone</p>
<input
  type="text"
  value={editForm.phone}
  maxLength={10} 
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    setEditForm({ ...editForm, phone: value });
  }}
  className="border px-3 py-2 rounded-lg"
/>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={()=>setEditOpen(false)}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-[#1e40af] text-white rounded-lg"
          >
            Update Details
          </button>
        </div>

      </div>
    </div>

  </div>
)}


    <OrganizationFloatingMenu/>


    </div>

  );

};

export default ManageMembers;


