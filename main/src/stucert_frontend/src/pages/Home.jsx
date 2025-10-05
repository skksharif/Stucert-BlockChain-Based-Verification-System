import React from "react";
import "./Home.css";
import TiltedCard from "../TiltedCard/TiltedCard";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <main className="main-content">
        <section className="hero-section">
          <h1 className="hero-title">Welcome to CertiChain</h1>
          <p className="hero-subtitle">
            A Blockchain-Based Solution for Certificate Verification
          </p>
          <div className="hero-gradient"></div>
        </section>

        <section className="options-section">
          <TiltedCard
            imageSrc="./logos/student.png"
            altText="Student"
            captionText="Access Your Certificates"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="200px"
            imageWidth="200px"
            rotateAmplitude={10}
            scaleOnHover={1.15}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <div className="tilted-card-overlay">
                <NavLink to="/student-login" className="tilted-card-link">
                  Student Login
                </NavLink>
              </div>
            }
          />
          <TiltedCard
            imageSrc="./logos/verifier.png"
            altText="Verifier"
            captionText="Verify Certificate Authenticity"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="200px"
            imageWidth="200px"
            rotateAmplitude={10}
            scaleOnHover={1.15}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <div className="tilted-card-overlay">
                <NavLink to="/verifier" className="tilted-card-link">
                  Verify Certificate
                </NavLink>
              </div>
            }
          />
          <TiltedCard
            imageSrc="./logos/institute.png"
            altText="Institute"
            captionText="Issue Certificates Securely"
            containerHeight="300px"
            containerWidth="300px"
            imageHeight="200px"
            imageWidth="200px"
            rotateAmplitude={10}
            scaleOnHover={1.15}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={true}
            overlayContent={
              <div className="tilted-card-overlay">
                <NavLink to="/institute-login" className="tilted-card-link">
                  Institute Login
                </NavLink>
              </div>
            }
          />
        </section>
      </main>
    </div>
  );
}