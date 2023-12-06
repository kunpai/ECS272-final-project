"use client";
import { Container, Navbar, Nav, Offcanvas } from "react-bootstrap";
import Image from "next/image";
import logo from "public/gem5ColorLong.png";
import Link from "next/link";

export default function Topbar() {
    return (
        <>

            <Navbar bg="light" className="shadow-sm" expand="lg">
                <Container fluid>
                    <Navbar.Brand href="/" as={Link}>
                        <Image
                            src={logo}
                            alt="Gem5 Logo"
                            height={55}
                            priority
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
                    <Navbar.Offcanvas
                        id={`offcanvasNavbar-expand-sm`}
                        aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
                        placement="end"
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                                gem5 Visualization
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link href="/" as={Link} className="main-text-regular">Home</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    )
}