import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import './Login.css'
import logo from '../../assets/logo.png'
import olhoaberto from '../../assets/olhoaberto.svg'
import olhofechado from '../../assets/olhofechado.svg'
import { authService } from '../../services/authService'

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const navigate = useNavigate()

    async function fazerLogin(e) {
        e.preventDefault()
        
        if (!email || !senha) {
            setErro('Por favor, preencha todos os campos')
            return
        }

        setLoading(true)
        setErro('')

        try {
            await authService.login(email, senha)
            setIsSuccess(true)
            
            setTimeout(() => {
                navigate('/dashboard')
            }, 2500)
        } catch (error) {
            setErro(error.message || 'Erro ao fazer login. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            
            {/*modalzinho*/}
            {isSuccess && (
                <div className="overlay">
                    <div className="success-box">
                        <svg className="animated-check" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" />
                            <path d="M30 50 L45 65 L70 35" />
                        </svg>
                        <h2 className="success-title">Login bem-sucedido!</h2>
                        <p className="success-subtitle">Aguarde, estamos preparando tudo...</p>
                    </div>
                </div>
            )}

            <div className="login-card">
                <img src={logo} alt="Logo" className="logo" />

                <h1>Login</h1>

                <p className="cargo">Recepcionista</p>

                {erro && (
                    <div className="erro-mensagem">
                        {erro}
                    </div>
                )}

                <form onSubmit={fazerLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="lumina@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
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
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="olho"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                disabled={loading}
                            >
                                <img
                                    src={mostrarSenha ? olhoaberto : olhofechado}
                                    alt={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                                />
                            </button>

                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Acessar'}
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