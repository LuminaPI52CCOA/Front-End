import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import './Login.css'
import logo from '../../assets/logo.png'
import olhoaberto from '../../assets/olhoaberto.svg'
import olhofechado from '../../assets/olhofechado.svg'

import * as S from './styles'

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
            
            {/*modalzinho*/}
            {isSuccess && (
                <S.Overlay>
                    <S.SuccessBox>
                        <S.AnimatedCheck viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" />
                            <path d="M30 50 L45 65 L70 35" />
                        </S.AnimatedCheck>
                        <S.SuccessTitle>Login bem-sucedido!</S.SuccessTitle>
                        <S.SuccessSubtitle>Aguarde, estamos preparando tudo...</S.SuccessSubtitle>
                    </S.SuccessBox>
                </S.Overlay>
            )}

            <div className="login-card">
                <img src={logo} alt="Logo" className="logo" />

                <h1>Login</h1>

                <p className="cargo">Recepcionista</p>

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
                                alt="Toggle visibility"
                            />
                        </button>
                    </div>
                </div>

                <button type="button" className="login-btn" onClick={(e) => fazerLogin(e)}>
                    Acessar
                </button>

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