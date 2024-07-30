This project is the landing page for ArmeniLeds webpage/app. The page provides information about the project and current build.


**Tools and Technologies Used**

Next.js: Framework for server-rendered React applications.
React: JavaScript library for building user interfaces.
TypeScript: Superset of JavaScript that adds static types.
Vanilla CSS: For styling the components.
Framer Motion: For animations and interactive UI elements.
Solana Wallet Adapter: To connect with Solana wallets like TipLink.
TipLink: Wallet adapter for the Solana blockchain.

**Features**

Dynamic Content: The page fetches and displays live data from the Solana blockchain.
Solana Wallet Integration: Users can connect their Solana wallets to interact with the application.
Responsive Design: Optimized for various screen sizes and devices.
Animations: Smooth and interactive animations using Framer Motion.
Project Setup

**Prerequisites**

Node.js (version 14 or later)
Yarn (recommended) or npm

**Installation**
Clone the Repository:
git clone https://github.com/jbrace02/armeni-leds-sol.git
cd armeni-leds-sol

Install Dependencies:

yarn install

If you prefer npm, use:

npm install
Create a .env File:
Create a .env file in the root directory and add the following environment variable:

env
NEXT_PUBLIC_CLIENT_ID=your-client-id-here
Run the Development Server:

yarn dev
If you prefer npm, use:

npm run dev
Build for Production:

yarn build
If you prefer npm, use:

npm run build
Start the Production Server:

yarn start
If you prefer npm, use:

npm run start

**Project Structure**

src: Contains all source code.
Components: Reusable UI components.
Pages: Next.js pages.
styles: CSS files for styling.
public: Public assets like images and fonts.
.env: Environment variables.
next.config.js: Next.js configuration.
tsconfig.json: TypeScript configuration.
package.json: Project metadata and dependencies.

**Contributing**
Fork the repository.
Create a new branch for your feature or bug fix.
Commit your changes.
Push to the branch.
Create a pull request.
Issues and Feedback
If you encounter any issues or have feedback, please open an issue on GitHub or contact us directly.

License
This project is licensed under the MIT License. See the LICENSE file for details.
