
import React from 'react';
import { UserPlus, ClipboardList, Search, BellRing, CheckCircle, HeartHandshake } from 'lucide-react';
import styles from './HowItWorks.module.css';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Registration",
      content: "Join as an Individual, Volunteer, or Organization with a secure profile.",
      icon: <UserPlus size={32} />
    },
    {
      id: 2,
      title: "Post Requests",
      content: "User post their service needs with dates, locations, volunteer counts and detailed description.",
      icon: <ClipboardList size={32} />
    },
    {
      id: 3,
      title: "Discovery",
      content: "Browse local opportunities and get notified about services near you.",
      icon: <Search size={32} />
    },
    {
      id: 4,
      title: "Connect",
      content: "Secure communication and real-time updates for every service.",
      icon: <BellRing size={32} />
    },
    {
      id: 5,
      title: "Review",
      content: "Complete services and share feedback to build a trusted community.",
      icon: <CheckCircle size={32} />
    }
  ];
const [activeService, setActiveService] = React.useState(null);

const serviceDescriptions = {
  "Elderly Care": "Support senior citizens through regular visits, health assistance, companionship, and daily help.",
  "Public Cleaning": "Participate in cleanliness drives to maintain hygiene in public places and communities.",
  "Emergency Response": "Provide immediate help during disasters, accidents, floods, and critical situations.",
  "Teaching": "Help students by teaching, mentoring, and supporting education initiatives."
};

  return (
    <div className={styles.howSection}id='how'>
    <div className={styles.howContainer}>
      <header className={styles.howHeader}>
        <div className={styles.iconPulse}>
          <HeartHandshake size={48} className={styles.mainIcon} />
        </div>
        <h1 className={styles.howTitle}>How V-Serve Works</h1>
        <p className={styles.howIntro}>
          V-Serve is a Volunteering Management System that connects individuals,
        volunteers, and organizations to collaborate on social service activities.
        </p>
      </header>

      <div className={styles.timeline}>
        <div className={styles.timelineLine}></div>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.timelineItem} style={{ animationDelay: `${index * 0.15}s` }}>
            <div className={styles.timelineDot}>
              {step.icon}
            </div>
            <div className={styles.timelineContent}>
              <h3>{step.title}</h3>
              <p>{step.content}</p>
            </div>
          </div>
        ))}
      </div>

      <section className={styles.serviceGridSection}>
  <h2 className={styles.sectionSubtitle}>What We Support</h2>

  <div className={styles.servicePills}>
    {Object.keys(serviceDescriptions).map((service) => (
      <span
        key={service}
        className={styles.pill}
        onClick={() => setActiveService(service)}
        style={{
          background: activeService === service ? "#2563eb" : "",
          color: activeService === service ? "white" : ""
        }}
      >
        {service}
      </span>
    ))}
  </div>

  {activeService && (
    <div className={styles.serviceDescriptionBox}>
      <h3>{activeService}</h3>
      <p>{serviceDescriptions[activeService]}</p>
    </div>
  )}
</section>

    </div>
    </div>
  );
};

export default HowItWorks;
