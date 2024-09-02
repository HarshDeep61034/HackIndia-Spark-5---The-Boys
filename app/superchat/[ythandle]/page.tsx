"use client";
import React from "react";
import { useParams } from "next/navigation";
import SignupFormDemo from "@/app/components/Streaming";

export default function Page() {
    const { ythandle } = useParams();

    return (
        <div className="">
            <div className="m-4 text-center font-medium text-xl">
                <span className="font-semibold">{ythandle}</span>  is streaming right now
            </div>
            <div className="flex items-center justify-between m-5 bg-gray-200 p-4 rounded-lg shadow-md">
                <div className="flex-shrink-0  h-96 w-96">
                    <img src="/video-player-movie-svgrepo-com.svg" alt="Video Player" className="object-cover h-full w-full rounded-lg" />
                </div>
                <div className="flex-1 ml-8">
                    <SignupFormDemo />
                </div>
            </div>

        </div>
    );
}



// (async () => {
//     try {
//       const fetch = (await import('node-fetch')).default;
  
//       const apiKey = 'AIzaSyCyiqiUsW3w5oaEJC7K6gjiJXoPoUPOKLY';
//       const channelName = '@HealthyGamerGG';
//       const searchApiUrl = https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelName}&type=channel&key=${apiKey};

//       const searchResponse = await fetch(searchApiUrl);
//       const searchData = await searchResponse.json();
//       console.log(searchData)
  
//       if (searchData.items && searchData.items.length > 0) {
//         const channelId = searchData.items[0].id.channelId;
//         console.log('Channel ID:', channelId);
  
//         // Step 2: Check live broadcast status
//         const liveApiUrl = https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey};
//         const liveResponse = await fetch(liveApiUrl);
//         const liveData = await liveResponse.json();
  
//         if (liveData.items && liveData.items.length > 0) {
//           const liveBroadcastContent = liveData.items[0].snippet.liveBroadcastContent;
//           console.log('Live Broadcast Content:', liveBroadcastContent);
//         } else {
//           console.log('No live video found for this channel.');
//         }
//       } else {
//         console.log('No channel found with that name.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   })();