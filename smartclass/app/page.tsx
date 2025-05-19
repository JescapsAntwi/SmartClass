import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the loading screen
  redirect("/loading")
}
