import Topbar from "./Topbar";
import PCA_Scatterplot from "./PCA-Scatterplot";
import { Button } from "react-bootstrap";

export default function Layout({ children }) {
    const handleReload = () => {
        window.location.reload(true);
    };

    return (
        <>
            <div>
                <Topbar />
                <Button onClick={handleReload}>Reset</Button>
                <PCA_Scatterplot />
            </div>
            {children}
        </>
    );
}