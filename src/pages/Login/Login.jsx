import { useState } from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
import olhoaberto from '../../assets/olhoaberto.svg'
import olhofechado from '../../assets/olhofechado.svg'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)

    function fazerLogin() {
        console.log(email)
        console.log(senha)
    }

    return (
        <div className="container">
            <div className="login-card">

                <img
                    src={logo}
                    alt="Logo"
                    className="logo"
                />

                <h1>Login</h1>

                <p className="cargo">
                    Recepcionista
                </p>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="lumina@email.com"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="senha">Senha</label>

                    <div className="senha-container">

                        <input
                            id="senha"
                            //Se o mostrarSenha for true, será "text"
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="********"
                        />

                        <button
                            type="button"
                            className="olho"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                            <img
                                src={mostrarSenha ? olhoaberto : olhofechado}
                                alt={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            />
                        </button>

                    </div>
                </div>

                <a href="#" className="esqueceu">
                    Esqueceu a senha?
                </a>

                <button className="login-btn">
                    Acessar
                </button>

            </div>

        </div>
    )
}

export default Login