import {
  Autocomplete,
  CircularProgress,
  ListItemText,
  TextField,
} from "@mui/material";
import { getTextFieldFormikProps } from "common/Utils";
import useDebouncedState from "hooks/useDebouncedState";
import React, { useState } from "react";
import { bciApi } from "./IncidentStoreQuerySlice";

function AppBCITitleSearch(prop) {
  const { formik, label, fieldProperty, dataRef, row } = prop;
  const _label = label;
  const _fieldProperty = fieldProperty;
  const [q, setQ] = useState("");
  const [debounceQ] = useDebouncedState(q, {
    wait: 1000,
    enableReInitialize: true,
  });
  
  const searchEmployersQueryResult = bciApi.useGetBCIByTitleQuery(
    {
      ...(debounceQ ? { BCITitle: debounceQ } : {}),
    },
    { skip: !debounceQ }
  );
  console.log(`BCI ID ${formik.values.bciRegisterId}>> `,formik.values.problemDefinition);
  return (
    <Autocomplete
      variant="outlined"
      fullWidth
      loading={searchEmployersQueryResult.isFetching}
      freeSolo
      options={searchEmployersQueryResult?.data || []}
      filterOptions={(options) => options}
      getOptionLabel={(option) =>
        option?.breachTitle ? option?.breachTitle : option
      }
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option?.breachTitle}>
          <ListItemText
            primary={`${option?.breachTitle} (${option?.bciID})`}
          />
        </li>
      )}
      isOptionEqualToValue={(option, value) => {
        return option?.breachTitle === value?.breachTitle;
      }}
      inputValue={q}
      onInputChange={(_, value) => setQ(value)}
      // value={formik.values.bciID}
      onChange={(_, value) => {
        formik.setFieldValue(_fieldProperty, value?.breachTitle);
        formik.setFieldValue(`bciRegisterId`, value?.bciID);
      }}
      renderInput={(params) => (
        <TextField
          label={_label}
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
          {...getTextFieldFormikProps(formik, _fieldProperty)}
        />
      )}
    />
  );
}

export default AppBCITitleSearch;
