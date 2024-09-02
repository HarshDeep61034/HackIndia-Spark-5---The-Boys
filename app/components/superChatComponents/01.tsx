"use client"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, DollarSign } from 'lucide-react';

const First = ({ username, message, amount }:any) => {
  return (
    <Card className={`w-full max-w-md m-10 border-l-4 border-purple-500`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span className="font-bold">{username}</span>
          </div>
          <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>{amount}</span>
          </div>
        </div>
        <p className="text-gray-700">{message}</p>
      </CardContent>
    </Card>
  );
};


export default First;