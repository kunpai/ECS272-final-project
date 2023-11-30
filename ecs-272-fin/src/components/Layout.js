import Topbar from "./Topbar";
import PCA_Scatterplot from "./PCA-Scatterplot";

export default function Layout({ children }) {
    return (
        <>
            <div>
                <Topbar />
                <PCA_Scatterplot />
            </div>
            {children}
        </>
    );
}