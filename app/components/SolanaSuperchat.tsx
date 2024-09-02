import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import First from "../components/superChatComponents/01";

const SolanaSuperchat = () => {
    const [data, setData] = useState<any>([]);
    const walletAddress = localStorage.getItem("lastSentAddress");

    // Function to fetch data and show toast notifications
    const fetchData = async () => {
        try {
            toast.loading('Fetching new superchats...', { id: 'fetch' });
            const response = await axios.get(`/api/fetch-superchats/${walletAddress}`);
            setData(response.data.response);

            // Success notification with a pop animation
            toast.success('Fetched new superchats successfully!', { id: 'fetch' });
        } catch (error) {
            toast.error('Error fetching superchats!');
        }
    };

    // Use effect to fetch data on component mount and set up periodic fetching
    useEffect(() => {
        fetchData();
        const intervalId = setInterval(() => {
            fetchData();
        }, 30000); // Fetch data every 5 seconds

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <Toaster position="top-right" reverseOrder={false} />
            {data.length > 0 ? (
                data.map((chat: any) => (
                    <First
                        key={chat.id}
                        username={chat.name}
                        amount={Math.floor(Math.random() * 50)}
                        message={chat.message.split(' ').slice(0, 10).join(' ')} // Limit message to first 10 words
                    />
                ))
            ) : (
                <div className='text-3xl m-3'>No super chats found for this address.</div>
            )}
        </div>
    );
};

export default SolanaSuperchat;
