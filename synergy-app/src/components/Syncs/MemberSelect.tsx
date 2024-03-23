import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useState } from "react";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useEffect } from "react";
import { getDocData } from "../getFunctions";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MemberSelectAvatarChip() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [memberSearch, setMemberSearch] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const memberData = await getDocData("userDetails");
        console.log(memberData);

        let membersName: any = [];

        memberData?.forEach((member: any) => {
          membersName.push([member.userName, member.memberID]);
        });

        setMemberSearch(membersName);
        console.log(memberSearch);
      } catch (err) {
        console.log("Error occured when fetching books");
      }
    })();
  }, []);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Members" />}
          sx={{
            width: "320px",
            fontFamily: "IBM Plex Sans",
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: 1.5,
            padding: "8px 12px",
            borderRadius: "8px",
            color: "#212121",
            background: "#fff",
            border: `1px solid  "grey.200"`,
            boxShadow: `0px 2px 2px  "grey.50"`,
          }}
          //   onFocus={}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {memberSearch.map((memberDetails) => (
            <MenuItem
              key={memberDetails[1]}
              value={memberDetails[0]}
              style={getStyles(memberDetails[0], personName, theme)}
            >
              {memberDetails[0]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
