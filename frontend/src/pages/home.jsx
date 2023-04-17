import React from "react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button
    } from "@material-tailwind/react";
    import {
    CalendarIcon,
    ListBulletIcon,
    } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate()

    const data = [
    {
        label: "Events",
        value: "events",
        icon: CalendarIcon,
        desc: `A list of events`,
    },
    {
        label: "Items",
        value: "items",
        icon: ListBulletIcon,
        desc: `A list of items.`,
    },
        ];

    function onClickHandleInvitations(){
        navigate('/invitations')
    }

    return (
    <>
    <Tabs className='mt-3' value="dashboard">
        <TabsHeader>
            {data.map(({ label, value, icon }) => (
            <Tab key={value} value={value}>
                <div className="flex items-center gap-2">
                {React.createElement(icon, { className: "w-5 h-5" })}
                {label}
                </div>
            </Tab>
            ))}
        </TabsHeader>
        <TabsBody 
        animate={{
            initial: { y: 250 },
            mount: { y: 0 },
            unmount: { y: 250 },
        }}>
            {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
                {desc}
            </TabPanel>
            ))}
        </TabsBody>
    </Tabs>
    <div className="text-center">
    <Button onClick={onClickHandleInvitations} variant='outlined' className="flex m-auto pb-7 h-2">
            Invitations (pending) <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 pb-2">
    <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clipRule="evenodd" />
</svg>

    </Button>
    </div>
</>
    );
}