import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MapPin, Send, X, Phone } from "lucide-react";
import { getContacts } from "@/lib/contacts";
import { useToast } from "@/hooks/use-toast";

const SOSButton = () => {
  const [active, setActive] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const handleSOS = () => {
    setActive(true);
    setSent(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocation(null)
      );
    }
  };

  const handleSendAlert = () => {
    const contacts = getContacts();
    if (contacts.length === 0) {
      toast({ title: "No Contacts", description: "Add emergency contacts first", variant: "destructive" });
      return;
    }

    setSending(true);
    const mapsLink = location
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : "Location unavailable";

    // Simulate sending alerts
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast({
        title: "🚨 SOS Alert Sent!",
        description: `Location shared with ${contacts.length} contact(s): ${mapsLink}`,
      });
    }, 1500);
  };

  return (
    <>
      {/* Floating SOS Button */}
      <motion.button
        onClick={handleSOS}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:brightness-110 transition-all"
        whileTap={{ scale: 0.9 }}
        animate={{ boxShadow: ["0 0 0 0 hsla(0,72%,51%,0.4)", "0 0 0 20px hsla(0,72%,51%,0)", "0 0 0 0 hsla(0,72%,51%,0.4)"] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AlertTriangle className="w-7 h-7" />
      </motion.button>

      {/* SOS Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center px-4"
            onClick={() => setActive(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-primary" />
                </div>
                <button onClick={() => setActive(false)} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-2xl font-bold font-display mb-2">SOS Emergency</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Send your live location to all emergency contacts instantly.
              </p>

              {location && (
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-xl px-4 py-2 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                </div>
              )}

              {sent ? (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="font-semibold text-emergency-shelter">Alert Sent Successfully!</p>
                  <p className="text-sm text-muted-foreground mt-1">Your contacts have been notified</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleSendAlert}
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                        Sending Alert...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send SOS to All Contacts
                      </>
                    )}
                  </button>
                  <a
                    href="tel:112"
                    className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary/5 transition-all"
                  >
                    <Phone className="w-4 h-4" /> Call 112
                  </a>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground mt-4">
                {getContacts().length} emergency contact(s) configured
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
