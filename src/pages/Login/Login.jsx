import { useState } from 'react'
import { Link } from 'react-router-dom'
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="senha">Senha</label>

                    <div className="senha-container">
                        <input
                            id="senha"
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="********"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
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

                {/* 1. Botão de Acessar agora vem primeiro */}
                <button className="login-btn" onClick={fazerLogin}>
                    Acessar
                </button>

                {/* 2. Container do rodapé com os links (iguais ao do cadastro) */}
                <div className="footer-links">
                    <p>
                        Não possui conta? <Link to="/cadastro" className="link-destaque">Cadastrar-se</Link>
                    </p>
                    <a href="#" className="esqueceu">
                        Esqueceu a sua senha?
                    </a>
                </div>

            </div>
        </div>
    )
}

export default Login