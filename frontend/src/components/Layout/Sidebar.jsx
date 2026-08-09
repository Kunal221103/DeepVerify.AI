import { Link } from "react-router-dom";
import {
    FaHome,
    FaUpload,
    FaHistory,
    FaFilePdf,
    FaCog
} from "react-icons/fa";

export default function Sidebar() {

    return (

        <aside className="w-64 bg-slate-900 border-r border-slate-700">

            <nav className="flex flex-col p-4 gap-3">

                <Link to="/" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800">
                    <FaHome />
                    Home
                </Link>

                <Link to="/upload" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800">
                    <FaUpload />
                    Upload
                </Link>

                <Link to="/history" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800">
                    <FaHistory />
                    History
                </Link>

                <Link to="/reports" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800">
                    <FaFilePdf />
                    Reports
                </Link>

                <Link to="/settings" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800">
                    <FaCog />
                    Settings
                </Link>

            </nav>

        </aside>

    );

}