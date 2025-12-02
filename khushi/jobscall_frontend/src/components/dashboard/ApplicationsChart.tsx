import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type ChartData = {
  name: string;
  applications: number;
  interviews: number;
  hires: number;
}[];

type ApplicationsChartProps = {
  data?: ChartData;
  loading?: boolean;
};

// Memoize the component to prevent unnecessary re-renders
const MemoizedBarChart = memo(({ data }: { data: ChartData }) => (
  <BarChart
    data={data}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="applications" name="Applications" fill="#3b82f6" />
    <Bar dataKey="interviews" name="Interviews" fill="#f59e0b" />
    <Bar dataKey="hires" name="Hires" fill="#10b981" />
  </BarChart>
));
MemoizedBarChart.displayName = 'MemoizedBarChart';

// Memoize the loading skeleton
const LoadingSkeleton = memo(() => (
  <div className="h-[300px] w-full">
    <Skeleton className="h-full w-full" />
  </div>
));
LoadingSkeleton.displayName = 'LoadingSkeleton';

export function ApplicationsChart({ data = [], loading = false }: ApplicationsChartProps) {
  // Memoize the chart data to prevent re-renders when the reference changes but not the content
  const chartData = useMemo(() => [...data], [data]);

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Applications Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Applications Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <MemoizedBarChart data={chartData} />
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(ApplicationsChart);
