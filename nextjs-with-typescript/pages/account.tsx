import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import { User } from "../src/apiTypes";
import AppointmentChecker from "../src/AppointmentChecker";
import { API_URL } from "../src/env";
import CenterContainer from "../src/CenterContainer";

const Account = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [alert, setAlert] = useState(true);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const { data, isFetched } = useQuery(["loggedin"], () =>
    fetch(`${API_URL}/me`, { credentials: "include" })
  );
  if (isFetched && !data!.ok) {
    router.push("/login");
  }
  const { data: username } = useQuery<{ username: string }, unknown>(
    ["getusername"],
    () => data!.json(),
    {
      enabled: Boolean(data),
    }
  );
  const {
    data: userData,
    isFetched: userDataFetched,
    refetch,
  } = useQuery<User, unknown>(
    ["getuserdata"],
    async () =>
      (await fetch(`${API_URL}/user?username=${username!.username!}`)).json(),
    { enabled: Boolean(username) }
  );
  setTimeout(() => void setAlert(false), 3500);
  return (
    <>
      {router.query.success === "1" && (
        <Collapse in={alert}>
          <Alert sx={{ m: "1em" }}>{router.query.body}</Alert>
        </Collapse>
      )}
      <CenterContainer
        largeWidth="75vw"
        smallWidth="90vw"
        minWidth={700}
        display="block"
      >
        <Box display="grid" gridTemplateColumns="2fr 2fr" gap="2em">
          <Box display="flex" alignItems="center" gap="1em">
            <Button onClick={() => router.push("/logout")} variant="outlined">
              Logout
            </Button>
            <Button onClick={() => router.push("/")} variant="outlined">
              Doctors
            </Button>
            <Button
              onClick={() => setDelOpen(true)}
              variant="text"
              color="error"
            >
              Delete
            </Button>
            <>
              <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
                <DialogTitle>Delete account</DialogTitle>
                <DialogActions>
                  <Button onClick={() => void setDelOpen(false)}>Close</Button>
                  <Button
                    onClick={async () => {
                      await fetch(`${API_URL}/user`, {
                        credentials: "include",
                        method: "DELETE",
                      });
                      router.push("/");
                    }}
                    color="error"
                  >
                    Verify
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          </Box>
          <Box
            display="flex"
            flexDirection="row-reverse"
            alignItems="center"
            gap="1em"
          >
            {userDataFetched && userData?.is_doctor && (
              <>
                <Button
                  onClick={e => {
                    setOpen(!open);
                    setAnchor(e.currentTarget);
                  }}
                >
                  Appointments
                </Button>
                <Menu
                  open={open}
                  onClose={() => setOpen(false)}
                  anchorEl={anchor}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    sx: { backgroundImage: "none", boxShadow: "none" },
                  }}
                >
                  <AppointmentChecker
                    appointments={userData!.appointments}
                    open={open}
                    refetch={refetch}
                    self={username!.username}
                  />
                </Menu>
              </>
            )}
            {username?.username && (
              <Button
                onClick={() => void router.push(`/@/${username!.username}`)}
                variant="outlined"
              >
                Profile
              </Button>
            )}
          </Box>
        </Box>
      </CenterContainer>
    </>
  );
};

export default Account;
