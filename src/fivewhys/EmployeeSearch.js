import {
  Autocomplete,
  CircularProgress,
  ListItemText,
  TextField,
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import { bciApi } from "./FiveWhyStoreQuerySlice";
import React, { useState } from "react";

function EmployeeSearch(prop) {
  const { formik, dataRef, row } = prop;
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
      // value={formik.values.actionParty}
      value={
        dataRef.current.formik.values?.bciActions[`${row?.index}`].actionParty
      }
      onChange={(_, value) => {
        formik.setFieldValue(
          `bciActions[${row?.index}].actionParty`,
          value?.username
        );
      }}
      renderInput={(params) => (
        <TextField
          margin="normal"
          label="Action Party"
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
            `bciActions[${row.index}].actionParty`
          )}
        />
      )}
    />
  );
}

export default EmployeeSearch;
