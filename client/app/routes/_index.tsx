import React from 'react';
import { Link } from '@remix-run/react';
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Space Force Visitor Portal" },
    { name: "description", content: "Welcome to the Space Force Visitor Portal" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-space-pattern flex flex-col">
      <header className="bg-primary text-white p-6 relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/Space_Launch_Delta_45_emblem 2.png" 
              alt="Space Launch Delta 45" 
              className="h-16 mr-4" 
            />
            <h1 className="text-3xl text-white font-bold">Space Force Visitor Portal</h1>
          </div>
          <Link
            to="/admin/signin"
            className="text-white hover:text-gray-200 font-medium"
          >
            Admin Sign In
          </Link>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto py-10 px-4">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-lg p-10 max-w-5xl mx-auto border border-divider mb-12">
          <div className="flex flex-col md:flex-row items-center mb-8">
            <img 
              src="/Space_Systems_Command_emblem.svg 1.png" 
              alt="Space Systems Command" 
              className="h-24 md:h-32 mb-6 md:mb-0 md:mr-8" 
            />
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Welcome to the Visitor Portal</h2>
              <p className="text-text-secondary text-lg mb-2">
                This site was designed to help expedite your processing time before entering a government installation.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-primary p-4 mb-8">
            <p className="text-text-primary font-medium">
              <span className="font-bold">Disclosure:</span> Providing registration information is voluntary. Failure to provide requested information may result in a denial of access to benefits, privileges, and D.o.D. installations, facilities and buildings.
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-primary mb-3">Privacy Act Notice</h3>
            <p className="mb-3"><span className="font-bold">AUTHORITY:</span> 10 U.S.C. 136, Under Secretary of Defense for Personnel and Readiness; DoD Instruction (DoDI) 1000.25, DoD Personnel Identity Protection (PIP) Program; DoDI 5200.08, Security of DoD Installations and Resources and the DoD Physical Security Review Board (PSRB); DoD 5200.08-R, Physical Security Program; and E.O. 9397 (SSN), as amended.</p>
            
            <p className="mb-3"><span className="font-bold">PRINCIPAL PURPOSE(S):</span> To provide necessary information to DoD installations to determine if applicant meets access control requirements. Use of SSN is necessary to make positive identification of an applicant. Records in the DBIDS system are maintained to support Department of Defense physical security and information assurance programs and are used for identity verification purposes, to record personal property registered with the DoD, and for producing facility management reports. Used by security offices to monitor individuals accessing DoD installations and/or facilities. SSN, Driver's License Number, or other acceptable identification will be used to distinguish individuals who request entry to DoD installations and/or facilities.</p>
            
            <p className="mb-3"><span className="font-bold">ROUTINE USE(S):</span> To the appropriate Federal, State, local, territorial, tribal, foreign, or international law enforcement authority or other appropriate entity where a record, either alone or in conjunction with other information, indicates a violation or potential violation of law, whether criminal, civil, or regulatory in nature. The remaining routine uses can be found in the applicable system of records notice, DMDC 10 DoD, Defense Biometric Identification Data System (DBIDS), located at: http://dpcld.defense.gov/Privacy/SORNsIndex/DOD-wide-SORN-Article-View/Article/570565/dmdc-10-dod/</p>
            
            <p><span className="font-bold">DISCLOSURE:</span> Voluntary; however, failure to provide the requested information will result in denial of a DBIDS card or visitors pass and denial of entry to DoD installations and/or facilities.</p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold text-primary mb-3">Consent To Monitor</h3>
            <p className="font-medium mb-3">Use of this U.S. Government (USG)-interest computer system constitutes consent for authorized monitoring at all times.</p>
            
            <p className="mb-3">This is a USG-interest computer system. This system and related equipment are intended for the communication, transmission, processing, and storage of official USG or other authorized information only. This USG-interest computer system is subject to monitoring at all times to ensure proper functioning of equipment and systems including security systems and devices, and to prevent, detect, and deter violations of statutes and security regulations and other unauthorized use of the system.</p>
            
            <p className="mb-3">Communications using, or data stored on, this system are not private, are subject to routine monitoring, interception, and search, and may be disclosed or used for any authorized purpose.</p>
            
            <p className="mb-3">If monitoring of this USG-interest computer system reveals possible evidence of violation of criminal statutes, this evidence and any other related information, including identification information about the user, may be provided to law enforcement officials. If monitoring of this USG-interest computer systems reveals violations of security regulations or other unauthorized use that information and other related information, including identification information about the user, may be used appropriate administrative or disciplinary action.</p>
            
            <p className="font-medium">Use of this USG interest computer system constitutes consent to authorized monitoring at all times.</p>
          </div>
          
          <div className="flex justify-center">
            <Link
              to="/kiosk"
              className="btn-primary btn-lg flex items-center justify-center w-64 transition-all transform hover:scale-105"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Enter the Appointment Portal to schedule your base visit</p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto">
          <div className="text-center">
            <p>Space Force Visitor Management Portal</p>
            <p className="text-sm text-gray-400 mt-2">© {new Date().getFullYear()} United States Space Force. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
