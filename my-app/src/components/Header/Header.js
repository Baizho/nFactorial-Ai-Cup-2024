import Image from "next/image";
import Link from "next/link";
import "./style.css";

export default function Header() {
    return (
        <div>
            <div className="d-flex  header" style={{ position: "relative" }}>
                <div className="d-flex align-items-center justify-content-center" style={{ height: "100%", width: "10%", position: "absolute" }}>
                    <Link className="mainPage" href="../../" alt="main" style={{ textDecoration: "none", fontFamily: "cursive" }}>DevState</Link>
                </div>
            </div>
        </div>
    );
}
