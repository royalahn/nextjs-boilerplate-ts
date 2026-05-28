import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { title: "Total Users", value: "0" },
  { title: "Active Sessions", value: "0" },
  { title: "Revenue", value: "$0" },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Dashboard" />
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Your content goes here
        </div>
      </div>
    </div>
  )
}
