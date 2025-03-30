import BookmarkIcon from "@mui/icons-material/Bookmark";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HistoryIcon from "@mui/icons-material/History";
import SearchIcon from "@mui/icons-material/Search";
import ShareIcon from "@mui/icons-material/Share";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Alert,
  AlertColor,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
} from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import {
  TrademarkResult,
  TrademarkSearchParams,
  trademarkService,
} from "../services/trademarkService";

interface FilterState {
  owner: string[];
  lawFirm: string[];
  attorney: string[];
  status: string[];
  country: string[];
  trademarkClass: string[];
  dateRange: string[];
}

interface StatusState {
  message: string;
  type: AlertColor;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div className="py-4">{children}</div>}
    </div>
  );
}

interface SearchOption {
  value: string;
  label: string;
  logo: string;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({
    owner: [],
    lawFirm: [],
    attorney: [],
    status: [],
    country: [],
    trademarkClass: [],
    dateRange: [],
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<TrademarkResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFilters, setLoadingFilters] = useState<boolean>(false);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<StatusState>({
    message: "Loading all trademarks...",
    type: "info",
  });
  const [tabValue, setTabValue] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedTrademarks, setSavedTrademarks] = useState<TrademarkResult[]>([]);

  // Load all trademarks on component mount
  useEffect(() => {
    const fetchAllTrademarks = async () => {
      setLoading(true);
      setLoadingResults(true);
      try {
        const response = await trademarkService.searchTrademarks({
          query: "",
          page: 1,
          pageSize: 10,
        });
        setSearchResults(response.results);
        setTotalPages(Math.ceil(response.total / response.pageSize));
        setStatus({
          message: `Loaded ${response.total} trademarks`,
          type: "success",
        });
      } catch (err) {
        setError("Failed to fetch trademarks. Please try again.");
        setStatus({
          message: "An error occurred while loading trademarks",
          type: "error",
        });
        console.error("Error loading trademarks:", err);
      } finally {
        setLoading(false);
        setLoadingResults(false);
      }
    };

    fetchAllTrademarks();
  }, []);

  // Add predefined search options with logos
  const searchOptions: SearchOption[] = [
    { value: "", label: "All Trademarks", logo: "" },
    {
      value: "nike",
      label: "NIKE",
      logo: "https://cdn-icons-png.flaticon.com/512/732/732084.png",
    },
    {
      value: "adidas",
      label: "ADIDAS",
      logo: "https://cdn-icons-png.flaticon.com/512/732/732160.png",
    },
    {
      value: "puma",
      label: "PUMA",
      logo: "https://cdn-icons-png.flaticon.com/128/47/47137.png",
    },
    {
      value: "under armour",
      label: "UNDER ARMOUR",
      logo: "https://img.icons8.com/?size=160&id=F2QHk6nFoNA3&format=png",
    },
    {
      value: "new balance",
      label: "NEW BALANCE",
      logo: "https://upload.wikimedia.org/wikipedia/commons/archive/e/ea/20160801155104%21New_Balance_logo.svg",
    },
    {
      value: "reebok",
      label: "REEBOK",
      logo: "https://img.icons8.com/?size=160&id=qbP58H80RBsE&format=png",
    },
    {
      value: "asics",
      label: "ASICS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Asics.png/640px-Asics.png",
    },
    {
      value: "fila",
      label: "FILA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Fila_logo.svg/600px-Fila_logo.svg.png",
    },
    {
      value: "converse",
      label: "CONVERSE",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Converse_logo.svg/1600px-Converse_logo.svg.png?20210517161238",
    },
    {
      value: "vans",
      label: "VANS",
      logo: "https://img.icons8.com/?size=160&id=4dOS28ObNtM6&format=png",
    },
    {
      value: "gucci",
      label: "GUCCI",
      logo: "https://img.icons8.com/?size=100&id=60396&format=png",
    },
    {
      value: "prada",
      label: "PRADA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Prada.png?20191030194221",
    },
    {
      value: "versace",
      label: "VERSACE",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Emblema_Medusa_versace.png?20220306025957",
    },
    {
      value: "chanel",
      label: "CHANEL",
      logo: "https://img.icons8.com/?size=160&id=1LrJC5LhVM3x&format=png",
    },
  ];

