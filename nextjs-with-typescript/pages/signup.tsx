import * as Yup from "yup";
import { useFormik } from "formik";
import { Box } from "@mui/system";
import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useRouter } from "next/router";
import CenterContainer from "../src/CenterContainer";
import { API_URL } from "../src/env";
import { useQuery } from "react-query";

const SignUp = () => {
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
      is_doctor: false,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(2, "Username must be longer")
        .max(30, "Username too long")
        .required("Username is required"),
      password: Yup.string()
        .min(8, "Password must be longer")
        .required("Password is required"),
      is_doctor: Yup.bool(),
    }),
    onSubmit: async (values, { setErrors }) => {
      const req = await fetch(`${API_URL}/user`, {
        body: JSON.stringify(values),
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "include",
        method: "POST",
      });
      if (!req.ok) {
        setErrors({
          username: "Username is taken",
        });
      } else {
        router.push("/account?sucess=1&body=Successfully%20created%20account");
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
        ></TextField>
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
        ></TextField>
        <br style={{ width: "100%" }} />
        <Box width="100%" display="flex" justifyContent="center" mt="3rem">
          <ToggleButtonGroup
            value={formik.values.is_doctor ? "doctor" : "normal"}
            size="large"
            sx={{ mx: "auto", mt: "auto" }}
            exclusive
          >
            <ToggleButton
              value="doctor"
              onClick={() => formik.setFieldValue("is_doctor", true)}
            >
              Doctor
            </ToggleButton>
            <ToggleButton
              value="normal"
              onClick={() => formik.setFieldValue("is_doctor", false)}
            >
              Normal
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </form>
    </CenterContainer>
  );
};

export default SignUp;
