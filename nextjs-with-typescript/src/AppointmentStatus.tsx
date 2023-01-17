import {
  Divider,
  ListItem,
  Button,
  ListItemText,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { Appointment } from "./apiTypes";
import { API_URL } from "./env";

const AppointmentStatus = (props: Appointment & { refetch: Function }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Divider />
      <ListItem>
        <ListItemText
          primary={
            <Typography
              onClick={() => void router.push(`/@/${props.user_id}`)}
              sx={{
                ":hover": { cursor: "pointer", textDecoration: "underline" },
                width: "fit-content",
              }}
            >
              {props.user_id}
            </Typography>
          }
          secondary={
            <>
              <Typography
                onClick={() => void setOpen(true)}
                sx={{
                  ":hover": { cursor: "pointer", textDecoration: "underline" },
                  width: "fit-content",
                }}
              >
                {props.created_at.toString().replace(/T.*/g, "").slice(2)}
              </Typography>
              <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Description</DialogTitle>
                <DialogContent>
                  <DialogContentText>{props.description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => void setOpen(false)}>Close</Button>
                </DialogActions>
              </Dialog>
            </>
          }
        />
        <Button
          color="success"
          variant="outlined"
          size="small"
          sx={{ m: 1 }}
          onClick={async () => {
            await fetch(`${API_URL}/appointment`, {
              body: JSON.stringify({ id: props.id, status: "approved" }),
              headers: new Headers({ "Content-Type": "application/json" }),
              method: "PUT",
              credentials: "include",
            });
            props.refetch();
          }}
        >
          Accept
        </Button>
        <Button
          color="error"
          variant="outlined"
          size="small"
          sx={{ m: 1 }}
          onClick={async () => {
            await fetch(`${API_URL}/appointment`, {
              body: JSON.stringify({ id: props.id, status: "denied" }),
              headers: new Headers({ "Content-Type": "application/json" }),
              method: "PUT",
              credentials: "include",
            });
            props.refetch();
          }}
        >
          Decline
        </Button>
      </ListItem>
    </>
  );
};

export default AppointmentStatus;
