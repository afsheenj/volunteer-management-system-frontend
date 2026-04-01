import { useState } from "react";

import { Globe, Zap } from "lucide-react"; 
import styles from "./Contact.module.css";
import api from "../services/api";
import { showError, showSuccess } from "../utils/alertservice";

const Contact = () => {
  const [isEmergency, setIsEmergency] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
  fullName: "",
  mailId: "",
  natureOfService: "",
  description: ""
});

  const handleCategoryChange = (e) => {
    setIsEmergency(e.target.value === "disaster");
  };



  return (
    <section id="contact" className={styles.contactSection}>
    
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      <div className={styles.mainWrapper}>
        <div className={styles.glassContainer}>
          
        
          <div className={`${styles.infoColumn} ${isEmergency ? styles.emergencyBg : styles.standardBg}`}>
            <div className={styles.contentPadding}>
          
              <span className={styles.cyberBadge}>Get In Touch</span>
              
              <h2 className={styles.mainTitle}>
                Let’s build a <span className={styles.gradientText}>Stronger Community</span>.
              </h2>
              
              <p className={styles.description}>
                Big goals need many hands. Whether you're looking for a team or a community lead in need of urgent support, we’re here to bridge the gap and get the right people to the right place.
              </p>

              <div className={styles.contactList}>
                <div className={styles.item}>
                
                  <Globe className={styles.plainLucideIcon} size={24} />
                  <div className={styles.itemText}>
                    <h6>Global Operations</h6>
                    <p>Pan-India Volunteer Network</p>
                  </div>
                </div>
                
                <div className={styles.item}>
                
                  <Zap className={styles.plainLucideIcon} size={24} />
                  <div className={styles.itemText}>
                    <h6>Response Priority</h6>
                    <p>Under 2 Hours for Emergencies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

         
          <div className={styles.formColumn}>
            <div className={styles.contentPadding}>
              <form className={styles.interactiveForm} 
             onSubmit={async (e) => {
  e.preventDefault();

  let newErrors = {};

  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full Name is required";
  }

  if (!formData.mailId.trim()) {
    newErrors.mailId = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.mailId)) {
      newErrors.mailId = "Enter a valid email";
    }
  }

  if (!formData.natureOfService) {
    newErrors.natureOfService = "Select a service type";
  }

  if (!formData.description.trim()) {
    newErrors.description = "Description is required";
  }

  setErrors(newErrors);

  // ❌ Stop if errors exist
  if (Object.keys(newErrors).length > 0) return;

  try {
    await api.post("/public/home/contact", formData);

    // alert("Message sent successfully");
    await showSuccess(
    "Message Sent!", 
    "Thank you for reaching out. Our team will get back to you shortly."
  );

    setFormData({
      fullName: "",
      mailId: "",
      natureOfService: "",
      description: ""
    });

    setIsEmergency(false);
    setErrors({}); // clear errors

  } catch (err) {
    console.error(err);
    // alert("Failed to send message");
    await showError(
    "Submission Failed", 
    "We encountered an error. Please check your connection and try again."
  );
  }
}}
>
                <div className={styles.inputRow}>
                  <div className={styles.floatingGroup}>
                    <input type="text" placeholder=" " value={formData.fullName}  id="user_name" onChange={(e) =>
  setFormData({ ...formData, fullName: e.target.value })
} />                 
                    <label htmlFor="user_name">Full Name</label>
                             {errors.fullName && (
  <span className="text-red-500 text-sm">{errors.fullName}</span>
)}
                  </div>
         
                  <div className={styles.floatingGroup}>
                    <input type="email" placeholder=" " value={formData.mailId}  id="user_email" onChange={(e) =>
  setFormData({ ...formData, mailId: e.target.value })
} />
                    <label htmlFor="user_email">Email Address</label>
                                      {errors.mailId && (
  <span className="text-red-500 text-sm">{errors.mailId}</span>
)}
                  </div>

                </div>
                

                <div className={styles.floatingGroup}>
  <select 
    className={styles.selectInput} 
   onChange={(e) => {
  handleCategoryChange(e);
  setFormData({
    ...formData,
    natureOfService: e.target.value
  });
}}
    defaultValue=""
    id="service_type"
    value={formData.natureOfService} 
    
  >
    <option value="" disabled hidden></option>
    
    <option value="Crisis and Disaster">Crisis & Disaster Response</option>
    <option value="Elderly Care and Engagement">Elderly Care & Engagement</option>
    <option value="Civic and Environmental Sanitation">Civic & Environmental Sanitation</option>
    <option value="Rural Education and Literacy">Rural Education & Literacy</option>
    <option value="Public Awareness and Advocacy">Public Awareness & Advocacy</option>
    <option value="Community Event Coordination">Community Event Coordination</option>
    <option value="Other Specail Initiatives">Other Special Initiatives</option>
  </select>
  <label htmlFor="service_type" className={styles.selectLabel}>Nature of Service</label>
  {errors.natureOfService && (
  <span className="text-red-500 text-sm">{errors.natureOfService}</span>
)}
</div>

                <div className={styles.floatingGroup}>
                  <textarea placeholder=" " rows="4" value={formData.description}  id="user_msg" onChange={(e) =>
  setFormData({ ...formData, description: e.target.value })
}></textarea>
                  <label htmlFor="user_msg">How can we help you?</label>
                  {errors.description && (
  <span className="text-red-500 text-sm">{errors.description}</span>
)}
                </div>

                <button 
                  type="submit" 
                  className={isEmergency ? styles.emergencyBtn : styles.glowButton}
                >
                  {isEmergency ? "Send Urgent Request" : "Send Message"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;