  // Add error handling for images
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.style.display = "none";
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveTrademark = (trademark: TrademarkResult) => {
    setSavedTrademarks((prev) => [...prev, trademark]);
    setStatus({
      message: "Trademark saved successfully",
      type: "success",
    });
  };

  const handleUnsaveTrademark = (serialNumber: string) => {
    setSavedTrademarks((prev) =>
      prev.filter((trademark) => trademark.serialNumber !== serialNumber)
    );
    setStatus({
      message: "Trademark removed from saved items",
      type: "info",
    });
  };

  const handleShare = async (trademark: TrademarkResult) => {
    try {
      await navigator.clipboard.writeText(
        `Check out this trademark: ${trademark.mark} (${trademark.serialNumber})`
      );
      setStatus({
        message: "Share link copied to clipboard",
        type: "success",
      });
    } catch (err) {
      setStatus({
        message: "Failed to copy share link",
        type: "error",
      });
    }
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setLoadingResults(true);
    setError("");
    setStatus({
      message: searchQuery.trim()
        ? "Searching for trademarks..."
        : "Loading all trademarks...",
      type: "info",
    });

    // Add to recent searches if there's a search query
    if (searchQuery.trim()) {
      setRecentSearches((prev) => {
        const newSearches = [
          searchQuery,
          ...prev.filter((s) => s !== searchQuery),
        ].slice(0, 5);
        return newSearches;
      });
    }

    try {
      const searchParams: TrademarkSearchParams = {
        query: searchQuery,
        owner: filters.owner.join(","),
        lawFirm: filters.lawFirm.join(","),
        attorney: filters.attorney.join(","),
        status: filters.status.join(","),
        country: filters.country.join(","),
        trademarkClass: filters.trademarkClass.join(","),
        dateRange: filters.dateRange.join(","),
      };

      const response = await trademarkService.searchTrademarks(searchParams);
      setSearchResults(response.results);
      setTotalPages(Math.ceil(response.total / response.pageSize));

      if (response.results.length === 0) {
        setStatus({
          message: "No results found for your search criteria",
          type: "warning",
        });
      } else {
        setStatus({
          message: `Found ${response.total} results`,
          type: "success",
        });
      }
    } catch (err) {
      setError("Failed to fetch trademark results. Please try again.");
      setStatus({
        message: "An error occurred while searching",
        type: "error",
      });
      console.error("Search error:", err);
    } finally {
      setLoading(false);
      setLoadingResults(false);
    }
  };

  const handleClearFilters = (): void => {
    setFilters({
      owner: [],
      lawFirm: [],
      attorney: [],
      status: [],
      country: [],
      trademarkClass: [],
      dateRange: [],
    });
    setStatus({
      message: "Filters cleared",
      type: "info",
    });
  };

  const handleFilterChange =
    (field: keyof FilterState) =>
    (e: SelectChangeEvent<string[]>): void => {
      setFilters((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      setStatus({
        message: "Filter updated",
        type: "info",
      });
    };

  const handleSearchChange = (e: SelectChangeEvent<string>): void => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setStatus({
        message: "Loading all trademarks...",
        type: "info",
      });
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    setStatus({
      message: `Loading page ${value}...`,
      type: "info",
    });
  };

  const activeFilters = Object.values(filters).filter(Boolean);

  // Loading skeleton for table rows
  const TableRowSkeleton = () => (
    <tr className="animate-pulse">
      {[...Array(8)].map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton variant="text" width="100%" height={20} />
        </td>
      ))}
    </tr>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-transparent">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-semibold text-primary">
            Trademark Search
          </h1>
          <div className="flex items-center gap-4">
            <Tooltip title="Search Tips">
              <IconButton>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Trending Searches">
              <IconButton>
                <TrendingUpIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <form onSubmit={handleSearch}>
          <div className="flex gap-4 mb-6 bg-white rounded-lg shadow-md p-4">
            <div className="relative flex-1">
              <FormControl fullWidth>
                <InputLabel>Search Trademarks</InputLabel>
                <Select
                  value={searchQuery}
                  label="Search Trademarks"
                  onChange={handleSearchChange}
                  disabled={loading}
                  startAdornment={<SearchIcon className="text-gray-400 mr-2" />}
                >
                  {searchOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.logo && (
                          <img
                            src={option.logo}
                            alt={`${option.label} logo`}
                            className="w-6 h-6 object-contain"
                            onError={handleImageError}
                          />
                        )}
                        <span>{option.label}</span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <CircularProgress size={24} className="text-white" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>

