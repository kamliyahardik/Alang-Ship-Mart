import { AiFillInstagram, AiFillYoutube } from "react-icons/ai"
import "../styles/footer.scss"

export default function Footer() {
    return (


        <footer>
            <div className="div1">
                <h1>
                    Alang Shipmart
                </h1>
                <p><span>&copy;</span> All rights reserved .2024</p>
            </div>

            <div className="div2">
                <h5>Follow Us</h5>

                <div style={{ animationDelay: "0.3s", }}>
                    <a className="foot" href="https://www.youtube.com/channel/UC70PjYmFnChTW8qrV4muIGQ" target={"blank"}>
                        <AiFillYoutube />
                    </a>
                </div>

                <div style={{ animationDelay: "0.3s", }}>
                    <a className="foot" href="https://www.instagram.com/bhavadip_pvt/" target={"blank"}>
                        <AiFillInstagram />
                    </a>
                </div>

            </div>
        </footer>

    )
}

