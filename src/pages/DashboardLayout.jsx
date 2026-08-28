import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f4f6f9",
                direction: "rtl",
            }}
        >

            {/* القائمة الجانبية */}
            <Sidebar />

            {/* المحتوى الرئيسي */}
            <div
                style={{
                    marginRight: "260px",
                    minHeight: "100vh",
                }}
            >

                <Topbar />

                <div
                    style={{
                        padding: "30px",
                    }}
                >
                    <Outlet />
                </div>

            </div>

        </div>
    );
}