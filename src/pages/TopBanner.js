import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

import { Fragment } from "react";

const TopBanner = (props) => {
    const { title } = props;
    const { subTitle } = props;

    return (
        <Fragment>
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "text.primary",
                    mt: 2,
                    mb: 2,
                }}
            >
                <Typography variant="h2">{title}</Typography>
                {/* <Typography variant="h4">{subTitle}</Typography> */}
            </Box>
        </Fragment>
    );
};

export default TopBanner;
