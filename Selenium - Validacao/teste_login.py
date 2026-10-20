# pip install selenium webdriver-manager

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import traceback
import time
import os

# Configuração do Web Driver (Google Chrome)
servico = Service(ChromeDriverManager().install())

opcoes_adicionais = ChromeOptions()
# Descomente a linha abaixo caso queira rodar sem abrir a janela do navegador (Headless):
# opcoes_adicionais.add_argument('--headless=new')

driver = webdriver.Chrome(service=servico, options=opcoes_adicionais)

# Configuração da janela do navegador
driver.set_window_size(1280, 800)

# URL base do projeto (porta padrão do Vite: 5173)
url_base = "http://localhost:5173"

# Configuração da espera explícita de até 5 segundos
espera = WebDriverWait(driver, 5)

# Garante que a pasta de prints de erro exista
os.makedirs("./telas_erros", exist_ok=True)

try:
    print("Iniciando testes da página de Login...")

    # 1. Navegar até a página de Login
    driver.get(f"{url_base}/login")

    # 2. Verificações iniciais de carregamento da página
    # Verifica se o título "Login" está presente na tag h1
    titulo_login = espera.until(EC.visibility_of_element_located((By.TAG_NAME, "h1")))
    assert "Login" in titulo_login.text, "O título 'Login' não foi encontrado na página."

    # Verifica se a descrição do cargo 'Recepcionista' está visível
    cargo_texto = driver.find_element(By.CLASS_NAME, "cargo")
    assert "Recepcionista" in cargo_texto.text, "O texto do cargo 'Recepcionista' não foi encontrado."

    # 3. Localizar os campos do formulário e botões
    input_email = driver.find_element(By.ID, "email")
    input_senha = driver.find_element(By.ID, "senha")
    botao_acessar = driver.find_element(By.CSS_SELECTOR, "button.login-btn")
    link_cadastro = driver.find_element(By.LINK_TEXT, "Cadastrar-se")

    # Verifica se os elementos estão visíveis e prontos para interação
    assert input_email.is_displayed(), "O campo de email não está visível."
    assert input_email.is_enabled(), "O campo de email deveria estar habilitado."
    assert input_senha.is_displayed(), "O campo de senha não está visível."
    assert input_senha.is_enabled(), "O campo de senha deveria estar habilitado."
    assert botao_acessar.is_displayed(), "O botão 'Acessar' não está visível."
    assert botao_acessar.is_enabled(), "O botão 'Acessar' deveria estar habilitado."
    assert link_cadastro.is_displayed(), "O link 'Cadastrar-se' não está visível."

    # 4. Teste de validação: clicar em Acessar com campos vazios
    botao_acessar.click()

    # Espera a mensagem de validação aparecer
    mensagem_erro = espera.until(
        EC.visibility_of_element_located((By.CLASS_NAME, "erro-mensagem"))
    )
    assert "Por favor, preencha todos os campos" in mensagem_erro.text, (
        "A mensagem de validação de campos vazios não foi exibida corretamente."
    )

    # 5. Teste de preenchimento dos campos de email e senha
    input_email.clear()
    input_email.send_keys("recepcao@lumina.com")
    assert input_email.get_attribute("value") == "recepcao@lumina.com", (
        "O valor inserido no campo de email está incorreto."
    )

    input_senha.clear()
    input_senha.send_keys("senhaSegura123")
    assert input_senha.get_attribute("value") == "senhaSegura123", (
        "O valor inserido no campo de senha está incorreto."
    )

    # 6. Teste de alternância de visibilidade da senha (mostrar / ocultar)
    # Inicialmente, o tipo do input de senha deve ser 'password'
    assert input_senha.get_attribute("type") == "password", (
        "O campo de senha deveria iniciar com type='password'."
    )

    # Localiza o botão do olho para exibir a senha
    botao_olho = driver.find_element(By.CLASS_NAME, "olho")
    botao_olho.click()

    # Após o clique, o campo deve mudar para 'text' (senha visível)
    assert input_senha.get_attribute("type") == "text", (
        "O tipo do campo de senha deveria mudar para 'text' após clicar no botão do olho."
    )

    # Clica novamente para ocultar a senha
    botao_olho.click()
    assert input_senha.get_attribute("type") == "password", (
        "O tipo do campo de senha deveria voltar para 'password' após novo clique."
    )

    # 7. Teste de navegação: clicar no link para a página de Cadastro
    link_cadastro.click()

    # Aguarda a URL mudar para '/cadastro'
    espera.until(EC.url_contains("/cadastro"))
    assert "/cadastro" in driver.current_url, (
        "A navegação para a página de cadastro falhou. URL atual: " + driver.current_url
    )

    print("\r\n ✅ Testes da página de Login passaram com sucesso! 💯 \r\n")

except Exception as e:
    print(f"\r\n ❌ Ocorreu um erro no teste da página de Login: {e}")

    if isinstance(e, TimeoutException):
        traceback.print_exc()

    # Salva captura de tela em caso de falha
    driver.save_screenshot("./telas_erros/teste_login.png")
    print("📸 Captura de tela do erro salva em ./telas_erros/teste_login.png")

finally:
    # Fecha o navegador e encerra a sessão
    driver.quit()
