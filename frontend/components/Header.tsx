export default function Header() {
    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">
                        SupportPilot
                    </h1>

                    <p className="text-sm text-gray-500">
                        AI Customer Support
                    </p>
                </div>

                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
                    Customer
                </div>
            </div>
        </header>
    );
}