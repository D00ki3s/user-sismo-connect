import { exec } from "child_process";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container">
      <h1>
        DOOKIES PROJECT
        <br />
      </h1>
      <h2> 
        User Dashboard: <br />
        Cookies Management Dashboard
      </h2>
      <section>
        <ul>
          <li onClick={() => router.push("/user-dashboard-airdrop")}>
            <h3>
              Generate a personalized anonimous cookie <br /> wich will track your interests and preferences
            </h3>
          </li>
        </ul>
      </section>
    </div>
  );
}
