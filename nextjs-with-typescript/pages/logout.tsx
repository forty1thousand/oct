import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import CenterContainer from "../src/CenterContainer";
import { API_URL } from "../src/env";

const Logout = () => {
  const router = useRouter();
  const { isFetched } = useQuery(["logout"], () =>
    fetch(`${API_URL}/user`, { credentials: "include", method: "PATCH" })
  );
  if (isFetched) {
    setTimeout(
      () => void router.push("/"),
      Math.round(650 + Math.random() * 500)
    );
  }
  return (
    <CenterContainer display="grid">
      <CircularProgress sx={{ placeSelf: "center" }} size={256} />
    </CenterContainer>
  );
};

export default Logout;
