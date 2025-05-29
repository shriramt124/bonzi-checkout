

export default function Header() {
    return (
        <>
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
        </>
    )
}