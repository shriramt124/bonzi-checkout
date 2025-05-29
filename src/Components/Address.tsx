

export default function Address({ activeTab, changeTab, formData, handleInputChange, errors, validateTab }) {
    return (
        <>
            <div className="vertical-tab">
                <div
                    className={`tab-header ${activeTab === "delivery" ? "active" : activeTab === "payment" ? "completed" : ""}`}
                    onClick={() => validateTab("contact") && changeTab("delivery")}
                >
                    <div className="tab-number">
                        {activeTab === "payment" ? "✓" : "3"}
                    </div>
                    <div className="tab-title">Delivery Address</div>
                    {activeTab === "payment" && formData.firstName && (
                        <div className="tab-action">
                            {formData.firstName} {formData.lastName}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    changeTab("delivery");
                                }}
                                className="ml-2 text-orange-500 underline"
                            >
                                Change
                            </button>
                        </div>
                    )}
                </div>
                <div
                    className={`tab-content ${activeTab === "delivery" ? "active" : ""}`}
                >
                    <div className="mb-4">
                        <button className="flex items-center justify-center text-orange-500 border border-orange-500 rounded p-2 hover:bg-orange-50 w-full sm:w-auto">
                            <span className="mr-2">📍</span>
                            Use my current location
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name *
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${errors.firstName
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-orange-500"
                                    }`}
                                placeholder="First Name"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.firstName}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name *
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${errors.lastName
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-orange-500"
                                    }`}
                                placeholder="Last Name"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address (Area and Street) *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${errors.address
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-orange-500"
                                    }`}
                                placeholder="House No., Building Name, Street Name, Area"
                                rows={2}
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="Locality *"
                                    type="text"
                                    name="locality"
                                    value={formData.locality}
                                    onChange={handleInputChange}
                                    placeholder="Locality"
                                />
                            </div>
                            <div>
                                <Input
                                    label="Landmark (Optional)"
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleInputChange}
                                    placeholder="Landmark"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="City/District/Town *"
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    error={errors.city}
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <Input
                                    label="Pincode *"
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    error={errors.zipCode}
                                    placeholder="Pincode"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State *
                            </label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                            >
                                <option value="Alabama">Alabama</option>
                                <option value="Alaska">Alaska</option>
                                <option value="Arizona">Arizona</option>
                                <option value="California">California</option>
                                <option value="Colorado">Colorado</option>
                                <option value="Florida">Florida</option>
                                <option value="Texas">Texas</option>
                                <option value="Washington">Washington</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => changeTab("contact")}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                        >
                            BACK
                        </button>
                        <button
                            onClick={() => changeTab("payment")}
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