import {
  Autocomplete,
  CircularProgress,
  ListItemText,
  TextField,
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { bciApi } from "./IncidentStoreQuerySlice";
import React, { useState } from "react";

function ReviewMemberSearch(prop) {
  const { reviewMemberFormik, dataRef, row } = prop;
  const [q, setQ] = useState("");
  const [debounceQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const searchEmployersQueryResult = bciApi.useGetEmployeeByADSearchQuery(
    {
      ...(debounceQ ? { UserName: debounceQ } : {}),
    },
    { skip: !debounceQ }
  );
  return (
    <Autocomplete
      variant="outlined"
      fullWidth
      loading={searchEmployersQueryResult.isFetching}
      freeSolo
      options={searchEmployersQueryResult?.data || []}
      filterOptions={(options) => options}
      getOptionLabel={(option) =>
        option?.username ? option?.username : option
      }
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option?.username}>
          <ListItemText
            primary={`${option?.username} (${option?.refIndicator})`}
          />
        </li>
      )}
      isOptionEqualToValue={(option, value) => {
        return option?.username === value?.username;
      }}
      inputValue={q}
      onInputChange={(_, value) => setQ(value)}
      value={
        dataRef.current.reviewMemberFormik.values?.rcaReviewTeamMembers[`${row?.index}`]
          .member
      }
      onChange={(_, value) => {
        reviewMemberFormik.setFieldValue(
          `rcaReviewTeamMembers[${row?.index}].member`,
          value?.username
        );
      }}
      renderInput={(params) => (
        <TextField
          margin="normal"
          label="Review Team Member"
          {...params}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {searchEmployersQueryResult.isFetching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          {...getTextFieldFormikProps(
            dataRef.current.reviewMemberFormik,
            `rcaReviewTeamMembers[${row.index}].member`
          )}
        />
      )}
    />
  );
}

export default ReviewMemberSearch;