import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import CenterContainer from "../src/CenterContainer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { API_URL } from "../src/env";

const Schedule = () => {
  const router = useRouter();
  const { data, isFetched } = useQuery(["loggedin"], () =>
    fetch(`${API_URL}/me`, { credentials: "include" })
  );
  if (isFetched && !data?.ok) {
    router.push("/login");
  }

  const formik = useFormik({
    initialValues: {
      description: "",
      appointment_time: JSON.stringify(new Date()).slice(1, -9),
    },
    validationSchema: Yup.object({
      description: Yup.string().required("A description is required"),
      appointment_time: Yup.string(),
    }),
    onSubmit: async (values, { setErrors }) => {
      const req = await fetch(`${API_URL}/appointment`, {
        body: JSON.stringify({
          ...values,
          appointment_time: Math.round(
            new Date(values.appointment_time).getTime() / 1000
          ),
          doctor_id: router.query.doctor,
        }),
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "include",
        method: "POST",
      });
      if (!req.ok) {
        setErrors({
          description: "Failed to create appointment",
        });
      } else {
        router.push("/account?success=1&body=Successfully%20created%20appointment");
      }
    },
  });
  return (
    <CenterContainer
      largeWidth="60vw"
      smallWidth="85vw"
      minWidth={700}
      display="block"
    >
      <Typography variant="h5" component="p" gutterBottom>
        Schedule an appointment with {router.query.doctor}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          id="description"
          name="description"
          label="Describe your ailments"
          rows={6}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          sx={{ mb: "2em" }}
          fullWidth
          multiline
          autoFocus
        />
        <Box display="grid" gridTemplateColumns="2.5fr 1.5fr" gap="2em">
          <TextField
            id="appointment_time"
            name="appointment_time"
            label="Appointment Date"
            type="datetime-local"
            defaultValue={formik.values.appointment_time}
            onChange={formik.handleChange}
            sx={{ height: "100%" }}
          />
          <Button variant="outlined" type="submit" sx={{ height: "100%" }}>
            Submit
          </Button>
        </Box>
      </form>
    </CenterContainer>
  );
};

export default Schedule;
