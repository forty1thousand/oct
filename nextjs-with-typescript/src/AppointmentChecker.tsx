import { Appointment } from "./apiTypes";
import { Collapse, List } from "@mui/material";
import AppointmentStatus from "./AppointmentStatus";

interface AppointmentCheckerProps {
  appointments: Appointment[];
  open: boolean;
  refetch: Function;
  self: string;
}

const AppointmentChecker = (props: AppointmentCheckerProps) => {
  const appointments = props.appointments.filter(
    k => k.status === "pending" && k.doctor_id == props.self
  );
  return (
    <Collapse
      in={props.open}
      timeout={1}
      sx={{ justifyItems: "left" }}
      unmountOnExit
    >
      {appointments.length === 0 ? (
        "No appointments"
      ) : (
        <List sx={{ width: 400, maxHeight: "65vh", overflow: "auto" }}>
          {[...appointments].reverse().map(appointment => (
            <AppointmentStatus {...appointment} refetch={props.refetch} />
          ))}
        </List>
      )}
    </Collapse>
  );
};

export default AppointmentChecker;
