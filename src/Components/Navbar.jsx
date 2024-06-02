nav {
    display: flex;
    align-items: center;
    padding: .25rem 10%;
    justify-content: space-between;
    position: sticky;
    background-color: #fff;
    top: 0;
    z-index: 20;

    --primaryColor: #CE1317;
}

.logo {
    width: 70px;
}

ul, a {
    list-style: none;
    text-decoration: none;
}

.navlist {
    display: flex;
    align-items: center;
    gap: 3rem;
}

.navitem {
    color: var(--primaryColor);
    transition: all .2s ease-in-out;
    text-transform: uppercase;
    font-size: 1.25rem;
    position: relative;
}

/* hover color #780d0f */

.navitem::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: var(--primaryColor);
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
}


.navitem:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
}

.navbuttons {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.buy_btn {
    background-color: var(--primaryColor);
    color: #fff;
    border: 0;
    font-family: inherit;
    font-weight: 700;
    border-radius: 10px;
    padding: .85rem 1.5rem;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all .2s ease-in-out;
}

.buy_btn:hover {
    background-color: #780d0f;
}

.hamburger-react {
    display: none;
}

/* responsiveness */
@media(max-width: 500px) {

    .logo {
        width: 70px;
    }

    .navlist, .navbuttons {
        display: none;
    }

    .hamburger-react {
        display: block;
    }

    .menu_container {
        background-color: var(--secColor);
        padding: 0 10%;
        position: fixed;
        z-index: 10;
        height: 100%;
        inset: 15% 0 0 0;
    }

    .navlist_mobile {
        padding: 0;
    }

    .navitem {
        color: #fff;
        font-size: 1.5rem;
        line-height: 2.5;
        border-bottom: 1px solid #1B0522;
        transition: all .2s ease-in-out;
    }

    .navitem:hover {
        color: #e2e2e2;
        border-bottom: 3px solid #1B0522;
    }

    .btn_mobile {
        width: 100%;
        margin-top: 2rem;
        padding: 1rem 0;
        border: 0;
        border-radius: 25px;
        color: #1B0522;
        font-size: 1.2rem;
        font-weight: 600;
        font-family: inherit;
    }
}
