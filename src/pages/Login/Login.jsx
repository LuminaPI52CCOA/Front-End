import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SuccessOverlay } from '../../components/SuccessOverlay';
import { authService } from '../../services/authService';
import styles from './Login.module.css';
import logo from '../../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  function entrarDireto() {
    if (!localStorage.getItem('user')) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 1,
          idUsuario: 1,
          nome: 'Administrador Lumina',
          email: 'admin@lumina.com',
          perfil: 'ADMIN',
          role: 'ADMIN',
        })
      );
    }
    navigate('/dashboard');
  }

  async function fazerLogin(e) {
    if (e && e.preventDefault) e.preventDefault();

    if (!email || !senha) {
      entrarDireto();
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await authService.login(email, senha);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.warn('Login falhou ou servidor offline, permitindo acesso direto:', error);
      entrarDireto();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      {isSuccess && (
        <SuccessOverlay
          title="Login bem-sucedido!"
          subtitle="Aguarde, estamos preparando tudo..."
        />
      )}

      <div className={styles.card}>
        <img src={logo} alt="Logo Lumina" className={styles.logo} />

        <h1 className={styles.title}>Login</h1>

        <p className={styles.cargo}>Recepcionista</p>

        {erro && (
          <div className={styles.erroMensagem} role="alert">
            {erro}
          </div>
        )}

        <form onSubmit={fazerLogin}>
          <Input
            id="email"
            label="Email:"
            name="email"
            type="email"
            placeholder="lumina@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Input
            id="senha"
            label="Senha:"
            name="senha"
            type="password"
            placeholder="********"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />

          <Button
            className={styles.button}
            full
            type="submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Acessar'}
          </Button>

          <button
            type="button"
            className={styles.botaoPassarDireto}
            onClick={entrarDireto}
          >
            Passar direto sem login →
          </button>
        </form>

        <div className={styles.footerLinks}>
          <p>
            Não possui conta?{' '}
            <Link to="/cadastro" className={styles.linkDestaque}>
              Cadastrar-se
            </Link>
          </p>
          <a href="#" className={styles.esqueceu}>
            Esqueceu a sua senha?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;