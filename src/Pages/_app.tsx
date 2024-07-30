import '../styles/globals.css';
import { AppProps } from 'next/app';
import { WalletProvider } from '../Components/WalletProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp;


