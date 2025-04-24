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
              <a href="/kiosk" className="button secondary xl">
                Start Booking Process
                <svg className="right w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="card bg-surface shadow-md p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Kiosk Mode</h3>
              <p className="text-text-secondary mb-4">Use barcode scanning to check in visitors with existing bookings.</p>
              <a href="/kiosk/scanner" className="button text">
                Enter Kiosk Mode
                <svg className="right w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            <div className="card bg-surface shadow-md p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">DBIDS Enrollment</h3>
              <p className="text-text-secondary mb-4">Need a DBIDS? Complete the pre-enrollment process online.</p>
              <a href="https://dbids-enrollment.example.gov" target="_blank" rel="noopener noreferrer" className="button text">
                DBIDS Pre-Enrollment
                <svg className="right w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </section>
          
          <section className="bg-panel p-6 rounded-lg mb-10 border border-divider">
            <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Available Services</h2>
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
