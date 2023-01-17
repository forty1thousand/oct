import {
  Box,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { NextRouter, useRouter } from "next/router";
import { useQuery } from "react-query";
import { User } from "../../src/apiTypes";
import CenterContainer from "../../src/CenterContainer";
import CollapseTableRow from "../../src/CollapseTableRow";
import { API_URL } from "../../src/env";
import ScheduleButton from "../../src/ScheduleButton";

export const getServerSideProps = async (router: NextRouter) => {
  const { user } = router.query;
  const userData = await fetch(`${API_URL}/user?username=${user}`);
  if (!userData.ok) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ...(await userData.json()),
    },
  };
};

const UserPage = (props: User) => {
  const router = useRouter();
  const { data, isFetched } = useQuery(["loggedin"], () =>
    fetch(`${API_URL}/me`, { credentials: "include" })
  );
  const { data: username } = useQuery<{ username: string }, unknown>(
    ["getusername"],
    () => data!.json(),
    {
      enabled: Boolean(data),
    }
  );
  return (
    <CenterContainer
      largeWidth="75vw"
      smallWidth="90vw"
      minWidth={700}
      display="block"
    >
      <Box display="grid" gridTemplateColumns="1fr 3fr" gap="2em">
        <Box display="flex" gap="1em">
          <Typography
            variant="h4"
            component="p"
            alignItems="center"
            height="100%"
          >
            {props.username}
          </Typography>
        </Box>
        <Box
          display="flex"
          gap="1em"
          flexDirection="row-reverse"
          alignItems="center"
        >
          {props.is_doctor &&
            isFetched &&
            data?.ok &&
            username?.username !== props.username && (
              <ScheduleButton
                buttonLabel="Schedule"
                doctorName={props.username}
              />
            )}
          {props.username === username?.username ? (
            <Typography
              variant="h6"
              component="p"
              sx={{
                ":hover": {
                  cursor: "pointer",
                  textDecoration: "underline",
                },
              }}
              onClick={() => void router.push("/account")}
            >
              Self
            </Typography>
          ) : (
            <Typography variant="h6" component="p">
              {props.is_doctor ? "Doctor" : "Normal"}
            </Typography>
          )}
          <Typography color="text.secondary">
            {
              // the regex replace cleans up the date
              props.created_at.toString().replace(/T.*/g, "").slice(2)
            }
          </Typography>
        </Box>
      </Box>
      <Box
        height="100%"
        width="70%"
        display="flex"
        mx="auto"
        pt={4}
        justifyContent="center"
      >
        {props.appointments.length === 0 ? (
          <Typography variant="h4" component="p" sx={{ alignSelf: "center" }}>
            No appointments
          </Typography>
        ) : (
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableCell />
                <TableCell>Doctor</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableHead>
              {[...props.appointments].reverse().map(appointment => (
                <CollapseTableRow {...appointment} />
              ))}
            </Table>
          </TableContainer>
        )}
      </Box>
    </CenterContainer>
  );
};

export default UserPage;
