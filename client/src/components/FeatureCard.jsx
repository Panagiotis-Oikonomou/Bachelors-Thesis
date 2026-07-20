import { Paper, Stack, Typography, Box } from "@mui/material";

const imageSx = {
  width: { xs: 150, md: 200 },
  maxWidth: "100%",
  height: { md: 200 },
  alignSelf: { md: "end" },
};

export default function FeatureCard({
  text,
  image,
  imageSxOverride = {},
}) {
  return (
    <Paper sx={{ p: 1, "&:hover": { backgroundColor: "#3c6bb2", }, }} >
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%" }} >

        <Typography sx={{ width: "100%" }}> {text} </Typography>

        <Box component="img" src={image} sx={{ ...imageSx, ...imageSxOverride, }} />
      </Stack>
    </Paper>
  );
}