import { useMediaQuery, Box } from "@mui/material";
import json2mq from "json2mq";
import { PropsWithChildren } from "react";

interface WidthProps {
  smallWidth?: string;
  largeWidth?: string;
  display?: string;
  minWidth?: number | string;
}

type CenterContainerProps = WidthProps & PropsWithChildren;

const CenterContainer = (props: CenterContainerProps) => {
  const matches = useMediaQuery(json2mq({ minWidth: props.minWidth ?? 1500 }));
  return (
    <Box
      mx="auto"
      mt="4em"
      width={matches ? props.largeWidth ?? "40vw" : props.smallWidth ?? "16rem"}
      height="80vh"
      display={props.display ?? "flex"}
      justifyContent="center"
    >
      {props.children}
    </Box>
  );
};

export default CenterContainer;
