"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Loader2,
  User,
  Truck,
  Building2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS, BASE_URL } from "@/config/page";

interface SearchResult {
  id: number;
  name: string;
  email: string | null;
  mobile: string;
  unique_id: string;
  user_type: "shipper" | "trucker";
  company_name?: string;
  transport_name?: string;
  state_name?: string;
  images?: string | null;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export default function SearchModal({
  isOpen,
  onClose,
  initialQuery = "",
}: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<any>(
          API_ENDPOINTS.dashboard.userSearch(query)
        );
        
        const users = response.data?.users || [];
        setResults(users);
      } catch (err: any) {
        console.error("Search failed:", err);
        const errorMessage = err?.response?.status === 404 
          ? "Search endpoint not available" 
          : err?.response?.data?.message || "Search failed";
        setError(errorMessage);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.user_type === "shipper") {
      router.push(`/shippers?profile=${result.id}`);
    } else if (result.user_type === "trucker") {
      router.push(`/truckers/${result.id}`);
    }
    onClose();
  };

  const handleClose = () => {
    setQuery("");
    setResults([]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by unique ID, name, email, or phone..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              {loading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600 animate-spin" />
              )}
              {!loading && query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {error && (
              <div className="p-8 text-center">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && query && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No results found for "{query}"</p>
              </div>
            )}

            {!query && !loading && (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Start typing to search...</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="divide-y divide-gray-100">
                {results.map((result) => (
                  <motion.button
                    key={`${result.user_type}-${result.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleResultClick(result)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center gap-4 group"
                  >
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {result.images ? (
                        <img
                          src={
                            result.images.startsWith("http")
                              ? result.images
                              : `${BASE_URL}/public/${result.images}`
                          }
                          alt={result.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-white">
                          {(result.company_name || result.transport_name || result.name)
                            .substring(0, 2)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {result.company_name || result.transport_name || result.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            result.user_type === "shipper"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {result.user_type === "shipper" ? (
                            <Building2 className="h-3 w-3 inline mr-1" />
                          ) : (
                            <Truck className="h-3 w-3 inline mr-1" />
                          )}
                          {result.user_type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{result.unique_id}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {result.name}
                        </span>
                        {result.mobile && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {result.mobile.replace(/(\d{2})(\d{4})(\d{4})/, "$1****$3")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
