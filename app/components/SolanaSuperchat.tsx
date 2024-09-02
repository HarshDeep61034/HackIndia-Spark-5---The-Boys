import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import First from "../components/superChatComponents/01";

const SolanaSuperchat = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const walletAddr = localStorage.getItem("lastSentAddress");
        if (!walletAddr) {
          throw new Error("Wallet address not found in localStorage");
        }

        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        const publicKey = new PublicKey(walletAddr);

        const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });

        const processedTransactions = await Promise.all(
          signatures.map(async (sig) => {
            const tx = await connection.getTransaction(sig.signature);
            if (!tx) return null;

            const solAmount = (tx.meta?.postBalances[0] - tx.meta?.preBalances[0]) / 1e9; // Convert lamports to SOL
            
            return {
              signature: sig.signature,
              sender: tx.transaction.message.accountKeys[0].toString(),
              amount: solAmount.toFixed(2),
              message: tx.meta?.logMessages?.join(' ') || 'No message',
            };
          })
        );

        setTransactions(processedTransactions.filter(Boolean));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {transactions.length > 0 ? (
        transactions.map((tx) => (
          <First
            key={tx.signature}
            username={tx.sender.slice(0, 8)} // Use first 8 characters of sender's address as username
            amount={tx.amount}
            message={tx.message.split(' ').slice(0, 10).join(' ')} // Limit message to first 10 words
          />
        ))
      ) : (
        <div>No transactions found for this address on devnet.</div>
      )}
    </div>
  );
};

export default SolanaSuperchat;