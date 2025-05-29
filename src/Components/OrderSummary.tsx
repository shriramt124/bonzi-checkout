interface CartItem {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    quantity: number;
    image: string;
}

interface OrderSummaryProps {
    activeTab: string;
    cartItems: CartItem[];
    changeTab: (tab: string) => void;
}

export default function OrderSummary({ activeTab, cartItems, changeTab }: OrderSummaryProps) {
    return (
        <>
            {/* Order Summary Tab - Now First */}
            <div className="vertical-tab">
                <div
                    className={`tab-header ${activeTab === "summary" ? "active" : activeTab === "contact" || activeTab === "delivery" || activeTab === "payment" ? "completed" : ""}`}
                    onClick={() => changeTab("summary")}
                >
                    <div className="tab-number">
                        {activeTab === "contact" || activeTab === "delivery" || activeTab === "payment" ? "✓" : "1"}
                    </div>
                    <div className="tab-title">Order Summary</div>
                    {(activeTab === "contact" || activeTab === "delivery" || activeTab === "payment") && (
                        <div className="tab-action">
                            {cartItems.length} items
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    changeTab("summary");
                                }}
                                className="ml-2 text-orange-500 underline"
                            >
                                Change
                            </button>
                        </div>
                    )}
                </div>
                <div
                    className={`tab-content ${activeTab === "summary" ? "active" : ""}`}
                >
                    <div className="border-t border-gray-200 pt-3">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex py-3 border-b border-gray-100"
                            >
                                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mr-3">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm">{item.name}</div>
                                    <div className="flex items-center text-sm mt-1">
                                        <span className="text-gray-800 font-medium">
                                            ${item.price.toFixed(2)}
                                        </span>
                                        <span className="text-gray-500 line-through text-xs ml-2">
                                            ${item.originalPrice.toFixed(2)}
                                        </span>
                                        <span className="text-green-600 text-xs ml-2">
                                            {Math.round((1 - item.price / item.originalPrice) * 100)}%
                                            off
                                        </span>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <span className="text-sm text-gray-600">
                                            Qty: {item.quantity}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={() => changeTab("contact")}
                            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
                        >
                            CONTINUE
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}