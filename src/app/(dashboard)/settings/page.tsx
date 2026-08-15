const SettingsPage = () => {
    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-md flex flex-col gap-4">
                <h1 className="text-lg font-semibold">Settings</h1>
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex flex-col">
                        <span className="font-medium">Email Notifications</span>
                        <span className="text-sm text-gray-400">
                            Receive emails about your account activity.
                        </span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-lamaPurple" />
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex flex-col">
                        <span className="font-medium">Push Notifications</span>
                        <span className="text-sm text-gray-400">
                            Get push notifications on your devices.
                        </span>
                    </div>
                    <input type="checkbox" className="w-4 h-4 accent-lamaPurple" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-medium">Dark Mode</span>
                        <span className="text-sm text-gray-400">
                            Switch between light and dark themes.
                        </span>
                    </div>
                    <input type="checkbox" className="w-4 h-4 accent-lamaPurple" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-md flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Password</h2>
                <p className="text-sm text-gray-400">
                    Update your password to keep your account secure.
                </p>
                <button className="bg-lamaSky text-gray-700 py-2 px-4 rounded-md text-sm w-max">
                    Change Password
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
