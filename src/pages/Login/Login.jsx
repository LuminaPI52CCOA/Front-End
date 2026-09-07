import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { SuccessOverlay } from '../../components/SuccessOverlay';
import styles from './Login.module.css';
import logo from '../../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  function fazerLogin() {
    console.log('Login solicitado:', { email, senha });
    setIsSuccess(true);

    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
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

        <Input
          label="Email:"
          name="email"
          type="email"
          placeholder="lumina@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Senha:"
          name="senha"
          type="password"
          placeholder="********"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <Button className={styles.button} full type="button" onClick={fazerLogin}>
          Acessar
        </Button>

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