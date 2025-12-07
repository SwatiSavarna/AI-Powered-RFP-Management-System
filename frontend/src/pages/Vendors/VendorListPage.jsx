import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const VendorListPage = () => {

    const navigate = useNavigate();

    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

        <button
            onClick={() => navigate(`/vendors/${vendor._id}`)}
            className="text-indigo-600 hover:text-indigo-900"
        >
            View
        </button>
    </td>

}