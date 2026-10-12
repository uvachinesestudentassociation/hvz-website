import { LabDeskLoader } from "@/components/lab-desk-loader"
import { PreviousHomePage } from "@/components/previous-home-page"

export default function HomePage() {
  return (
    <>
      {/* CSS, not a client check, so desktop never paints this even for one frame. */}
      <div className="md:hidden">
        <PreviousHomePage />
      </div>
      <div className="hidden md:block">
        <LabDeskLoader />
      </div>
    </>
  )
}
