import React, { FC, ReactNode, useMemo } from 'react';
import { WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { TipLinkWalletAdapter } from '@tiplink/wallet-adapter';
import {
    WalletModalProvider,
    TipLinkWalletAutoConnectV2
} from '@tiplink/wallet-adapter-react-ui';
import { useRouter } from 'next/router';

interface WalletProviderProps {
    children: ReactNode;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
    const wallets = useMemo(
        () => [
            new TipLinkWalletAdapter({ 
                title: "Your dApp Name", 
                clientId: "4c42e6e8-c79a-4267-9c8d-653299c7825e",
                theme: "dark"  // or "light" or "system"
            }),
        ],
        []
    );

    const { query, isReady } = useRouter();

    return (
        <SolanaWalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
                <TipLinkWalletAutoConnectV2
                    isReady={isReady}
                    query={query}
                >
                    {children}
                </TipLinkWalletAutoConnectV2>
            </WalletModalProvider>
        </SolanaWalletProvider>
    );
};




