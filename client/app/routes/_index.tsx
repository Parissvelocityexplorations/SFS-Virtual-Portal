import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "SFS Virtual Portal" },
    { name: "description", content: "Welcome to the SFS Virtual Portal" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-geometric p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Pass Access Kiosk</h1>
          <p className="text-text-secondary text-xl">Schedule and manage base access passes</p>
        </header>

        <main>
          <section className="mb-10">
            <div className="card bg-surface shadow-md p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-text-primary">Getting Started</h2>
              <p className="mb-4">Schedule your base access pass through our easy-to-use kiosk system.</p>
              <a href="/kiosk" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors inline-block">
                Start Booking Process
              </a>
            </div>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="card bg-surface shadow-md p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Kiosk Mode</h3>
              <p className="text-text-secondary mb-4">Use barcode scanning to check in visitors with existing bookings.</p>
              <a href="/kiosk/scanner" className="text-link hover:underline">Enter Kiosk Mode</a>
            </div>
            
            <div className="card bg-surface shadow-md p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">DBIDS Enrollment</h3>
              <p className="text-text-secondary mb-4">Need a DBIDS? Complete the pre-enrollment process online.</p>
              <a href="https://dbids-enrollment.example.gov" target="_blank" rel="noopener noreferrer" className="text-link hover:underline">
                DBIDS Pre-Enrollment
              </a>
            </div>
          </section>
          
          <section className="bg-primary bg-opacity-5 p-6 rounded-lg mb-10 border border-primary border-opacity-20">
            <h2 className="text-2xl font-semibold mb-4 text-text-primary">Available Services</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-md bg-surface border border-divider">
                <div className="text-3xl mb-2">⛳</div>
                <div>Golf Pass</div>
              </div>
              <div className="text-center p-4 rounded-md bg-surface border border-divider">
                <div className="text-3xl mb-2">🏙️</div>
                <div>Visitor Pass</div>
              </div>
              <div className="text-center p-4 rounded-md bg-surface border border-divider">
                <div className="text-3xl mb-2">🏥</div>
                <div>VHIC</div>
              </div>
              <div className="text-center p-4 rounded-md bg-surface border border-divider">
                <div className="text-3xl mb-2">🪪</div>
                <div>DBIDS Card</div>
              </div>
            </div>
          </section>
        </main>

        <footer className="pt-10 border-t border-divider">
          <p className="text-text-secondary text-center">&copy; 2025 Pass Access Kiosk. All rights reserved.</p>
          <p className="text-center mt-2">
            <a href="#" className="text-link hover:underline">DoD Section 508</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
