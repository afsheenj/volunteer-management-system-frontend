import Swal from "sweetalert2";

export const showSuccess = (title, text) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#1e40af",
  });
};

export const showError = (title, text) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#1e40af",
  });
};

export const showWarning = (title, text) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonColor: "#1e40af",
  });
};

export const showConfirm = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#1e40af",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, Join",
  });
};

export const showNumberInput = async ({
  title,
  label,
  placeholder = "Enter value",
  confirmText = "Submit",
  maxVolunteers,
  registeredCount,
}) => {
  return Swal.fire({
    title,
    input: "number",
    inputLabel: label,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: confirmText,
    confirmButtonColor: "#1e40af",

    inputValidator: (value) => {
      if (!value || value <= 0) {
        return "Please enter a valid number";
      }

      if (
        maxVolunteers !== undefined &&
        registeredCount !== undefined &&
        registeredCount + Number(value) > maxVolunteers
      ) {
        return `Cannot exceed max volunteers (${maxVolunteers})`;
      }
    },
  });
};

// ADDED: Specialized Logout Confirmation
export const showLogoutConfirm = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out of your account",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1e40af",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, Logout",
    cancelButtonText: "Cancel",
    reverseButtons: true, // Swaps button positions for better UX
  });

  return result.isConfirmed; // Returns true if they clicked "Yes"
};