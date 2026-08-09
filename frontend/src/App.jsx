import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Result from "./pages/Result";


export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/upload"
                    element={<Upload />}
                />

                <Route
                    path="/history"
                    element={<History />}
                />

                <Route
                    path="/reports"
                    element={<Reports />}
                />

                <Route
                    path="/settings"
                    element={<Settings />}
                />

                <Route
                    path="/result"
                    element={<Result />}
                />

                <Route
                    path="/result/:scanId"
                    element={<Result />}
                />

            </Routes>

        </BrowserRouter>

    );

}