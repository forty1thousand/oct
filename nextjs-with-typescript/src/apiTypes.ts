export interface Appointment {
  id: number;
  user_id: string;
  doctor_id: string;
  description: string;
  status: string;
  appointment_time: Date;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  username: string;
  is_doctor: boolean;
  appointments: Appointment[];
  created_at: Date;
  updated_at: Date;
}
