export function RibbonCard() {
    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md p-6 max-w-md">
            {/* Top-right diagonal ribbon */}
            <div className="absolute -top-1 -right-1">
                <div className="relative">
                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                        <div className="absolute top-6 -right-8 w-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center font-bold text-sm py-2 transform rotate-45 shadow-lg">
                            BEST BID
                        </div>
                    </div>
                </div>
            </div>

            {/* Card content */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Card Title</h3>
                <p className="text-gray-600">
                    This is a sample card with a premium diagonal ribbon in the top-right corner.
                </p>
                <div className="flex items-center justify-between pt-4">
                    <span className="text-2xl font-bold text-gray-900">₹3,40,000</span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}
