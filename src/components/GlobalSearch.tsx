import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Chip,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { search } from "../archive";
import { useDebouncedValue } from "../utils/hooks";
import type { ArchiveItem, SearchMode } from "../types";

const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("all");
  const [results, setResults] = useState<ArchiveItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    if (debouncedQuery) {
      const searchResults = search(debouncedQuery, searchMode);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery, searchMode]);

  const handleSelect = (result: ArchiveItem) => {
    const path = result.kind === "book" ? "/books" : "/magazines";
    navigate(path, { state: { searchQuery: result.name } });
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getPlaceholderText = () => {
    switch (searchMode) {
      case "title":
        return "Търсене по заглавие...";
      case "author":
        return "Търсене по автор...";
      case "year":
        return "Търсене по година...";
      default:
        return "Библиографска търсачка...";
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: "100%", px: 2 }}>
      <Paper
        component="form"
        sx={{
          p: 0,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          border: "1px solid #ddd4c5",
          borderRadius: "4px",
          width: "100%",
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        {/* The mode filter costs 120px of a 390px screen, leaving the input unusable. On phones
            it is hidden and search runs in "all" mode, which is what it defaults to anyway. */}
        <FormControl
          sx={{ m: 1, minWidth: 120, display: { xs: "none", sm: "inline-flex" } }}
          variant="standard"
        >
          <Select
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as SearchMode)}
            disableUnderline
            sx={{
              fontSize: "12px",
              color: "#666",
              "& .MuiSelect-select": {
                padding: "8px 0",
              },
            }}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="title">Заглавие</MenuItem>
            <MenuItem value="author">Автор</MenuItem>
            <MenuItem value="year">Година</MenuItem>
          </Select>
        </FormControl>

        <Box
          sx={{
            width: "1px",
            height: "30px",
            backgroundColor: "#ddd4c5",
            mx: 1,
            display: { xs: "none", sm: "block" },
          }}
        />

        <SearchIcon sx={{ p: "10px", color: "#999", flexShrink: 0 }} />
        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            fontSize: "14px",
            "& input": {
              py: 1.5,
              px: 0,
            },
          }}
          placeholder={getPlaceholderText()}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery && setIsOpen(true)}
        />
      </Paper>

      {/* Results Dropdown */}
      {isOpen && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1300,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          }}
        >
          {results.length > 0 ? (
            <List disablePadding>
              {results.slice(0, 10).map((result, index) => (
                <ListItem
                  disablePadding
                  key={result.uid}
                  sx={{
                    borderBottom:
                      index < results.length - 1 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <ListItemButton
                    onClick={() => handleSelect(result)}
                    sx={{
                      py: 2,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "#f7f4ed",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={result.url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      sx={{
                        width: 34,
                        height: 48,
                        mr: 1.5,
                        flexShrink: 0,
                        objectFit: "cover",
                        borderRadius: "3px",
                        border: "1px solid #e6e0d4",
                        backgroundColor: "#f7f4ed",
                      }}
                    />

                    {/*
                      Rendered as plain Box/Typography rather than <ListItemText>: MUI v7 removed
                      primaryTypographyProps/secondaryTypographyProps, and the row rendered blank
                      through the slot API. Explicit markup keeps this immune to slot changes.
                    */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mb: 0.5,
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#171512",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {result.name}
                        </Typography>
                        <Chip
                          label={result.kind === "book" ? "Книга" : "Списание"}
                          size="small"
                          sx={{
                            height: "20px",
                            fontSize: "11px",
                            flexShrink: 0,
                            backgroundColor:
                              result.kind === "book" ? "#e3f2fd" : "#f3e5f5",
                            color: result.kind === "book" ? "#1976d2" : "#7b1fa2",
                          }}
                        />
                        {result.year && (
                          <Typography
                            variant="caption"
                            sx={{ color: "#999", ml: "auto", flexShrink: 0 }}
                          >
                            {result.year}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#999", fontSize: "12px" }}
                      >
                        {result.author}
                      </Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
              {results.length > 10 && (
                <Box sx={{ p: 1.5, textAlign: "center" }}>
                  <Typography variant="caption" sx={{ color: "#999" }}>
                    Показани 10 от {results.length} резултата
                  </Typography>
                </Box>
              )}
            </List>
          ) : searchQuery ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#999" }}>
                Нямат резултати за "{searchQuery}"
              </Typography>
            </Box>
          ) : null}
        </Paper>
      )}

      {/* Backdrop for closing dropdown */}
      {isOpen && (
        <Box
          onClick={() => setIsOpen(false)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1200,
          }}
        />
      )}
    </Box>
  );
};

export default GlobalSearch;
