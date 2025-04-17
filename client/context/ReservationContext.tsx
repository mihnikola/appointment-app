// /app/contexts/ReservationContext.tsx
import { createContext, useState, ReactNode } from "react";

// Define the shape of the context data
type ReservationContextType = {
  reservation: any;
  updateReservation: (data: any) => void;
};

// Create the context with a default value of null
const ReservationContext = createContext<ReservationContextType | null>(null);

// ReservationProvider component to wrap around the app and provide context
export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [reservation, setReservation] = useState<any>(null);

  const updateReservation = (data: any) => {
    setReservation(data);
  };

  return (
    <ReservationContext.Provider value={{ reservation, updateReservation }}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;
