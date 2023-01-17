import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Collapse,
  IconButton,
  Link,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Appointment } from "./apiTypes";
import { useRouter } from "next/router";

const CollapseTableRow = (props: Appointment) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography
            onClick={() => void router.push(`/@/${props.doctor_id}`)}
            width="fit-content"
            sx={{ ":hover": { cursor: "pointer", textDecoration: "underline" } }}
          >
            {props.doctor_id}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            onClick={() => void router.push(`/@/${props.user_id}`)}
            width="fit-content"
            sx={{ ":hover": { cursor: "pointer", textDecoration: "underline" } }}
          >
            {props.user_id}
          </Typography>
        </TableCell>
        <TableCell>{props.status}</TableCell>
        <TableCell>
          {props.appointment_time.toString().replace(/T.*/g, "").slice(2)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell padding="none" colSpan={5} sx={{ border: "none" }}>
          <Collapse
            in={open}
            timeout="auto"
            sx={{ justifyItems: "left" }}
            unmountOnExit
          >
            <Typography variant="h6" component="p" m={2}>
              Patient description
            </Typography>
            <Typography variant="body1" component="p" ml={2}>
              {props.description}
            </Typography>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CollapseTableRow;
