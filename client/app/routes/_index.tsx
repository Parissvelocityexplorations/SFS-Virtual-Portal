import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "SFS Virtual Portal" },
    { name: "description", content: "Welcome to the SFS Virtual Portal" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">SFS Virtual Portal</h1>
          <p className="text-text-secondary text-xl">Welcome to the SFS Virtual Portal System</p>
        </header>

        <main>
          <section className="mb-10">
            <div className="card bg-surface shadow-md p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-text-primary">Getting Started</h2>
              <p className="mb-4">This portal provides resources and tools for SFS program participants.</p>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="card bg-surface shadow-md p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Resources</h3>
              <p className="text-text-secondary mb-4">Access educational materials and career resources.</p>
              <a href="#" className="text-primary hover:underline">Browse Resources</a>
            </div>
            
            <div className="card bg-surface shadow-md p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Community</h3>
              <p className="text-text-secondary mb-4">Connect with other SFS participants and alumni.</p>
              <a href="#" className="text-primary hover:underline">Join Community</a>
            </div>
          </section>
          
          <section className="bg-secondary text-white p-6 rounded-lg mb-10">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            <p className="mb-4">Stay updated with the latest SFS events and opportunities.</p>
            <button className="bg-white text-secondary px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
              View Calendar
            </button>
          </section>
        </main>

        <footer className="pt-10 border-t border-divider">
          <p className="text-text-secondary text-center">&copy; 2025 SFS Virtual Portal. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
