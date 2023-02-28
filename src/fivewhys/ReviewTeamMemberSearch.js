import {
  Autocomplete,
  CircularProgress,
  ListItemText,
  TextField,
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { rcaApi } from "./FiveWhyStoreQuerySlice";
import React, { useState } from "react";

function ReviewTeamMemberSearch(prop) {
  const { formik, dataRef, row } = prop;
  const [q, setQ] = useState("");
  const [debounceQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });

  const searchEmployersQueryResult = rcaApi.useGetEmployeeByADSearchQuery(
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
        return option?.username == value?.username || option?.username == value;
      }}
      inputValue={q}
      onInputChange={(_, value) => setQ(value)}
      value={
        dataRef.current.formik.values?.rcaReviewTeamMembers[`${row?.index}`]
          .member
      }
      onChange={(_, value) => {
        formik.setFieldValue(
          `rcaReviewTeamMembers[${row.index}].member`,
          value?.username
        );
      }}
      renderInput={(params) => (
        <TextField
          margin="normal"
          label="Review Team Members"
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
            dataRef.current.formik,
            `rcaReviewTeamMembers[${row.index}].member`
          )}
        />
      )}
    />
  );
}

export default ReviewTeamMemberSearch;
