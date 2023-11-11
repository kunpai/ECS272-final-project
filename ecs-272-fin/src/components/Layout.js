import Topbar from "./Topbar";

export default function Layout({ children }) {
    return (
        <>
            <div>
                <Topbar />
            </div>
            {children}
        </>
    );
}