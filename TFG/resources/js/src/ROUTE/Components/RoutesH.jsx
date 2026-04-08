import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../Components/NavBars/NavBar'
import { RouteHelperContext } from '../Helpers/RouteHelper'
import Footer from './../../Components/Footer/Footer'

function RoutesH() {

  const { conciertos, setConciertos } = useContext(RouteHelperContext)

  const { filtrar } = useContext(RouteHelperContext)

  useEffect(() => {
    fetch("https://lovely-creation-production-a868.up.railway.app/filtro")
      .then(res => res.json())
      .then(setConciertos);
  }, []);


  console.log(conciertos);

  return (
    <>

      <Navbar />

      {/* <!-- Route Search Section --> */}
      <section className="route-search-section">


        <form onSubmit={filtrar} >

          <div className="container">
            <h1 className="route-main-title">ROUTE HELLBORN</h1>

            {/* <!-- Search Filters --> */}
            <div className="search-filters">
              <select className="filter-select" id="cityFilter" name='ciudad'>
                <option value="">CIUDAD</option>
                <option value="madrid">Madrid</option>
                <option value="barcelona">Barcelona</option>
                <option value="valencia">Valencia</option>
                <option value="sevilla">Sevilla</option>
                <option value="bilbao">Bilbao</option>
                <option value="zaragoza">Zaragoza</option>
                <option value="malaga">Málaga</option>
              </select>

              <input
                type="text"
                className="filter-input"
                id="searchInput"
                placeholder="BUSCAR POR TÍTULO"
                name='nombre'
              />

              <input type="date" className="filter-date" id="dateFilter" name='fechaInicio' />

              {/* Funcion para filtrar eventos */}
              <button type='submit' className="filter-button" >
                FILTRAR
              </button>
            </div>
          </div>
        </form>
      </section>


      {/* 
          <!-- Events Grid --> */}
      <section className="events-section">
        <div className="container">
          <div className="events-grid" id="eventsGrid">

            {/* <!-- Event 1 --> */}
            {/* <div className="event-card">
              <div className="event-image">
                <img
                  src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Slayer"
                />
              </div>
              <div className="event-info">
                <h3 className="event-title">SLAYER</h3>
                <p className="event-subtitle">Farewell Tour</p>
                <p className="event-date">15.06.26</p>
                <p className="event-location">WiZink Center - Madrid</p>
              </div>
            </div> */}


            {/* Cambiar a formato de arriba */}
            {conciertos.map((elemento, indice) => {
              return (
                <div className='event-card' key={indice}>
                  <div className="event-image">
                    <img src={elemento.url_img} />
                  </div>

                  <div className="event-info">
                    <h3 className="event-title">{elemento.nombre}</h3>
                    <p className="event-subtitle">{elemento.ciudad}</p>
                    {/* <p className="event-date">15.06.26</p> */}
                    <p className="event-location">{elemento.fechaInicio}</p>
                  </div>

                </div>
              )
            })}


          </div>
        </div>
      </section>

      <Footer />
    </>


  )
}

export default RoutesH