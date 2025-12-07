export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {

    RFP: {
        CREATE_RFPS: "/api/rfps/analyze-rfp",
        GET_ALL_RFPS: "/api/rfps",
        GET_RFP: (id) => `/api/rfps/${id}`,
        GET_PROPOSALS_FOR_RFPS: (id) => `/api/rfps/${id}/proposals`,
        COMPARE_RFPS: (id) => `/api/rfps/${id}/compare`,
    },

    VENDORS: {
        CREATE_VENDORS: "api/vendors/",
        GET_ALL_VENDORS: "/api/vendors/",
        SEND_RFPS: "/api/vendors/send",
        GET_VENDOR: (id) => `/api/vendors/${id}`,
    },
    
    PROPOSALS: {
        GET_PROPOSAL: (id) => `/api/proposals/${id}`,
    },


}