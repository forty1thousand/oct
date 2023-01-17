import { Button } from "@mui/material";
import { useRouter } from "next/router";

interface ScheduleButtonProps {
  doctorName: string;
  buttonLabel: string;
  buttonSize?: "small" | "medium" | "large";
  buttonVariant?: "text" | "outlined" | "contained";
}

const ScheduleButton = (props: ScheduleButtonProps) => {
  const router = useRouter();
  return (
    <Button
      variant={props.buttonVariant ?? "outlined"}
      size={props.buttonSize ?? "small"}
      onClick={() => void router.push({
        pathname: "/schedule",
        query: { doctor: props.doctorName },
      })}
    >
      {props.buttonLabel}
    </Button>
  );
};

export default ScheduleButton;
