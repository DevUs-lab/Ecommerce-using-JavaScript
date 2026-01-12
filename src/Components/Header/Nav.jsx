import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
    return (
        <>
            <header>
                <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-2">
                    <div className="container d-flex justify-content-between">

                        <p className="mb-0 header-p text-light p-2">
                            Free shipping, 30-day return or refund guarantee.
                        </p>

                        {/* <ul className="navbar-nav d-flex flex-row ms-auto">
                            <li className="nav-item me-2" id="login-link">
                                <a className="nav-link px-2 px-md-3" href="./login.html">Login</a>
                            </li>

                            <li className="nav-item" id="register-link">
                                <a className="nav-link px-2 px-md-3" path="register" href="./register.html">Register</a>
                            </li>

                            <li className="nav-item d-none" id="logout-link">
                                <button className="nav-link px-2 px-md-3 btn btn-link text-danger">Logout</button>
                            </li>
                        </ul> */}

                    </div>
                </nav>

                <nav className="navbar navbar-expand-lg bg-light navbar-light py-3">
                    <div className="container">
                        <Link className="navbar-brand p-2 px-3" to="/">Umair Store</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0" id="mainNav">

                                <li className="nav-item text-dark">
                                    <Link className="nav-link px-3 active" data-link="home" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/register">Register</Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link className="nav-link px-3" data-link="about" to="/about">About</Link>
                                </li> */}
                                <li className="nav-item">
                                    <Link className="nav-link px-3" data-link="products" to="/products">Products</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" data-link="Contact" to="/contact">Contact</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link btn cartBtn rounded-0 px-3 text-start text-lg-center" id="cart-btn" data-link="cart" type="button"><i className="fa-solid fa-cart-flatbed "></i>
                                        <sup className="text-danger fw-bold" id="count">0</sup>
                                    </button>
                                </li>
                            </ul>

                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Nav