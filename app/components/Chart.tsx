"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Connection, PublicKey } from "@solana/web3.js"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart showing Solana transactions"

const chartConfig = {
  transactions: {
    label: "Transactions",
  },
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function Chart({walletAddress}: {walletAddress: string}) {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [transactionData, setTransactionData] = React.useState([])

  React.useEffect(() => {
    const fetchTransactions = async () => {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed")
      const publicKey = new PublicKey(walletAddress)

      try {
        const transactions = await connection.getSignaturesForAddress(publicKey, {limit: 1000})
        
        const processedData = transactions.reduce((acc, tx) => {
          const date = new Date(tx.blockTime * 1000).toISOString().split('T')[0]
          acc[date] = (acc[date] || 0) + 1
          return acc
        }, {})

        const chartData = Object.entries(processedData).map(([date, count]) => ({
          date,
          count
        }))

        setTransactionData(chartData)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      }
    }

    fetchTransactions()
  }, [walletAddress])

  const filteredData = transactionData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })
  if (!walletAddress) {
    return (
      <Card>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <CardDescription>No wallet address provided</CardDescription>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Solana Transactions - Interactive</CardTitle>
          <CardDescription>
            Showing transactions for wallet: {walletAddress}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-count)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="count"
              type="monotone"
              fill="url(#fillCount)"
              stroke="var(--color-count)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
