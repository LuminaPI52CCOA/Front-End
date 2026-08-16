import { useState } from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
import olhoaberto from '../../assets/olhoaberto.svg'
import olhofechado from '../../assets/olhofechado.svg'
import { authService } from '../../services/authService'

function Login({ onNavigate }) {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState('')

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
            // Login bem-sucedido - redirecionar ou atualizar estado
            window.location.href = '/dashboard'
        } catch (error) {
            setErro(error.message || 'Erro ao fazer login. Tente novamente.')
        } finally {
            setLoading(false)
        }
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

                    <a href="#" className="esqueceu">
                        Esqueceu a senha?
                    </a>

                    <div className="cadastro-link">
                        Não tem conta? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('cadastro'); }}>Cadastre-se</a>
                    </div>

                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Acessar'}
                    </button>
                </form>

            </div>

        </div>
    )
}

export default Login