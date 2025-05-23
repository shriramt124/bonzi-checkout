import { useState } from 'react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isAnimating, setIsAnimating] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '', // Added cardholderName
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
  const total = subtotal + shipping + tax
  const isFreeShipping = Math.abs(shipping) < 0.01 // Check if shipping is effectively zero

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
      if (!formData.firstName) newErrors.firstName = 'First name is required'
      if (!formData.lastName) newErrors.lastName = 'Last name is required'
    }

    if (step === 2) {
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
      if (!formData.cardholderName) newErrors.cardholderName = 'Cardholder name is required' // Added cardholderName validation
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
    // Handle cardholder name (no specific formatting for now)
    else if (name === 'cardholderName') {
      setFormData({ ...formData, [name]: value })
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

    setIsAnimating(true)
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }

    setIsLoading(false)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 150)
    }
  }

  const placeOrder = async () => {
    if (!validateStep(3)) return

    setIsLoading(true)
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('🎉 Order placed successfully! Thank you for shopping with BonziCart!')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 rounded-xl font-bold text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-all duration-200">
                🛒 BonziCart
              </div>
              <div className="hidden sm:block w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                <span className="text-green-500">🔒</span>
                <span className="hidden sm:inline">Secure Checkout</span>
                <span className="sm:hidden">Secure</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500">
                <span>💳</span>
                <span>SSL Protected</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 transform ${currentStep >= step
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-110'
                      : currentStep === step - 1
                        ? 'bg-orange-100 text-orange-600 border-2 border-orange-300 animate-pulse'
                        : 'bg-gray-200 text-gray-600'
                      }`}>
                      {currentStep > step ? (
                        <span className="animate-bounce">✓</span>
                      ) : (
                        <span className={currentStep === step ? 'animate-pulse' : ''}>{step}</span>
                      )}
                    </div>
                    <div className={`mt-2 text-xs sm:text-sm font-medium transition-colors duration-300 text-center ${currentStep >= step ? 'text-orange-600' : 'text-gray-500'
                      }`}>
                      <span className="hidden sm:inline">
                        {step === 1 && 'Contact Info'}
                        {step === 2 && 'Shipping'}
                        {step === 3 && 'Payment'}
                      </span>
                      <span className="sm:hidden">
                        {step === 1 && 'Info'}
                        {step === 2 && 'Ship'}
                        {step === 3 && 'Pay'}
                      </span>
                    </div>
                  </div>
                  {step < 3 && (
                    <div className="flex-1 mx-2 sm:mx-4 h-0.5 relative">
                      <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                      <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-700 transform origin-left ${currentStep > step ? 'scale-x-100' : 'scale-x-0'
                        }`}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-7">
            <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 transition-all duration-500 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-600 font-medium">Processing...</p>
                  </div>
                </div>
              )}
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="animate-fadeIn">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Information</h2>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base ${errors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : formData.email
                              ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                            } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                          placeholder="john@example.com"
                        />
                        {formData.email && !errors.email && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                            ✓
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base ${errors.firstName
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : formData.firstName
                                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                              } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                            placeholder="John"
                          />
                          {formData.firstName && !errors.firstName && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                              ✓
                            </div>
                          )}
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base ${errors.lastName
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : formData.lastName
                                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                              } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                            placeholder="Doe"
                          />
                          {formData.lastName && !errors.lastName && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                              ✓
                            </div>
                          )}
                        </div>
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div className="animate-fadeIn">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Shipping Address</h2>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base ${errors.address
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : formData.address
                              ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                            } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                          placeholder="123 Main Street, Apt 4B"
                        />
                        {formData.address && !errors.address && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                            ✓
                          </div>
                        )}
                      </div>
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.address}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base ${errors.city
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : formData.city
                                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                              } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                            placeholder="New York"
                          />
                          {formData.city && !errors.city && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                              ✓
                            </div>
                          )}
                        </div>
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base ${errors.zipCode
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : formData.zipCode
                                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                              } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                            placeholder="10001"
                          />
                          {formData.zipCode && !errors.zipCode && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                              ✓
                            </div>
                          )}
                        </div>
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-200 text-base bg-white"
                      >
                        <option value="United States">🇺🇸 United States</option>
                        <option value="Canada">🇨🇦 Canada</option>
                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                        <option value="Australia">🇦🇺 Australia</option>
                        <option value="Germany">🇩🇪 Germany</option>
                        <option value="France">🇫🇷 France</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="animate-fadeIn">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment Information</h2>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                      Choose Payment Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg ${formData.paymentMethod === 'card'
                          ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-md'
                          : 'border-gray-300 hover:border-orange-300 bg-white'
                          }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${formData.paymentMethod === 'card'
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300'
                            }`}>
                            {formData.paymentMethod === 'card' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 flex items-center">
                              💳 Credit/Debit Card
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Visa, Mastercard, American Express</div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg ${formData.paymentMethod === 'paypal'
                          ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-md'
                          : 'border-gray-300 hover:border-orange-300 bg-white'
                          }`}
                        onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${formData.paymentMethod === 'paypal'
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300'
                            }`}>
                            {formData.paymentMethod === 'paypal' && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 flex items-center">
                              🅿️ PayPal
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Pay with your PayPal account</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-lg">🔒</span>
                        <span className="text-sm font-medium text-gray-700">Your payment information is secure and encrypted</span>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base font-mono ${errors.cardNumber
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length >= 16
                                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                              } focus:outline-none focus:ring-4 focus:ring-opacity-20 bg-white`}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          {formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length >= 16 && !errors.cardNumber && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                              ✓
                            </div>
                          )}
                          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex space-x-1">
                            <span className="text-xs">💳</span>
                          </div>
                        </div>
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base font-mono ${errors.expiryDate
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : formData.expiryDate && formData.expiryDate.length >= 5
                                  ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                  : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                                } focus:outline-none focus:ring-4 focus:ring-opacity-20 bg-white`}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            {formData.expiryDate && formData.expiryDate.length >= 5 && !errors.expiryDate && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                                ✓
                              </div>
                            )}
                          </div>
                          {errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <span className="mr-1">⚠️</span>
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base font-mono ${errors.cvv
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                : formData.cvv && formData.cvv.length >= 3
                                  ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                  : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                                } focus:outline-none focus:ring-4 focus:ring-opacity-20 bg-white`}
                              placeholder="123"
                              maxLength={4}
                            />
                            {formData.cvv && formData.cvv.length >= 3 && !errors.cvv && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                                ✓
                              </div>
                            )}
                          </div>
                          {errors.cvv && (
                            <p className="mt-1 text-sm text-red-600 flex items-center">
                              <span className="mr-1">⚠️</span>
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cardholderName"
                            value={formData.cardholderName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 text-base ${errors.cardholderName
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : formData.cardholderName
                                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                                : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                              } focus:outline-none focus:ring-4 focus:ring-opacity-20 bg-white`}
                            placeholder="John Doe"
                          />
                          {formData.cardholderName && !errors.cardholderName && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                              ✓
                            </div>
                          )}
                        </div>
                        {errors.cardholderName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.cardholderName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PayPal */}
                  {formData.paymentMethod === 'paypal' && (
                    <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                      <div className="text-6xl mb-6">🅿️</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Continue with PayPal</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">You will be securely redirected to PayPal to complete your payment. Your order details will be saved.</p>
                      <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        🚀 Continue with PayPal
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-10 space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1 || isLoading}
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 ${currentStep === 1 || isLoading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      ← Previous
                    </span>
                  )}
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    disabled={isLoading}
                    className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 ${isLoading
                      ? 'bg-orange-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Continue →
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    disabled={isLoading}
                    className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base transition-all duration-200 ${isLoading
                      ? 'bg-green-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        🚀 Complete Order
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg sticky top-4 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  🛒 Order Summary
                </h3>
                <p className="text-orange-100 text-sm mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
              </div>

              <div className="p-6">
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      } hover:shadow-md border border-gray-100`}>
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-2xl">💡</span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                        <p className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-green-600 font-medium">Save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600">🎟️</span>
                    <input
                      type="text"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleInputChange}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      📦 Subtotal
                    </span>
                    <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      🚚 Shipping
                    </span>
                    <span className="text-gray-900 font-medium">
                      {isFreeShipping ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      🧾 Tax
                    </span>
                    <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
                        <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="text-green-600 text-xl">🔒</div>
                      <div>
                        <p className="text-sm font-semibold text-green-800">256-bit SSL Secure</p>
                        <p className="text-xs text-green-600">Your payment info is protected</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="text-purple-600 text-xl">↩️</div>
                      <div>
                        <p className="text-sm font-semibold text-purple-800">30-Day Returns</p>
                        <p className="text-xs text-purple-600">Free returns on all orders</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-600 text-xl">🚚</div>
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Fast Delivery</p>
                        <p className="text-xs text-blue-600">2-3 business days shipping</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>🚚 Free shipping on orders over $50</span>
            <span>↩️ 30-day returns</span>
            <span>🔄 Easy exchanges</span>
            <span>💯 100% secure checkout</span>
          </div>
        </div>
      </footer>
    </div >
  )
}

export default App
