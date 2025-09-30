import { useEffect, useState } from "react";
import { adminOnlyInfo } from "../api/auth";
import type { ApiError } from "../types/api";

export default function Admin() {
    const [msg, setMsg] = useState<string>("");

    // Function to get admin info
    const adminInfo = async () => {
        try {
            const res = await adminOnlyInfo();
            setMsg(res.data.message);
        } catch (err) {
            console.log(err)
            setMsg((err as ApiError).response?.data?.message || "Error");
        }
    };
    useEffect(() => {adminInfo()}, []);
    
    return <>
        <h1>Admin Page</h1>
        <p>API Message: {msg}</p>
    </>;
}