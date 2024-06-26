import * as React from "react";
import { useFormControlContext } from "@mui/base/FormControl";
import { FormControl } from "@mui/material";
import { Input, inputClasses } from "@mui/base/Input";
import { styled } from "@mui/system";
import clsx from "clsx";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import MemberSelectAvatarChip from "./MemberSelect";
import { Autocomplete, Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import MultipleSelectPlaceholder from "./memberSelectPlaceholder";
import { getDocData } from "../getFunctions";

export default function CreateSync() {
  const [syncName, setSyncName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [syncDesc, setSyncDesc] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [memberSearch, setMemberSearch] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const memberData = await getDocData("userDetails");
        console.log(memberData);

        let membersName: any = [];

        memberData?.forEach((member: any) => {
          membersName.push({
            userName: member.userName,
            userEmail: member.userEmail,
            memberID: member.memberID,
          });
        });
        console.log(membersName);

        setMemberSearch(membersName);
        // console.log(memberSearch);
      } catch (err) {
        console.log("Error occured when fetching members list");
      }
    })();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100vh",
      }}
    >
      <FormControl defaultValue="" required fullWidth={true}>
        {/* <Label>Sync Name</Label>
      <StyledInput placeholder="Write your sync here" />
      <Label>Sync Description</Label>
      <StyledInput placeholder="Write your sync description here" /> */}
        {/* Text Box for name */}
        <Label>Enter Sync Name</Label>
        <TextField
          required
          id="syncName"
          label="Sync Name"
          variant="outlined"
          onChange={(e: any) => setSyncName(e.target.value)}
          fullWidth={true}
          error={nameErr} // Add the error prop here
          // helperText={nameErr ? "Enter Sync Name" : ""} // Add the helperText prop here
        />
        {/* Text Box for email */}
        <Label>Enter Sync Description</Label>
        <TextField
          required
          id="syncDesc"
          label="Sync Description"
          variant="outlined"
          onChange={(e: any) => setSyncDesc(e.target.value)}
          fullWidth={true}
          error={nameErr} // Add the error prop here
          // helperText={nameErr ? "Enter Sync Description" : ""} // Add the helperText prop here
        />
        <Label>Add Members</Label>
        <Autocomplete
          fullWidth={true}
          multiple
          id="tags-outlined"
          options={memberSearch}
          getOptionLabel={(option) => option.userName}
          // defaultValue={[top100Films[13]]}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField {...params} label="Add Members" placeholder="Members" />
          )}
        />
      </FormControl>
    </Box>
  );
}

const StyledInput = styled(Input)(
  ({ theme }) => `

  .${inputClasses.input} {
    width: 320px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }
  }
`
);

const Label = styled(
  ({
    children,
    className,
  }: {
    children?: React.ReactNode;
    className?: string;
  }) => {
    const formControlContext = useFormControlContext();
    const [dirty, setDirty] = React.useState(false);

    React.useEffect(() => {
      if (formControlContext?.filled) {
        setDirty(true);
      }
    }, [formControlContext]);

    if (formControlContext === undefined) {
      return <p>{children}</p>;
    }

    const { error, required, filled } = formControlContext;
    const showRequiredError = dirty && required && !filled;

    return (
      <p
        className={clsx(className, error || showRequiredError ? "invalid" : "")}
      >
        {children}
        {required ? " *" : ""}
      </p>
    );
  }
)`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 0.875rem;
  margin-bottom: 4px;

  &.invalid {
    color: red;
  }
`;

const HelperText = styled((props: {}) => {
  const formControlContext = useFormControlContext();
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (formControlContext?.filled) {
      setDirty(true);
    }
  }, [formControlContext]);

  if (formControlContext === undefined) {
    return null;
  }

  const { required, filled } = formControlContext;
  const showRequiredError = dirty && required && !filled;

  return showRequiredError ? <p {...props}>This field is required.</p> : null;
})`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 0.875rem;
`;

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

let data = [
  ["userName1", "userId1", "userIcon1"],
  ["userName2", "userId2", "userIcon2"],
  ["userName3", "userId3", "userIcon3"],
];

// const AvatarChips = () => (
//   <Stack direction="row" spacing={1}>
//     {data.map((array, index) => (
//       <Chip
//         avatar={<Avatar>M</Avatar>}
//         label={array[0]}
//         // variant="outlined"
//       />
//     ))}
//     {/* <Chip avatar={<Avatar>M</Avatar>} label="Avatar" />
//     <Chip
//       avatar={<Avatar alt="Natacha" src="/static/images/avatar/1.jpg" />}
//       label="Avatar"
//       // variant="outlined"
//     /> */}
//   </Stack>
// );
