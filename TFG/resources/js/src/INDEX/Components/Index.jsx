import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../Components/NavBars/NavBar'


// INDEX
function Index() {

    return (
        <div>

            <Navbar />


            {/* 
                    <!-- Hero Section --> */}
            <section className="hero" id="inicio">
                <video autoPlay muted loop playsInline preload="metadata" className="bg-video" poster="logo.webp">
                    <source src="video-f.webm" type="video/webm" />
                    <source src="video.webm" type="video/webm" />
                </video>
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">Abonos ya a la venta</h1>
                        <p className="hero-text">
                            Prepárate para una nueva edición de Hellborn Fest. Tenlo todo listo
                            para conseguir tu plaza. Te esperamos en esta nueva edición que
                            tendrá lugar el 1, 2, 3 y 4 de julio de 2026.
                        </p>
                        <Link to="/Tickets" className="hero-button">Tickets Aquí</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Index
