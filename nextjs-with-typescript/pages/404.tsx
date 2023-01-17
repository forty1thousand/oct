import { Link, Typography } from "@mui/material";
import { useRouter } from "next/router";
import CenterContainer from "../src/CenterContainer";

const NotFound = () => {
  const router = useRouter();
  return (
    <CenterContainer
      largeWidth="50vw"
      smallWidth="45vw"
      display="block"
      minWidth="700px"
    >
      <Typography variant="h4" component="h1">
        Couldn't find {router.asPath.replace(/\?.*/g, "")}
      </Typography>
      <Link href="/">Go back to home</Link>
    </CenterContainer>
  );
};

export default NotFound;
