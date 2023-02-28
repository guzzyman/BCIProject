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

function AppEmployeeSearch(prop) {
  const { formik, label, fieldProperty, dataRef, row } = prop;
  const _label = label;
  const _formik = dataRef?.current?.formik || formik;
  const _fieldProperty = fieldProperty;
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
        return option?.username === value?.username;
      }}
      inputValue={q}
      onInputChange={(_, value) => setQ(value)}
      value={_formik.values[_fieldProperty]}
      onChange={(_, value) => {
        _formik.setFieldValue(_fieldProperty, value?.username);
      }}
      renderInput={(params) => (
        <TextField
          label={_label}
          {...getTextFieldFormikProps(_formik, _fieldProperty)}
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
        />
      )}
    />
  );
}

export default AppEmployeeSearch;