        <Alert
          severity={status.type}
          className="mb-6"
          sx={{
            "& .MuiAlert-message": {
              display: "flex",
              alignItems: "center",
              gap: "8px",
            },
          }}
        >
          {loading && <CircularProgress size={20} />}
          {status.message}
        </Alert>

        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            disabled={loading}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FilterListIcon />
            Advanced Filters
          </button>
          {activeFilters.length > 0 && (
            <div className="flex gap-2">
              {activeFilters.map((filter, index) => (
                <div
                  key={index}
                  className="bg-blue-50 text-primary px-3 py-1 rounded-full"
                >
                  <span>{filter}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {showFilters && (
          <div className="card mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loadingFilters ? (
                // Loading skeleton for filters
                [...Array(7)].map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton variant="text" width={60} height={24} />
                    <Skeleton variant="rectangular" height={40} />
                  </div>
                ))
              ) : (
                <>
                  <FormControl>
                    <InputLabel>Owner</InputLabel>
                    <Select
                      multiple
                      value={filters.owner}
                      label="Owner"
                      onChange={handleFilterChange("owner")}
                      disabled={loading}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="Nike, Inc.">Nike, Inc.</MenuItem>
                      <MenuItem value="Adidas AG">Adidas AG</MenuItem>
                      <MenuItem value="Puma SE">Puma SE</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel>Law Firm</InputLabel>
                    <Select
                      multiple
                      value={filters.lawFirm}
                      label="Law Firm"
                      onChange={handleFilterChange("lawFirm")}
                      disabled={loading}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="Kilpatrick Townsend & Stockton LLP">
                        Kilpatrick Townsend & Stockton LLP
                      </MenuItem>
                      <MenuItem value="Jones Day">Jones Day</MenuItem>
                      <MenuItem value="Baker McKenzie">Baker McKenzie</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel>Attorney</InputLabel>
                    <Select
                      multiple
                      value={filters.attorney}
                      label="Attorney"
                      onChange={handleFilterChange("attorney")}
                      disabled={loading}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="John Smith">John Smith</MenuItem>
                      <MenuItem value="Jane Doe">Jane Doe</MenuItem>
                      <MenuItem value="Mike Johnson">Mike Johnson</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select
                      multiple
                      value={filters.status}
                      label="Status"
                      onChange={handleFilterChange("status")}
                      disabled={loading}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="Registered">Registered</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Abandoned">Abandoned</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel>Country</InputLabel>
                    <Select
                      multiple
                      value={filters.country}
                      label="Country"
                      onChange={handleFilterChange("country")}
                      disabled={loading}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="us">United States</MenuItem>
                      <MenuItem value="eu">European Union</MenuItem>
                      <MenuItem value="uk">United Kingdom</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel>Trademark Class</InputLabel>
                    <Select
                      multiple
                      value={filters.trademarkClass}
                      label="Trademark Class"
                      onChange={handleFilterChange("trademarkClass")}
                      disabled={loading}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="clothing">Clothing</MenuItem>
                      <MenuItem value="footwear">Footwear</MenuItem>
                      <MenuItem value="sports">Sports Equipment</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <InputLabel>Date Range</InputLabel>
                    <Select
                      multiple
                      value={filters.dateRange}
                      label="Date Range"
                      onChange={handleFilterChange("dateRange")}
                      disabled={loading}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      <MenuItem value="last30">Last 30 Days</MenuItem>
                      <MenuItem value="last90">Last 90 Days</MenuItem>
                      <MenuItem value="lastYear">Last Year</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
            </div>
          </div>
        )}

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className="mb-6"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#1a237e",
            },
            "& .MuiTab-root": {
              color: "#666",
              "&.Mui-selected": {
                color: "#1a237e",
                fontWeight: 600,
              },
            },
          }}
        >
          <Tab label="Search Results" />
          <Tab label="Recent Searches" />
          <Tab label="Saved Trademarks" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {loadingResults ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Serial Number</th>
                    <th>Mark</th>
                    <th>Owner</th>
                    <th>Law Firm</th>
                    <th>Attorney</th>
                    <th>Status</th>
                    <th>Filing Date</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Serial Number</th>
                    <th>Mark</th>
                    <th>Owner</th>
                    <th>Law Firm</th>
                    <th>Attorney</th>
                    <th>Status</th>
                    <th>Filing Date</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((result, index) => (
                    <tr key={index}>
                      <td>{result.serialNumber}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const option = searchOptions.find(
                              (opt) =>
                                opt.value.toLowerCase() ===
                                result.mark.toLowerCase()
                            );
                            return option?.logo ? (
                              <img
                                src={option.logo}
                                alt={`${result.mark} logo`}
                                className="w-6 h-6 object-contain"
                                onError={handleImageError}
                              />
                            ) : null;
                          })()}
                          <span>{result.mark}</span>
                        </div>
                      </td>
                      <td>{result.owner}</td>
                      <td>{result.lawFirm}</td>
                      <td>{result.attorney}</td>
                      <td>
                        <Chip
                          label={result.status}
                          color={
                            result.status === "Registered"
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </td>
                      <td>
                        {new Date(result.filingDate).toLocaleDateString()}
                      </td>
                      <td>
                        {result.registrationDate
                          ? new Date(
                              result.registrationDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Tooltip title="Save">
                            <IconButton
                              size="small"
                              onClick={() => handleSaveTrademark(result)}
                            >
                              <BookmarkIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Share">
                            <IconButton
                              size="small"
                              onClick={() => handleShare(result)}
                            >
                              <ShareIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center p-4">
                <nav className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg ${
                          page === pageNum
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </nav>
              </div>
            </div>
          ) : null}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => setSearchQuery(search)}
                >
                  <div className="flex items-center gap-2">
                    <HistoryIcon className="text-gray-400" />
                    <span>{search}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRecentSearches((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ClearIcon className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Saved Trademarks</h3>
            <div className="space-y-4">
              {savedTrademarks.map((trademark, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-medium">{trademark.mark}</h4>
                    <div className="flex items-center gap-2">
                      <Chip
                        label={trademark.status}
                        color={
                          trademark.status === "Registered"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />
                      <Tooltip title="Share">
                        <IconButton
                          size="small"
                          onClick={() => handleShare(trademark)}
                        >
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove from saved">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleUnsaveTrademark(trademark.serialNumber)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <ClearIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Serial Number:</span>{" "}
                      {trademark.serialNumber}
                    </div>
                    <div>
                      <span className="font-medium">Owner:</span>{" "}
                      {trademark.owner}
                    </div>
                    <div>
                      <span className="font-medium">Filing Date:</span>{" "}
                      {new Date(trademark.filingDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Registration Date:</span>{" "}
                      {trademark.registrationDate
                        ? new Date(
                            trademark.registrationDate
                          ).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabPanel>
      </div>

      {/* Contact Us Section */}
      <div className="bg-gray-100 rounded-lg shadow-md p-6 mt-12">
        <h2 className="text-2xl font-semibold text-primary mb-4">Contact Us</h2>
        <p className="text-gray-700 mb-4">
          Have questions or need assistance? Feel free to reach out to us!
        </p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2"
              rows={4}
              placeholder="Your Message"
            ></textarea>
          </div>
          <button type="submit" className="btn-primary w-full">
            Submit
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-4 mt-12">
        <p>
          &copy; {new Date().getFullYear()} Trademark Search. All rights
          reserved.
        </p>
        <p>
          Powered by{" "}
          <a href="https://www.trademarkia.com/" className="underline">
            Trademarkia
          </a>
          .
        </p>
      </footer>
    </div>
  );
};

export default SearchPage;
