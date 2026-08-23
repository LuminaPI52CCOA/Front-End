import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import './Login.css'
import logo from '../../assets/logo.png'
import olhoaberto from '../../assets/olhoaberto.svg'
import olhofechado from '../../assets/olhofechado.svg'
import SuccessModal from '../../components/SuccessModal'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false) 

    const navigate = useNavigate()

function fazerLogin() {
        console.log('Login solicitado:', { email, senha })
        
        setIsSuccess(true)

        setTimeout(() => {
            navigate('/dashboard') 
        }, 2500)
    }
    return (
        <div className="container">
            
            {isSuccess && (
                <SuccessModal
                    titulo="Login bem-sucedido!"
                    subtitulo="Aguarde, estamos preparando tudo…"
                />
            )}

            <div className="login-card">
                <img src={logo} alt="Logo" className="logo" />

                <h1>Login</h1>

                <p className="cargo">Recepcionista</p>

                <form onSubmit={(e) => { e.preventDefault(); fazerLogin() }} noValidate>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            spellCheck={false}
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
                                name="senha"
                                type={mostrarSenha ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="********"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                            <button
                                type="button"
                                className="olho"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                                aria-pressed={mostrarSenha}
                            >
                                <img
                                    src={mostrarSenha ? olhoaberto : olhofechado}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="login-btn">
                        Acessar
                    </button>
                </form>

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