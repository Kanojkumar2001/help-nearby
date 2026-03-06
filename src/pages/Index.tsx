import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EmergencyButtons, { EmergencyCategory } from "@/components/EmergencyButtons";
import EmergencyMap from "@/components/EmergencyMap";
import EmergencyContacts from "@/components/EmergencyContacts";
import ReportIncident from "@/components/ReportIncident";
import Footer from "@/components/Footer";

const Index = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("idle");
  const [activeCategory, setActiveCategory] = useState<EmergencyCategory | null>(null);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied")
    );
  }, []);

  const handleCategorySelect = useCallback((category: EmergencyCategory) => {
    setActiveCategory(category);
    document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onLocateMe={handleLocateMe} locationStatus={locationStatus} />
      <EmergencyButtons onSelect={handleCategorySelect} activeCategory={activeCategory?.id ?? null} />
      <EmergencyMap userLocation={userLocation} activeCategory={activeCategory} />
      <EmergencyContacts />
      <ReportIncident />
      <Footer />
    </div>
  );
};

export default Index;
