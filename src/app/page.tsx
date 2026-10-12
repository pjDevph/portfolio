import type { Metadata } from "next";
import { Header, Hero, Snapshot, SelectedWork, Automations, Capabilities, Experience, Contact, Footer } from "@/components/site";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Home(){ return <><Header/><main><Hero/><SelectedWork/><Snapshot/><Automations/><Capabilities/><Experience/><Contact/></main><Footer/></>; }
