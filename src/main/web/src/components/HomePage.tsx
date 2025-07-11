function HomePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold">
                Hello Veil!
            </h1>
            <div className="flex justify-center gap-4 mt-8">
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Get Keys</button>
                <button className="bg-red-600 text-white px-4 py-2 rounded">Start now</button>
            </div>
        </div>
    );
}

export default HomePage;