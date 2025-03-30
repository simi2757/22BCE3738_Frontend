
export interface TrademarkSearchParams {
  query: string;
  country?: string;
  owner?: string;
  lawFirm?: string;
  attorney?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  trademarkClass?: string;
  dateRange?: string;
}

export interface TrademarkResult {
  serialNumber: string;
  mark: string;
  owner: string;
  lawFirm: string;
  attorney: string;
  status: string;
  filingDate: string;
  registrationDate: string;
}

export interface TrademarkSearchResponse {
  results: TrademarkResult[];
  total: number;
  page: number;
  pageSize: number;
}

const API_BASE_URL = 'https://www.trademarkia.com/api/v1';

// Mock data for development/testing
const mockResults: TrademarkResult[] = [
  {
    serialNumber: "12345678",
    mark: "NIKE",
    owner: "Nike, Inc.",
    lawFirm: "Kilpatrick Townsend & Stockton LLP",
    attorney: "John Smith",
    status: "Registered",
    filingDate: "2020-01-15",
    registrationDate: "2021-02-20"
  },
  {
    serialNumber: "87654321",
    mark: "ADIDAS",
    owner: "Adidas AG",
    lawFirm: "Jones Day",
    attorney: "Jane Doe",
    status: "Pending",
    filingDate: "2021-03-10",
    registrationDate: ""
  },
  {
    serialNumber: "98765432",
    mark: "PUMA",
    owner: "Puma SE",
    lawFirm: "Baker McKenzie",
    attorney: "Mike Johnson",
    status: "Registered",
    filingDate: "2019-11-05",
    registrationDate: "2020-12-15"
  }
];

export const trademarkService = {
  searchTrademarks: async (params: TrademarkSearchParams): Promise<TrademarkSearchResponse> => {
    try {
      // For development, return mock data
      // In production, replace with actual API call
      const filteredResults = mockResults.filter(result => {
        if (params.query && !result.mark.toLowerCase().includes(params.query.toLowerCase()) &&
            !result.owner.toLowerCase().includes(params.query.toLowerCase()) &&
            !result.serialNumber.includes(params.query)) {
          return false;
        }
        if (params.owner && result.owner.toLowerCase() !== params.owner.toLowerCase()) {
          return false;
        }
        if (params.lawFirm && result.lawFirm.toLowerCase() !== params.lawFirm.toLowerCase()) {
          return false;
        }
        if (params.attorney && result.attorney.toLowerCase() !== params.attorney.toLowerCase()) {
          return false;
        }
        if (params.status && result.status.toLowerCase() !== params.status.toLowerCase()) {
          return false;
        }
        return true;
      });

      const pageSize = params.pageSize || 10;
      const page = params.page || 1;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = filteredResults.slice(startIndex, endIndex);

      return {
        results: paginatedResults,
        total: filteredResults.length,
        page,
        pageSize
      };

      // Production API call (commented out for development)
      /*
      const response = await axios.get(`${API_BASE_URL}/search`, {
        params: {
          query: params.query,
          country: params.country || 'us',
          owner: params.owner,
          lawFirm: params.lawFirm,
          attorney: params.attorney,
          status: params.status,
          page: params.page,
          pageSize: params.pageSize,
          trademarkClass: params.trademarkClass,
          dateRange: params.dateRange
        }
      });
      return response.data;
      */
    } catch (error) {
      console.error('Error searching trademarks:', error);
      throw error;
    }
  }
}; 