"use client";
import { useState, useRef } from "react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  Utensils,
  ShoppingBag,
  Bus,
  Wifi,
  Smartphone,
  Film,
  CreditCard,
  Calendar,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Dummy data for upcoming bills
const upcomingBills = [
  {
    id: "BILL123",
    type: "Electricity",
    vendor: "BESCOM",
    amount: "₹1200",
    status: "Pending",
    paymentMethod: "--",
    date: "2025-06-21",
    timestamp: new Date("2025-06-21").getTime(),
  },
  {
    id: "BILL124",
    type: "Subscription",
    vendor: "Netflix",
    amount: "₹499",
    status: "Paid",
    paymentMethod: "Card",
    date: "2025-06-20",
    timestamp: new Date("2025-06-20").getTime(),
  },
  {
    id: "BILL125",
    type: "Internet",
    vendor: "ACT Fibernet",
    amount: "₹999",
    status: "Overdue",
    paymentMethod: "--",
    date: "2025-06-16",
    timestamp: new Date("2025-06-16").getTime(),
  },
  {
    id: "BILL126",
    type: "Food",
    vendor: "Zomato",
    amount: "₹350",
    status: "Paid",
    paymentMethod: "UPI",
    date: "2025-06-18",
    timestamp: new Date("2025-06-18").getTime(),
  },
  {
    id: "BILL127",
    type: "Shopping",
    vendor: "Amazon",
    amount: "₹1499",
    status: "Pending",
    paymentMethod: "--",
    date: "2025-06-23",
    timestamp: new Date("2025-06-23").getTime(),
  },
  {
    id: "BILL128",
    type: "Transport",
    vendor: "Ola",
    amount: "₹220",
    status: "Overdue",
    paymentMethod: "--",
    date: "2025-06-15",
    timestamp: new Date("2025-06-15").getTime(),
  },
  {
    id: "BILL129",
    type: "Entertainment",
    vendor: "BookMyShow",
    amount: "₹400",
    status: "Paid",
    paymentMethod: "Card",
    date: "2025-06-19",
    timestamp: new Date("2025-06-19").getTime(),
  },
  {
    id: "BILL130",
    type: "Subscription",
    vendor: "Spotify",
    amount: "₹129",
    status: "Pending",
    paymentMethod: "--",
    date: "2025-06-22",
    timestamp: new Date("2025-06-22").getTime(),
  },
  {
    id: "BILL131",
    type: "Bills",
    vendor: "BWSSB",
    amount: "₹600",
    status: "Paid",
    paymentMethod: "Netbanking",
    date: "2025-06-17",
    timestamp: new Date("2025-06-17").getTime(),
  },
  {
    id: "BILL132",
    type: "Food",
    vendor: "Domino’s",
    amount: "₹550",
    status: "Pending",
    paymentMethod: "--",
    date: "2025-06-24",
    timestamp: new Date("2025-06-24").getTime(),
  },
  {
    id: "BILL133",
    type: "Electricity",
    vendor: "Tata Power",
    amount: "₹1350",
    status: "Paid",
    paymentMethod: "UPI",
    date: "2025-06-10",
    timestamp: new Date("2025-06-10").getTime(),
  },
  {
    id: "BILL134",
    type: "Transport",
    vendor: "Uber",
    amount: "₹300",
    status: "Overdue",
    paymentMethod: "--",
    date: "2025-06-12",
    timestamp: new Date("2025-06-12").getTime(),
  },
  {
    id: "BILL135",
    type: "Internet",
    vendor: "Jio Fiber",
    amount: "₹899",
    status: "Pending",
    paymentMethod: "--",
    date: "2025-06-25",
    timestamp: new Date("2025-06-25").getTime(),
  },
  {
    id: "BILL136",
    type: "Subscription",
    vendor: "Hotstar",
    amount: "₹299",
    status: "Paid",
    paymentMethod: "Card",
    date: "2025-06-19",
    timestamp: new Date("2025-06-19").getTime(),
  },
  {
    id: "BILL137",
    type: "Entertainment",
    vendor: "PVR Cinemas",
    amount: "₹800",
    status: "Pending",
    paymentMethod: "--",
    date: "2025-06-26",
    timestamp: new Date("2025-06-26").getTime(),
  },
  {
    id: "BILL138",
    type: "Shopping",
    vendor: "Flipkart",
    amount: "₹1750",
    status: "Overdue",
    paymentMethod: "--",
    date: "2025-06-11",
    timestamp: new Date("2025-06-11").getTime(),
  },
  {
    id: "BILL139",
    type: "Bills",
    vendor: "BBMP",
    amount: "₹250",
    status: "Paid",
    paymentMethod: "UPI",
    date: "2025-06-18",
    timestamp: new Date("2025-06-18").getTime(),
  },
  {
    id: "BILL140",
    type: "Food",
    vendor: "McDonald’s",
    amount: "₹280",
    status: "Pending",
    paymentMethod: "--",
    date: "2025-06-22",
    timestamp: new Date("2025-06-22").getTime(),
  },
  {
    id: "BILL141",
    type: "Electricity",
    vendor: "Reliance Energy",
    amount: "₹890",
    status: "Overdue",
    paymentMethod: "--",
    date: "2025-06-14",
    timestamp: new Date("2025-06-14").getTime(),
  },
  {
    id: "BILL142",
    type: "Transport",
    vendor: "BMTC Pass",
    amount: "₹950",
    status: "Paid",
    paymentMethod: "Netbanking",
    date: "2025-06-16",
    timestamp: new Date("2025-06-16").getTime(),
  },
];


