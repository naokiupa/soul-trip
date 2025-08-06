import type { FlightInfo as FlightInfoType } from '../types';
import styles from '../App.module.css';

interface FlightInfoProps {
  title: string;
  flight: FlightInfoType;
}

export const FlightInfo: React.FC<FlightInfoProps> = ({ title, flight }) => {
  return (
    <div className={styles.flightInfo}>
      <h4>{title}</h4>
      <p>{flight.departure} → {flight.arrival}</p>
      <p>{flight.airline} {flight.flightNumber}</p>
      <p>{flight.date}</p>
    </div>
  );
};