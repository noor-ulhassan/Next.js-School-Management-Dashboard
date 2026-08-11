const announcements = [
    {
        id: 1,
        title: "Lorem ipsum dolor sit",
        date: "2025-01-01",
        description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        color: "bg-lamaSkyLight",
    },
    {
        id: 2,
        title: "Lorem ipsum dolor sit",
        date: "2025-01-01",
        description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        color: "bg-lamaPurpleLight",
    },
    {
        id: 3,
        title: "Lorem ipsum dolor sit",
        date: "2025-01-01",
        description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
        color: "bg-lamaYellowLight",
    },
];

const Announcements = () => {
    return (
        <div className="bg-white p-4 rounded-md">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Announcements</h1>
                <span className="text-xs text-gray-400">View All</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {announcements.map((announcement) => (
                    <div className={`${announcement.color} rounded-md p-4`} key={announcement.id}>
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium">{announcement.title}</h2>
                            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                                {announcement.date}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{announcement.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;
