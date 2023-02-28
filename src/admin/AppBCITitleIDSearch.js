import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  CircularProgress,
  ListItemText,
  TextField,
} from "@mui/material";
import useDebouncedState from "hooks/useDebouncedState";
import React, { useState } from "react";
import { bciApi } from "../incident/IncidentStoreQuerySlice";

function AppBCITitleIDSearch(prop) {
  const { label, BaseURI } = prop;
  const _label = label;
  const [SearchedBCIID, setSeSearchedBCIID] = useState("");
  const handleClick = () => {
    window.open(`${BaseURI}RCA_Report&BCIID=${SearchedBCIID}`, "_blank");
  };

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

  return (
    <div className="flex flex-row gap-2">
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
        onChange={(_, value) => {
          setSeSearchedBCIID(value?.bciID);
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
          />
        )}
      />
      <LoadingButton
        onClick={handleClick}
        loading={searchEmployersQueryResult.isFetching}
      >
        Generate Report
      </LoadingButton>
    </div>
  );
}

export default AppBCITitleIDSearch;
