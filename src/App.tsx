import { useState } from 'react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
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
  const total = subtotal + shipping + tax + platformFee
  const isFreeShipping = Math.abs(shipping) < 0.01
  const totalSavings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0)

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      if (!formData.phone) newErrors.phone = 'Phone number is required'
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits'
    }

    if (step === 2) {
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
      if (!formData.address) newErrors.address = 'Address is required'
      if (!formData.city) newErrors.city = 'City is required'
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required'
      else if (!/^\d{5}$/.test(formData.zipCode)) newErrors.zipCode = 'ZIP code must be 5 digits'
    }

    if (step === 3 && formData.paymentMethod === 'card') {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const nextStep = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }

    setIsLoading(false)
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const placeOrder = async () => {
    if (!validateStep(3)) return

    setIsLoading(true)
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Order placed successfully! Thank you for shopping with BonziCart.')
    setIsLoading(false)
  }

  const renderStepIndicator = (stepNumber: number, label: string) => {
    return (
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
          currentStep === stepNumber 
          ? 'bg-blue-500 text-white' 
          : currentStep > stepNumber 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-600'
        }`}>
          {currentStep > stepNumber ? '✓' : stepNumber}
        </div>
        <span className="ml-2 text-sm">{label}</span>
        {stepNumber < 3 && currentStep > stepNumber && <span className="text-green-500 ml-2">✓</span>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-500 text-white py-3">
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
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Checkout Process */}
          <div className="w-full lg:w-2/3">
            {/* Steps Bar */}
            <div className="bg-white p-4 mb-4 shadow-sm">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center" onClick={() => currentStep > 1 ? setCurrentStep(1) : null}>
                  {renderStepIndicator(1, 'LOGIN')}
                </div>
                <div className="flex items-center" onClick={() => currentStep > 2 ? setCurrentStep(2) : null}>
                  {renderStepIndicator(2, 'DELIVERY ADDRESS')}
                </div>
                <div className="flex items-center">
                  {renderStepIndicator(3, 'PAYMENT OPTIONS')}
                </div>
              </div>
            </div>

            {/* Step 1: Login */}
            {currentStep === 1 && (
              <div className="bg-white p-6 shadow-sm mb-4">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h2>
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
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                          errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={nextStep}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  >
                    {isLoading ? 'Processing...' : 'CONTINUE'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Address */}
            {currentStep === 2 && (
              <div className="bg-white p-6 shadow-sm mb-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Delivery Address</h2>

                <div className="mb-4">
                  <button className="flex items-center justify-center text-blue-500 border border-blue-500 rounded p-2 hover:bg-blue-50">
                    <span className="mr-2">📍</span>
                    Use my current location
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                        errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                        errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Last Name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address (Area and Street) *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full p-2 border rounded focus:outline-none focus:ring-1 ${
                        errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                          errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                          errors.zipCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none"
                  >
                    BACK
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  >
                    {isLoading ? 'Processing...' : 'CONTINUE'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="bg-white p-6 shadow-sm mb-4">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Payment Options</h2>

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
                            errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                            errors.cardholderName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                              errors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                              errors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
                    onClick={prevStep}
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
            )}

            {/* Order Confirmation Email */}
            {currentStep === 3 && (
              <div className="bg-white p-4 shadow-sm text-sm text-gray-600">
                Order confirmation email will be sent to {formData.email || 'your email address'}
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-1/3">
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
                <div className="border-t border-gray-200 pt-3 font-medium flex justify-between">
                  <span>Total Payable</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="text-green-600 border-t border-gray-200 pt-3">
                  Your Total Savings on this order ${totalSavings.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Order Items */}
            {(currentStep === 3) && (
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
            )}

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