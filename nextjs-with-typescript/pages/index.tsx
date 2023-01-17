import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useInfiniteQuery, useQuery } from "react-query";
import { User } from "../src/apiTypes";
import CenterContainer from "../src/CenterContainer";
import { API_URL } from "../src/env";

const Index = () => {
  const router = useRouter();
  const { data: loggedIn, isFetched } = useQuery(["loggedin"], () =>
    fetch(`${API_URL}/me`, { credentials: "include" })
  );
  const {
    data: doctors,
    isFetched: fetched,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<{ doctors: User[] }>(
    ["getdoctors"],
    async ({ pageParam = 0 }) =>
      (await fetch(`${API_URL}/doctors?page_number=${pageParam}`)).json(),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.doctors.length === 0 ? undefined : allPages.length,
    }
  );
  console.log(doctors?.pages);
  return (
    <CenterContainer
      largeWidth="75vw"
      smallWidth="90vw"
      minWidth={700}
      display="block"
    >
      <Box display="grid" gridTemplateColumns="2fr 2fr" gap="2em">
        <Box display="flex" alignItems="center" gap="1em"></Box>
        <Box
          display="flex"
          alignItems="center"
          gap="1em"
          flexDirection="row-reverse"
        >
          {isFetched && (
            <Button
              variant="outlined"
              onClick={() =>
                void router.push(loggedIn!.ok ? "/account" : "/login")
              }
            >
              {loggedIn!.ok ? "Account" : "Login"}
            </Button>
          )}
        </Box>
      </Box>
      <Box display="block" mx="auto" width="65%">
        <Typography
          variant="h4"
          component="p"
          alignContent="center"
          display="flex"
          mx="auto"
          width="fit-content"
        >
          Find doctors
        </Typography>
        <List sx={{ width: 150, maxHeight: "65vh", overflow: "auto", mx: "auto" }}>
          {fetched &&
            doctors &&
            doctors!.pages.map(doctorResponse =>
              doctorResponse.doctors.map(doctor => (
                <>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography
                          onClick={() =>
                            void router.push(`/@/${doctor.username}`)
                          }
                          sx={{
                            ":hover": {
                              cursor: "pointer",
                              textDecoration: "underline",
                            },
                            width: "fit-content",
                          }}
                        >
                          {doctor.username}
                        </Typography>
                      }
                    />
                  </ListItem>
                </>
              ))
            )}
          {fetched && hasNextPage && (
            <Button
              sx={{ width: "100%" }}
              onClick={async () => void (await fetchNextPage())}
              variant="outlined"
            >
              More
            </Button>
          )}
        </List>
      </Box>
    </CenterContainer>
  );
};

export default Index;
