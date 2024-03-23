import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
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

export default function MultipleSelectPlaceholder() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const [memberList, setMemberList] = useState<string[]>([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    console.log(personName);
  };

  const [memberSearch, setMemberSearch] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const memberData = await getDocData("userDetails");
        console.log(memberData);

        let membersName: any = [];

        memberData?.forEach((member: any) => {
          membersName.push([
            {
              userName: member.userName,
              userEmail: member.userEmail,
              memberID: member.memberID,
            },
          ]);
        });

        setMemberSearch(membersName);
        console.log(memberSearch);
      } catch (err) {
        console.log("Error occured when fetching members list");
      }
    })();
  }, []);

  return (
    <div>
      <FormControl
        defaultValue=""
        required
        sx={{
          //   display: "flex",
          flexDirection: "row",
          width: "100vh",
        }}
      >
        <Select
          fullWidth
          required
          multiple
          displayEmpty
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput />}
          label="Members"
          renderValue={(selected) => {
            if (selected.length === 0) {
              return "";
            }

            return selected.join(", ");
          }}
          MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled value="">
            Members
          </MenuItem>
          {memberSearch.map((memberDetails) => (
            <MenuItem
              key={memberDetails[1]}
              value={memberDetails[0]}
              style={getStyles(memberDetails[0], personName, theme)}
            >
              {(memberDetails[0] + " | " + memberDetails[1]).toString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
