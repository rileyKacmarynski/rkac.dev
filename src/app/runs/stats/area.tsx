'use client'

import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A stacked area chart'

export type LineChartProps = {
  title: string
  label: string
  description: string
  chartData: Array<{ [key: string]: any }>
}

export function SomeChart({ title, description, label, chartData }: LineChartProps) {
  const chartConfig = {
    main: {
      label,
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  return (
    <Card className="col-span-6 @md:col-span-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid className="stroke-muted-bg" vertical={false} />
            <YAxis
              width={20}
              dataKey={label}
              tickLine={false}
              tickMargin={2}
              axisLine={false}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillMain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-main)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-main)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey={label}
              type="natural"
              fill="url(#fillMain)"
              fillOpacity={0.4}
              stroke="var(--color-main)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
