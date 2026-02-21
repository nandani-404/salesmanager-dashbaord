import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-700">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-600">
          Comprehensive reporting and business intelligence
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Reports Coming Soon
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            Advanced reporting features including revenue analytics, performance metrics,
            and custom report generation will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

