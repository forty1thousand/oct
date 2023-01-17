import { Box, TextField, Typography, Link } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import * as Yup from "yup";
import CenterContainer from "../src/CenterContainer";
import { API_URL } from "../src/env";

const Login = () => {
  const router = useRouter();
  const { data, isFetched } = useQuery(["loggedin"], () =>
    fetch(`${API_URL}/me`, { credentials: "include" })
  );
  if (isFetched && data!.ok) {
    router.push("/account");
  }
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setErrors }) => {
      const req = await fetch(`${API_URL}/user`, {
        body: JSON.stringify(values),
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "include",
        method: "PUT",
      });
      let json: { username?: string; password?: string };
      try {
        json = await req.json();
      } catch {
        json = {};
      }
      if (!req.ok) {
        setErrors({
          username: json.username,
          password: json.password,
        });
      } else {
        router.push("/account");
      }
    },
  });
  return (
    <CenterContainer>
      <form
        onSubmit={formik.handleSubmit}
        onKeyDown={e => (e.key == "Enter" ? formik.handleSubmit() : undefined)}
      >
        <TextField
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          sx={{ m: "1em" }}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ m: "1em" }}
        />
        <br style={{ width: "100%" }} />
        <Box display="flex" justifyContent="right" height="85%" width="100%">
          <Typography variant="body1" mt="auto">
            Are you thinking of the <Link href="/signup">signup</Link> page?
          </Typography>
        </Box>
      </form>
    </CenterContainer>
  );
};

export default Login;
