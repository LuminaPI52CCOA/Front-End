import './Login.css'
import logo from '../../assets/logo.png'

function Login() {
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
                        placeholder="seu@email.com"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        type="password"
                        placeholder="********"
                    />
                </div>

                <a href="#" className="esqueceu">
                    Esqueceu a senha?
                </a>

                <button>
                    Acessar
                </button>

            </div>

        </div>
    )
}

export default Login