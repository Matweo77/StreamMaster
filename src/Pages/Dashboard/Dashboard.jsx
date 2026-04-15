import { MetricCards } from "./metriccards"
import { PaymentsTable } from "./paymentstable"
import { PlatformsChart } from "./platformschart"
import { ActivityFeed } from "./activityfeed"
import { PromoCarousel } from "./promocarousel"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Metric Cards */}
          <MetricCards />
          
          {/* Main Grid - Reorganized layout */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Table (2 cols) */}
            <div className="lg:col-span-2">
              <PaymentsTable />
            </div>
            
            {/* Right Column - Activity Feed */}
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>
          
          {/* Bottom Section - Platforms + Carousel */}
          <div className="grid gap-6 lg:grid-cols-2">
            <PlatformsChart />
            <PromoCarousel />
          </div>
        </div>
      </main>
    </div>
  )
}
