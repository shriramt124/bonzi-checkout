import { useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import OrderSummary from "./Components/OrderSummary";
import Input from "./ui/Input"; // Import the new Input component

function App() {
  const [activeTab, setActiveTab] = useState("summary"); // Keep summary as default
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    hasGST: false,
    companyName: "",
    gstNumber: "",
    address: "",
    locality: "",
    city: "",
    zipCode: "",
    state: "California",
    landmark: "",
    country: "United States",
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    promoCode: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const cartItems = [
    {
      id: 1,
      name: "Luminous Crystal Ball Night Light with USB",
      price: 112.54,
      originalPrice: 149.99,
      quantity: 1,
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      name: "Self Mixing Electric Auto Stirring Mug",
      price: 34.5,
      originalPrice: 49.99,
      quantity: 2,
      image: "/api/placeholder/80/80",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const platformFee = 3.99;
  const discount = couponApplied ? couponDiscount : 0;
  const total = subtotal + shipping + tax + platformFee - discount;
  const isFreeShipping = Math.abs(shipping) < 0.01;
  const totalSavings =
    cartItems.reduce(
      (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
      0,
    ) + discount;

  const applyCoupon = () => {
    if (!couponCode) return;

    // Coupon logic with new codes
    switch (couponCode.toUpperCase()) {
      case 'MMTSECURE':
        setCouponDiscount(10);
        setCouponApplied(true);
        break;
      case 'MMTRBLEMI':
        setCouponDiscount(15);
        setCouponApplied(true);
        break;
      case 'MMTSUPER':
        setCouponDiscount(20);
        setCouponApplied(true);
        break;
      case 'SAVE10':
        setCouponDiscount(subtotal * 0.1); // 10% discount
        setCouponApplied(true);
        break;
      case 'FREESHIP':
        setCouponDiscount(shipping); // Free shipping
        setCouponApplied(true);
        break;
      case 'BONZI25':
        setCouponDiscount(25); // $25 off
        setCouponApplied(true);
        break;
      default:
        alert('Invalid coupon code');
        break;
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponApplied(false);
  };

  const toggleOrderSummary = () => {
    setShowOrderSummary(!showOrderSummary);
  };

  // Validation functions
  const validateTab = (tab: string): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (tab === "contact") {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Phone number must be 10 digits";
      if (formData.hasGST) {
        if (!formData.companyName) newErrors.companyName = "Company name is required";
        if (!formData.gstNumber) newErrors.gstNumber = "GST number is required";
        else if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(formData.gstNumber))
          newErrors.gstNumber = "Invalid GST number format";
      }
    }

    if (tab === "delivery") {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
      else if (!/^\d{5}$/.test(formData.zipCode))
        newErrors.zipCode = "ZIP code must be 5 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ");
      setFormData({ ...formData, [name]: formatted });
    }
    // Format expiry date
    else if (name === "expiryDate") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2");
      setFormData({ ...formData, [name]: formatted });
    }
    // Format CVV (numbers only)
    else if (name === "cvv") {
      const formatted = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: formatted });
    }
    // Format ZIP code (numbers only, max 5 digits)
    else if (name === "zipCode") {
      const formatted = value.replace(/\D/g, "").slice(0, 5);
      setFormData({ ...formData, [name]: formatted });
    }
    // Format phone (numbers only, max 10 digits)
    else if (name === "phone") {
      const formatted = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const changeTab = (tab: string) => {
    const currentTab = activeTab;

    // Validate current tab before changing (except for summary which doesn't need validation)
    if (currentTab !== "summary" && !validateTab(currentTab)) {
      return;
    }

    setActiveTab(tab);
  };

  const placeOrder = async () => {
    if (!validateTab("payment")) return;

    setIsLoading(true);
    // Simulate order placement
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Order placed successfully! Thank you for shopping with BonziCart.");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Order Summary Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={toggleOrderSummary}
            className="w-full p-3 bg-orange-50 border border-orange-200 rounded flex justify-between items-center"
          >
            <span className="font-medium">
              {showOrderSummary ? "Hide Order Summary" : "Show Order Summary"}
            </span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </button>
        </div>

        {/* Mobile Order Summary (Collapsible) */}
        {showOrderSummary && (
          <div className="lg:hidden mb-4 bg-white p-4 shadow-sm">


            {/* Price Details */}
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                PRICE DETAILS
              </h3>
              <div className="border-t border-gray-200 pt-3 space-y-3">
                <div className="flex justify-between text-sm md:text-base">
                  <span>
                    Price ({cartItems.length} item
                    {cartItems.length !== 1 ? "s" : ""})
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span>Delivery Charges</span>
                  <span className={isFreeShipping ? "text-green-600" : ""}>
                    {isFreeShipping ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span>Platform Fee</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-green-600 text-sm md:text-base">
                    <span>Coupon Discount</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 font-medium flex justify-between text-sm md:text-base">
                  <span>Total Payable</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="text-green-600 text-sm border-t border-gray-200 pt-3">
                  Your Total Savings on this order ${totalSavings.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  changeTab("summary");
                  setShowOrderSummary(false); // Close mobile summary after navigating
                }}
                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
              >
                VIEW DETAILS
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Order Summary and Checkout Process */}
          <div className="w-full lg:w-2/3">
            {/* Checkout Process */}
            <div className="bg-white shadow-sm rounded mb-4">
              <div className="checkout-container">
                <div className="vertical-tabs">
                  <OrderSummary activeTab="summary" cartItems={cartItems} changeTab={changeTab} />

                  {/* Contact Information Tab - Now Second */}
                  <div className="vertical-tab">
                    <div
                      className={`tab-header ${activeTab === "contact" ? "active" : activeTab === "delivery" || activeTab === "payment" ? "completed" : ""}`}
                      onClick={() => changeTab("contact")}
                    >
                      <div className="tab-number">
                        {activeTab === "delivery" || activeTab === "payment" ? "✓" : "2"}
                      </div>
                      <div className="tab-title">Contact Information</div>
                      {(activeTab === "delivery" || activeTab === "payment") &&
                        formData.email && (
                          <div className="tab-action">
                            {formData.email}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                changeTab("contact");
                              }}
                              className="ml-2 text-orange-500 underline"
                            >
                              Change
                            </button>
                          </div>
                        )}
                    </div>
                    <div
                      className={`tab-content ${activeTab === "contact" ? "active" : ""}`}
                    >
                      <div className="space-y-4">

                        <div>
                          <Input
                            label="Email Address *"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            error={errors.email}
                            placeholder="example@email.com"
                          />
                        </div>
                        <div>
                          <Input
                            label="Phone Number *"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            error={errors.phone}
                            placeholder="10-digit mobile number"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="flex items-center text-sm text-gray-700 mb-2">
                            <input
                              type="checkbox"
                              checked={formData.hasGST}
                              onChange={(e) => setFormData({ ...formData, hasGST: e.target.checked })}
                              className="mr-2"
                            />
                            I have a GST number (Optional)
                          </label>
                          {formData.hasGST && (
                            <div className="space-y-3 mt-3">
                              <div>
                                <Input
                                  label="Company Name *"
                                  type="text"
                                  name="companyName"
                                  value={formData.companyName}
                                  onChange={handleInputChange}
                                  error={errors.companyName}
                                  placeholder="Enter company name"
                                />
                              </div>
                              <div>
                                <Input
                                  label="GST Number *"
                                  type="text"
                                  name="gstNumber"
                                  value={formData.gstNumber}
                                  onChange={handleInputChange}
                                  error={errors.gstNumber}
                                  placeholder="Enter GST number"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => changeTab("summary")}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                        >
                          BACK
                        </button>
                        <button
                          onClick={() => changeTab("delivery")}
                          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
                        >
                          CONTINUE
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Tab - Now Third */}
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

                  {/* Payment Options Tab - Now Fourth */}
                  <div className="vertical-tab">
                    <div
                      className={`tab-header ${activeTab === "payment" ? "active" : ""}`}
                      onClick={() => validateTab("delivery") && changeTab("payment")}
                    >
                      <div className="tab-number">4</div>
                      <div className="tab-title">Payment Options</div>
                    </div>
                    <div
                      className={`tab-content ${activeTab === "payment" ? "active" : ""}`}
                    >
                      {isLoading && (
                        <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded">
                          Complete payment in: 00:15:00
                        </div>
                      )}

                      <div className="flex justify-between">
                        <button
                          onClick={() => changeTab("delivery")}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                        >
                          BACK
                        </button>
                        <button
                          onClick={placeOrder}
                          disabled={isLoading}
                          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
                        >
                          {isLoading ? "Processing..." : "PLACE ORDER"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Confirmation Email */}
              {activeTab === "payment" && (
                <div className="bg-white p-4 shadow-sm text-sm text-gray-600 mt-4">
                  Order confirmation email will be sent to{" "}
                  {formData.email || "your email address"}
                </div>
              )}
            </div>
          </div>
          {/* Right Column - Price Details and Coupon */}
          <div className="w-full lg:w-1/3 hidden lg:block">
            {/* Price Details and Coupon Section */}
            <div className="bg-white p-4 shadow-sm mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                PRICE DETAILS
              </h3>
              <div className="border-t border-gray-200 pt-3 space-y-3">
                <div className="flex justify-between text-sm md:text-base">
                  <span>
                    Price ({cartItems.length} item
                    {cartItems.length !== 1 ? "s" : ""})
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span>Delivery Charges</span>
                  <span className={isFreeShipping ? "text-green-600" : ""}>
                    {isFreeShipping ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span>Platform Fee</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>



                {couponApplied && (
                  <div className="flex justify-between text-green-600 text-sm md:text-base">
                    <span>Coupon Discount</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 font-medium flex justify-between text-sm md:text-base">
                  <span>Total Payable</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="text-green-600 text-sm border-t border-gray-200 pt-3">
                  Your Total Savings on this order ${totalSavings.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-white p-4 shadow-sm">
              {/* Coupon Code Section */}
              <div className="border-t border-gray-200 pt-3">

                {!couponApplied ? (
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="text-orange-500 mr-2">🏷️</div>
                      <h3 className="text-sm font-medium text-gray-800">
                        APPLY COUPON
                      </h3>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        onClick={applyCoupon}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-500 text-sm font-medium hover:text-orange-600"
                      >
                        APPLY
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="border border-gray-200 rounded-lg divide-y">
                        <div
                          className="p-3 cursor-pointer hover:bg-gray-50 flex items-center"
                          onClick={() => {
                            setCouponCode('MMTSECURE');
                            applyCoupon();
                          }}
                        >
                          <input
                            type="radio"
                            checked={couponCode === 'MMTSECURE'}
                            onChange={() => {
                              setCouponCode('MMTSECURE');
                              applyCoupon();
                            }}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">MMTSECURE</div>
                            <div className="text-xs text-gray-500">Get an instant discount of $10 on your order</div>
                          </div>
                          <div className="text-orange-500 text-sm">$10 OFF</div>
                        </div>
                        <div
                          className="p-3 cursor-pointer hover:bg-gray-50 flex items-center"
                          onClick={() => {
                            setCouponCode('MMTRBLEMI');
                            applyCoupon();
                          }}
                        >
                          <input
                            type="radio"
                            checked={couponCode === 'MMTRBLEMI'}
                            onChange={() => {
                              setCouponCode('MMTRBLEMI');
                              applyCoupon();
                            }}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">MMTRBLEMI</div>
                            <div className="text-xs text-gray-500">Get $15 instant discount on your RBL Bank Credit Card NC EMI</div>
                          </div>
                          <div className="text-orange-500 text-sm">$15 OFF</div>
                        </div>
                        <div
                          className="p-3 cursor-pointer hover:bg-gray-50 flex items-center"
                          onClick={() => {
                            setCouponCode('MMTSUPER');
                            applyCoupon();
                          }}
                        >
                          <input
                            type="radio"
                            checked={couponCode === 'MMTSUPER'}
                            onChange={() => {
                              setCouponCode('MMTSUPER');
                              applyCoupon();
                            }}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">MMTSUPER</div>
                            <div className="text-xs text-gray-500">Get up to $20 instant discount on your booking</div>
                          </div>
                          <div className="text-orange-500 text-sm">$20 OFF</div>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-3 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-green-700 font-medium text-sm">
                          {couponCode.toUpperCase()}
                        </div>
                        <div className="text-green-600 text-xs">
                          ${couponDiscount.toFixed(2)} discount applied
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-4 text-center text-sm mt-6">
        <p>© 2023 BonziCart. All rights reserved.</p>
      </footer>
    </div>
  );


}

export default App;