const allTypes = [...new Set(upcomingBills.map((b) => b.type))];
const allStatuses = [...new Set(upcomingBills.map((b) => b.status))];
const allVendors = [...new Set(upcomingBills.map((b) => b.vendor))];

const UpcomingBills = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [dateSort, setDateSort] = useState("desc");
//   const [dateSort, setDateSort] = useState<"asc" | "desc">("desc");
  const tableRef = useRef(null);
  const itemsPerPage = 15;

  const filteredBills = upcomingBills
    .filter((b) => {
      const typeMatch = selectedType === "All" || b.type === selectedType;
      const statusMatch =
        selectedStatus === "All" || b.status === selectedStatus;
      const vendorMatch =
        selectedVendor === "All" || b.vendor === selectedVendor;
      return typeMatch && statusMatch && vendorMatch;
    })
    .sort((a, b) => {
      return dateSort === "desc"
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp;
    });

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const currentBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case "Food":
        return <Utensils className="w-4 h-4 text-orange-500" />;
      case "Bills":
        return <Wifi className="w-4 h-4 text-blue-500" />;
      case "Shopping":
        return <ShoppingBag className="w-4 h-4 text-purple-500" />;
      case "Transport":
        return <Bus className="w-4 h-4 text-green-500" />;
      case "Entertainment":
        return <Film className="w-4 h-4 text-pink-500" />;
      case "Subscription":
        return <Smartphone className="w-4 h-4 text-teal-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "Overdue":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <ArrowUpDown className="w-4 h-4 text-blue-500" />;
    }
  };

  const toggleDateSort = () => {
    setDateSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const handleExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Transaction Report - PayVault.ai", 14, 22);

    doc.setFontSize(10);
    let filtersText = "All Transactions";
    if (selectedType !== "All" || selectedStatus !== "All") {
      filtersText = `Filters: ${
        selectedType !== "All" ? `Type: ${selectedType}` : ""
      }${selectedType !== "All" && selectedStatus !== "All" ? ", " : ""}${
        selectedStatus !== "All" ? `Status: ${selectedStatus}` : ""
      }`;
    }
    doc.text(filtersText, 14, 30);

    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

    const headers = [
      ["ID", "Type", "Vendor", "Amount", "Status", "Payment Method", "Date"],
    ];
    const data = filteredBills.map((txn) => [
      txn.id.toString(),
      txn.type,
      txn.vendor,
      txn.amount,
      txn.status,
      txn.paymentMethod,
      txn.date,
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save(
      `PayVault_Transactions_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              Recent Transactions
            </h2>
            <div className="flex items-center gap-3">

                {/* filter for types */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Types</option>
                  {allTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* filter for vendors */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  value={selectedVendor}
                  onChange={(e) => {
                    setSelectedVendor(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Vendors</option>
                  {allVendors.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* filter for statuses */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Statuses</option>
                  {allStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* export to pdf */}
              <button
                onClick={handleExport}
                className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-100"
              >
                <Download className="w-4 h-4" />
                Export to PDF
              </button>
            </div>
          </div>
    
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" ref={tableRef}>

              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={toggleDateSort}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Date
                      <ArrowUpDown className="w-3 h-3 ml-1" />
                      {dateSort === "asc" ? "↑" : "↓"}
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {currentBills.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(txn.type)}
                        <span className="text-sm font-medium">{txn.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.vendor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {txn.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(txn.status)}
                        <span className="text-sm">{txn.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredBills.length)} of{" "}
              {filteredBills.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1 rounded-md ${
                  currentPage === 1
                    ? "text-gray-400"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-1 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-400"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
  )
};

export default UpcomingBills;
