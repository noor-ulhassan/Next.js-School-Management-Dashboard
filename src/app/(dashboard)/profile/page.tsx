import Image from "next/image";

const ProfilePage = () => {
    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="bg-white p-6 rounded-md flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Image
                    src="/avatar.png"
                    alt="avatar"
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold">John Doe</h1>
                    <span className="text-sm text-gray-400">Administrator</span>
                    <p className="text-sm text-gray-500 max-w-md">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
                        voluptatum.
                    </p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-md flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Account Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400">Email</span>
                        <span>john@doe.com</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400">Phone</span>
                        <span>+1 234 567 890</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400">Address</span>
                        <span>123 Main St, Anytown, USA</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-400">Role</span>
                        <span>Admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
