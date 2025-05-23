import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('contact')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    locality: '',
    city: '',
    zipCode: '',
    state: 'California',
    landmark: '',
    country: 'United States',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    promoCode: ''
  })

  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [showOrderSummary, setShowOrderSummary] = useState(false)

  const cartItems = [
    {
      id: 1,
      name: 'Luminous Crystal Ball Night Light with USB',
      price: 112.54,
      originalPrice: 149.99,
      quantity: 1,
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'Self Mixing Electric Auto Stirring Mug',
      price: 34.50,
      originalPrice: 49.99,
      quantity: 2,
      image: '/api/placeholder/80/80'
    }
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 9.99
  const tax = subtotal * 0.08
  const platformFee = 3.99
  const discount = couponApplied ? couponDiscount : 0
  const total = subtotal + shipping + tax + platformFee - discount
  const isFreeShipping = Math.abs(shipping) < 0.01
  const totalSavings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0) + discount

  const applyCoupon = () => {
    if (!couponCode) return

    // Simple coupon logic - in real app this would validate against a database
    if (couponCode.toUpperCase() === 'SAVE10') {
      setCouponDiscount(subtotal * 0.1) // 10% discount
      setCouponApplied(true)
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      setCouponDiscount(shipping) // Free shipping
      setCouponApplied(true)
    } else if (couponCode.toUpperCase() === 'BONZI25') {
      setCouponDiscount(25) // $25 off
      setCouponApplied(true)
    } else {
      alert('Invalid coupon code')
    }
  }

  const removeCoupon = () => {
    setCouponCode('')
    setCouponDiscount(0)
    setCouponApplied(false)
  }

  const toggleOrderSummary = () => {
    setShowOrderSummary(!showOrderSummary)
  }

  // Validation functions
  const validateTab = (tab: string): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (tab === 'contact') {
      if (!formData.email) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      if (!formData.phone) newErrors.phone = 'Phone number is required'
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits'
    }

    if (tab === 'delivery') {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.address) newErrors.address = 'Address is required'
      if (!formData.city) newErrors.city = 'City is required'
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required'
      else if (!/^\d{5}$/.test(formData.zipCode)) newErrors.zipCode = 'ZIP code must be 5 digits'
    }

    if (tab === 'payment' && formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required'
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number'
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required'
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Invalid format (MM/YY)'
      if (!formData.cvv) newErrors.cvv = 'CVV is required'
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'Invalid CVV'
      if (!formData.cardholderName) newErrors.cardholderName = 'Cardholder name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
      setFormData({ ...formData, [name]: formatted })
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
      setFormData({ ...formData, [name]: formatted })
    }
    // Format CVV (numbers only)
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '')
      setFormData({ ...formData, [name]: formatted })
    }
    // Format ZIP code (numbers only, max 5 digits)
    else if (name === 'zipCode') {
      const formatted = value.replace(/\D/g, '').slice(0, 5)
      setFormData({ ...formData, [name]: formatted })
    }
    // Format phone (numbers only, max 10 digits)
    else if (name === 'phone') {
      const formatted = value.replace(/\D/g, '').slice(0, 10)
      setFormData({ ...formData, [name]: formatted })
    }
    else {
      setFormData({ ...formData, [name]: value })
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const changeTab = (tab: string) => {
    const currentTab = activeTab

    // Validate current tab before changing
    if (validateTab(currentTab)) {
      setActiveTab(tab)
    }
  }

  const placeOrder = async () => {
    if (!validateTab('payment')) return

    setIsLoading(true)
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Order placed successfully! Thank you for shopping with BonziCart.')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-orange-500 text-white py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="text-xl font-bold">BonziCart</div>
            <div className="ml-auto flex items-center text-sm">
              <span className="mr-2">🔒</span>
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Order Summary Toggle */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={toggleOrderSummary}
            className="w-full p-3 bg-orange-50 border border-orange-200 rounded flex justify-between items-center"
          >
            <span className="font-medium">
              {showOrderSummary ? 'Hide Order Summary' : 'Show Order Summary'}
            </span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </button>
        </div>

        {/* Mobile Order Summary (Collapsible) */}
        {showOrderSummary && (
          <div className="lg:hidden mb-4 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-3">ORDER SUMMARY</h3>
            <div className="border-t border-gray-200 pt-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex py-3 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm">{item.name}</div>
                    <div className="flex items-center text-sm mt-1">
                      <span className="text-gray-800 font-medium">${item.price.toFixed(2)}</span>
                      <span className="text-gray-500 line-through text-xs ml-2">${item.originalPrice.toFixed(2)}</span>
                      <span className="text-green-600 text-xs ml-2">
                        {Math.round((1 - item.price/item.originalPrice) * 100)}% off
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm mt-1">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Platform Fee:</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base mt-3 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Checkout Process */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white shadow-sm rounded mb-4">
              <style>
                {`
                  .checkout-container {
                    display: flex;
                    flex-direction: column;
                  }
                  
                  .vertical-tabs {
                    width: 100%;
                  }
                  
                  .vertical-tab {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    border-bottom: 1px solid #e5e7eb;
                    overflow: hidden;
                  }
                  
                  .vertical-tab:last-child {
                    border-bottom: none;
                  }
                  
                  .tab-header {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    cursor: pointer;
                    background-color: white;
                    transition: background-color 0.2s ease;
                  }
                  
                  .tab-header.active {
                    background-color: #fff7ed;
                  }
                  
                  .tab-header.completed {
                    background-color: #f1f5f9;
                  }
                  
                  .tab-number {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    background-color: #e5e7eb;
                    color: #4b5563;
                    margin-right: 1rem;
                    font-weight: 600;
                  }
                  
                  .tab-header.active .tab-number {
                    background-color: #f97316;
                    color: white;
                  }
                  
                  .tab-header.completed .tab-number {
                    background-color: #22c55e;
                    color: white;
                  }
                  
                  .tab-title {
                    font-weight: 600;
                    flex: 1;
                  }
                  
                  .tab-header.active .tab-title {
                    color: #f97316;
                  }
                  
                  .tab-header.completed .tab-title {
                    color: #22c55e;
                  }
                  
                  .tab-content {
                    padding: 1rem;
                    border-top: 1px solid #e5e7eb;
                    display: none;
                  }
                  
                  .tab-content.active {
                    display: block;
                  }
                  
                  .tab-action {
                    margin-left: auto;
                    font-size: 0.875rem;
                    color: #3b82f6;
                  }
                  
                  @media (max-width: 640px) {
                    .tab-number {
                      width: 1.5rem;
                      height: 1.5rem;
                      font-size: 0.75rem;
                    }
                    
                    .tab-title {
                      font-size: 0.875rem;
                    }
                  }
                `}
              </style>
              
              <div className="checkout-container">
                <div className="vertical-tabs">
                  {/* Contact Information Tab */}
                  <div className="vertical-tab">
                    <div 
                      className={`tab-header ${activeTab === 'contact' ? 'active' : activeTab === 'delivery' || activeTab === 'summary' || activeTab === 'payment' ? 'completed' : ''}`}
                      onClick={() => changeTab('contact')}
                    >
                      <div className="tab-number">
                        {activeTab === 'delivery' || activeTab === 'summary' || activeTab === 'payment' ? '✓' : '1'}
                      </div>
                      <div className="tab-title">Contact Information</div>
                      {(activeTab === 'delivery' || activeTab === 'summary' || activeTab === 'payment') && formData.email && (
                        <div className="tab-action">
                          {formData.email}
                          <button 
                            onClick={(e) => { e.stopPropagation(); changeTab('contact'); }} 
                            className="ml-2 text-orange-500 underline"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={`tab-content ${activeTab === 'contact' ? 'active' : ''}`}>
              <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                            }`}
                            placeholder="example@email.com"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                            }`}
                            placeholder="10-digit mobile number"
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() => changeTab('delivery')}
                          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
                        >
                          CONTINUE
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Tab */}
                  <div className="vertical-tab">
                    <div 
                      className={`tab-header ${activeTab === 'delivery' ? 'active' : activeTab === 'summary' || activeTab === 'payment' ? 'completed' : ''}`}
                      onClick={() => validateTab('contact') && changeTab('delivery')}
                    >
                      <div className="tab-number">
                        {activeTab === 'summary' || activeTab === 'payment' ? '✓' : '2'}
                      </div>
                      <div className="tab-title">Delivery Address</div>
                      {(activeTab === 'summary' || activeTab === 'payment') && formData.firstName && (
                        <div className="tab-action">
                          {formData.firstName} {formData.lastName}
                          <button 
                            onClick={(e) => { e.stopPropagation(); changeTab('delivery'); }} 
                            className="ml-2 text-orange-500 underline"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={`tab-content ${activeTab === 'delivery' ? 'active' : ''}`}>

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
                            className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                              errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                            }`}
                            placeholder="First Name"
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
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
                            className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                              errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                            }`}
                            placeholder="Last Name"
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
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
                            className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                              errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                            }`}
                            placeholder="House No., Building Name, Street Name, Area"
                            rows={2}
                          />
                          {errors.address && (
                            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Locality *
                            </label>
                            <input
                              type="text"
                              name="locality"
                              value={formData.locality}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                              placeholder="Locality"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Landmark (Optional)
                            </label>
                            <input
                              type="text"
                              name="landmark"
                              value={formData.landmark}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                              placeholder="Landmark"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City/District/Town *
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                                errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                              }`}
                              placeholder="City"
                            />
                            {errors.city && (
                              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pincode *
                            </label>
                            <input
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleInputChange}
                              className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                                errors.zipCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                              }`}
                              placeholder="Pincode"
                            />
                            {errors.zipCode && (
                              <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                            )}
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
                          onClick={() => changeTab('contact')}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                        >
                          BACK
                        </button>
                        <button
                          onClick={() => changeTab('summary')}
                          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
                        >
                          CONTINUE
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary Tab */}
                  <div className="vertical-tab">
                    <div 
                      className={`tab-header ${activeTab === 'summary' ? 'active' : activeTab === 'payment' ? 'completed' : ''}`}
                      onClick={() => validateTab('delivery') && changeTab('summary')}
                    >
                      <div className="tab-number">
                        {activeTab === 'payment' ? '✓' : '3'}
                      </div>
                      <div className="tab-title">Order Summary</div>
                      {activeTab === 'payment' && (
                        <div className="tab-action">
                          {cartItems.length} items
                          <button 
                            onClick={(e) => { e.stopPropagation(); changeTab('summary'); }} 
                            className="ml-2 text-orange-500 underline"
                          >
                            Change
                          </button>
                        </div>
                      )}
                    </div>
                    <div className={`tab-content ${activeTab === 'summary' ? 'active' : ''}`}>

              <div className="border-t border-gray-200 pt-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex py-3 border-b border-gray-100">
                            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mr-3">
                              <span className="text-2xl">📦</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm">{item.name}</div>
                              <div className="flex items-center text-sm mt-1">
                                <span className="text-gray-800 font-medium">${item.price.toFixed(2)}</span>
                                <span className="text-gray-500 line-through text-xs ml-2">${item.originalPrice.toFixed(2)}</span>
                                <span className="text-green-600 text-xs ml-2">
                                  {Math.round((1 - item.price/item.originalPrice) * 100)}% off
                                </span>
                              </div>
                              <div className="flex items-center mt-2">
                                <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {couponApplied && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount:</span>
                            <span>-${couponDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm mt-1">
                          <span>Shipping:</span>
                          <span>${shipping.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Tax:</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>Platform Fee:</span>
                          <span>${platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-base mt-3 pt-2 border-t border-gray-200">
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Coupon Code Section */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center mb-3">
                          <div className="text-orange-500 mr-2">🏷️</div>
                          <h3 className="text-md font-medium text-gray-800">APPLY COUPON</h3>
                        </div>
                        {!couponApplied ? (
                          <div className="flex">
                            <input
                              type="text"
                              placeholder="Enter coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <button
                              onClick={applyCoupon}
                              className="bg-orange-500 text-white px-4 py-2 rounded-r hover:bg-orange-600"
                            >
                              APPLY
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-green-50 p-3 rounded">
                            <div>
                              <div className="text-green-700 font-medium">{couponCode.toUpperCase()}</div>
                              <div className="text-green-600 text-sm">${couponDiscount.toFixed(2)} discount applied</div>
                            </div>
                            <button 
                              onClick={removeCoupon}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          Try: SAVE10, FREESHIP, BONZI25
                        </div>
                      </div>

                      <div className="flex justify-between mt-6">
                        <button
                          onClick={() => changeTab('delivery')}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                        >
                          BACK
                        </button>
                        <button
                          onClick={() => changeTab('payment')}
                          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
                        >
                          CONTINUE
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Options Tab */}
                  <div className="vertical-tab">
                    <div 
                      className={`tab-header ${activeTab === 'payment' ? 'active' : ''}`}
                      onClick={() => validateTab('summary') && changeTab('payment')}
                    >
                      <div className="tab-number">4</div>
                      <div className="tab-title">Payment Options</div>
                    </div>
                    <div className={`tab-content ${activeTab === 'payment' ? 'active' : ''}`}>

              {isLoading && (
                        <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded">
                          Complete payment in: 00:15:00
                        </div>
                      )}

                      <div className="space-y-3 mb-6">
                        <div className="border border-gray-300 rounded p-3 flex items-center">
                          <input
                            type="radio"
                            id="payment_upi"
                            name="paymentMethod"
                            value="upi"
                            checked={formData.paymentMethod === 'upi'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                            className="mr-3"
                          />
                          <label htmlFor="payment_upi" className="flex-1">
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-gray-500">Pay using UPI Apps</div>
                          </label>
                        </div>

                        <div className="border border-gray-300 rounded p-3 flex items-center">
                          <input
                            type="radio"
                            id="payment_card"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === 'card'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                            className="mr-3"
                          />
                          <label htmlFor="payment_card" className="flex-1">
                            <div className="font-medium">Credit / Debit / ATM Card</div>
                            <div className="text-sm text-gray-500">Add and secure cards as per guidelines</div>
                          </label>
                        </div>

                        <div className="border border-gray-300 rounded p-3 flex items-center">
                          <input
                            type="radio"
                            id="payment_netbanking"
                            name="paymentMethod"
                            value="netbanking"
                            checked={formData.paymentMethod === 'netbanking'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'netbanking' })}
                            className="mr-3"
                          />
                          <label htmlFor="payment_netbanking" className="flex-1">
                            <div className="font-medium">Net Banking</div>
                            <div className="text-sm text-gray-500">Pay through your bank account</div>
                          </label>
                        </div>

                        <div className="border border-gray-300 rounded p-3 flex items-center">
                          <input
                            type="radio"
                            id="payment_cod"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                            className="mr-3"
                          />
                          <label htmlFor="payment_cod" className="flex-1">
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-gray-500">Pay when you receive your order</div>
                          </label>
                        </div>
                      </div>

                      {formData.paymentMethod === 'card' && (
                        <div className="border border-gray-200 rounded p-4 mb-6 bg-gray-50">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number *
                              </label>
                              <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                                  errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                                }`}
                                placeholder="Card Number"
                                maxLength={19}
                              />
                              {errors.cardNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name on Card *
                              </label>
                              <input
                                type="text"
                                name="cardholderName"
                                value={formData.cardholderName}
                                onChange={handleInputChange}
                                className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                                  errors.cardholderName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                                }`}
                                placeholder="Name on Card"
                              />
                              {errors.cardholderName && (
                                <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Expiry Date *
                                </label>
                                <input
                                  type="text"
                                  name="expiryDate"
                                  value={formData.expiryDate}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                                    errors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                                  }`}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                />
                                {errors.expiryDate && (
                                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  CVV *
                                </label>
                                <input
                                  type="text"
                                  name="cvv"
                                  value={formData.cvv}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                                    errors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                                  }`}
                                  placeholder="CVV"
                                  maxLength={4}
                                />
                                {errors.cvv && (
                                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <button
                          onClick={() => changeTab('summary')}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                        >
                          BACK
                        </button>
                        <button
                          onClick={placeOrder}
                          disabled={isLoading}
                          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none"
                        >
                          {isLoading ? 'Processing...' : 'PLACE ORDER'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Confirmation Email */}
              {activeTab === 'payment' && (
                <div className="bg-white p-4 shadow-sm text-sm text-gray-600 mt-4">
                  Order confirmation email will be sent to {formData.email || 'your email address'}
                </div>
              )}
            </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-1/3 hidden lg:block">
            {/* Price Details */}
            <div className="bg-white p-4 shadow-sm mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">PRICE DETAILS</h3>
              <div className="border-t border-gray-200 pt-3 space-y-3">
                <div className="flex justify-between">
                  <span>Price ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={isFreeShipping ? "text-green-600" : ""}>
                    {isFreeShipping ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>${platformFee.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 font-medium flex justify-between">
                  <span>Total Payable</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="text-green-600 border-t border-gray-200 pt-3">
                  Your Total Savings on this order ${totalSavings.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Order Items - Show on all steps */}
            <div className="bg-white p-4 shadow-sm mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">ORDER SUMMARY</h3>
              <div className="border-t border-gray-200 pt-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex py-3 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mr-3">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{item.name}</div>
                      <div className="flex items-center text-sm mt-1">
                        <span className="text-gray-800 font-medium">${item.price.toFixed(2)}</span>
                        <span className="text-gray-500 line-through text-xs ml-2">${item.originalPrice.toFixed(2)}</span>
                        <span className="text-green-600 text-xs ml-2">
                          {Math.round((1 - item.price/item.originalPrice) * 100)}% off
                        </span>
                      </div>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-white p-4 shadow-sm">
              <div className="flex items-start">
                <div className="mr-3 text-green-600">🔒</div>
                <div>
                  <p className="text-sm text-gray-800">Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
                </div>
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
  )
}

export default App