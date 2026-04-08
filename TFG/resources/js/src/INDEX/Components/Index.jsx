import React from 'react'
import { Link } from 'react-router-dom'
import { HelpersIndexContext } from '../Helpers/HelpersIndex'
import Navbar from '../../Components/NavBars/NavBar'
import Footer from '../../Components/Footer/Footer'


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



            {/* 
                    <!-- <img src="img/1.png" className="superpuesta" alt="decoracion"> --> */}

            {/* <!-- Artistas Section --> */}
            <section className="section section-dark" id="artistas">
                <div className="container">
                    <div className="section-content">
                        <h2 className="section-title">Artistas</h2>
                        <p className="section-text">
                            Próximamente anunciaremos el cartel completo
                        </p>
                    </div>
                </div>
            </section>

            {/* <!-- Info Section --> */}
            <section className="section section-black" id="info">
                <div className="container">
                    <div className="section-content">
                        <h2 className="section-title">Información</h2>
                        <p className="section-text">Toda la información sobre el festival</p>
                    </div>
                </div>
            </section>

            {/* <!-- Noticias Section --> */}
            <section className="section section-dark" id="noticias">
                <div className="container">
                    <div className="section-content">
                        <h2 className="section-title">Noticias</h2>
                        <p className="section-text">Mantente al día con las últimas novedades</p>
                    </div>
                </div>
            </section>

            <Footer />

          



        </div>
    )
}

export default Index
